import {
  ChevronRightIcon,
  MinusIcon,
  PlayIcon,
  PlusIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ascending, descending, group, groups } from "d3-array";
import { Reorder } from "framer-motion";
import produce from "immer";
import { nanoid } from "nanoid";
import * as React from "react";
import {
  createBrowserRouter,
  Link,
  Navigate,
  Outlet,
  redirect,
  RouterProvider,
  useFetcher,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigate,
  useParams,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { tw } from "twind";
import create from "zustand";
import { persist } from "zustand/middleware";
import * as components from "./components";
import supabase from "./lib/supabase";

const ROUTE_NAME_SPLITTER = /\s*\/\s*/;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        loader: loadLanding,
        element: <Landing />,
      },
      {
        path: "sign-in",
        loader: loadSession,
        element: <SignIn />,
      },
      {
        path: "divisions",
        loader: loadDivisions,
        element: <Divisions />,
      },
      {
        path: "divisions/:divisionId",
        loader: loadDivision,
        element: <Outlet />,
        children: [
          {
            path: "rounds",
            loader: loadRounds,
            element: <Rounds />,
          },
          {
            path: "rounds/:roundId",
            loader: loadRound,
            element: <Outlet />,
            children: [
              {
                path: "",
                element: <Scoring />,
              },
              {
                path: "queue",
                loader: loadCompetitors,
                element: <Queue />,
              },
              {
                path: "routes",
                loader: loadRoutes,
                element: <Routes />,
              },
              {
                path: "routes/:routeId",
                element: <Outlet />,
                loader: loadRoute,
                children: [
                  {
                    path: "attempt",
                    loader: loadAttemptDetails,
                    element: <Attempt />,
                    action: writeQueuedAttempt,
                  },
                ],
              },
              {
                path: "batch",
                loader: loadBatch,
                element: <Batch />,
              },
              {
                path: "batch/attempts",
                loader: loadAttempts,
                action: writeAttempt,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const useStore = create<{
  queue: any[];
  setQueue: (items: any[]) => void;
  enqueue: (item: any) => void;
  dequeue: (item: any) => void;
  onDeck: any;
  setOnDeck: (item: any) => void;
}>(
  persist(
    (set) => ({
      queue: [],
      setQueue: (queue) => set({ queue }),
      enqueue: ({ number, name }) =>
        set(
          produce((state) => {
            state.queue.push({
              id: nanoid(),
              number,
              name,
            });
          })
        ),
      dequeue: ({ id }) =>
        set(
          produce((state) => {
            state.queue = state.queue.filter((item) => item.id !== id);
          })
        ),
      onDeck: null,
      setOnDeck: (item) =>
        set(
          produce((state) => {
            state.onDeck = item;
          })
        ),
    }),
    {
      name: "tallytop",
      getStorage: () => sessionStorage,
    }
  )
);

function Root() {
  const breadcrumbs = useMatches()
    .filter((m) => m.data?.name)
    .map((m) => m.data);

  return (
    <>
      <div className={tw`flex text-sm text-gray-500 border-b`}>
        {breadcrumbs.map(({ name }, i) => (
          <React.Fragment key={i}>
            <div className={tw`p-3`}>{name}</div>
            {i + 1 < breadcrumbs.length ? (
              <ChevronRightIcon className={tw`w-5`} />
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <div className={tw`w-screen h-screen flex flex-col text-gray-700`}>
      <a href="/" className={tw`bg-purple-500 flex justify-center`}>
        <img src="/logo-ale.svg" className={tw`h-20`} />
      </a>
      <RouterProvider router={router} />
    </div>
  );
}

async function loadSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    if (error) {
      console.error(error);
    }
    return;
  }
  return data.session;
}

async function fetchCompetitors() {
  const { data, error } = await supabase
    .from("competitors")
    .select("*, divisions(*)");
  if (error) {
    console.error(error);
    return;
  }
  return data;
}

async function fetchScores() {
  const { data, error } = await supabase.from("scores").select();
  if (error) {
    console.error(error);
    return;
  }
  return data;
}

async function loadLanding() {
  const session = await loadSession();
  const rounds = await loadRounds();

  const competitors = await fetchCompetitors();
  const groupedCompetitors = competitors
    ? groups(competitors, (d) => d.divisions.name)
    : [];

  const scores = await fetchScores();
  const groupedScores = group(
    scores,
    (d) => d.round_id,
    (d) => d.competitor_id
  );

  return { session, rounds, groupedCompetitors, groupedScores };
}

function Landing() {
  const { session, rounds, groupedCompetitors, groupedScores } =
    useLoaderData();

  return (
    <ul className={tw(components.list)}>
      {groupedCompetitors.map(([division, competitors]) => (
        <li key={division} className={tw`p-5 bg-purple-50 rounded`}>
          <div className={tw`flex-1 flex flex-col gap-5`}>
            <h2 className={tw`text-xl`}>{division}</h2>
            {rounds.map((round) => (
              <React.Fragment key={round.id}>
                <h3 className={tw`text-lg border-b`}>{round.name}</h3>
                {competitors
                  .sort((a, b) =>
                    descending(
                      groupedScores.get(round.id)?.get(a.id)?.[0].total_score,
                      groupedScores.get(round.id)?.get(b.id)?.[0].total_score
                    )
                  )
                  .map((competitor) => (
                    <div
                      key={competitor.id}
                      className={tw`flex items-center gap-5`}
                    >
                      <span className={tw(components.number)}>
                        #{competitor.number}
                      </span>
                      <span className={tw`flex-1 text-2xl`}>
                        {competitor.name}
                      </span>
                      <span className={tw`text-2xl`}>
                        {
                          groupedScores.get(round.id)?.get(competitor.id)?.[0]
                            .total_score
                        }
                      </span>
                    </div>
                  ))}
              </React.Fragment>
            ))}
          </div>
        </li>
      ))}
      <li className={tw`text-sm text-center opacity-50`}>
        {session ? (
          <Link to="/divisions">Judge</Link>
        ) : (
          <Link to="/sign-in">Sign-in</Link>
        )}
      </li>
    </ul>
  );
}

function SignIn() {
  const session = useLoaderData();
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) {
      console.error(error);
      return;
    }
    setMagicLinkSent(true);
  };

  return session ? (
    <Navigate to="/divisions" />
  ) : (
    <form
      onSubmit={handleSignIn}
      className={tw`flex-1 flex flex-col gap-5 justify-center items-center`}
    >
      <input
        name="email"
        type="text"
        placeholder="Email"
        disabled={magicLinkSent}
      />
      <button
        type="submit"
        className={tw([components.button, `bg-pink-500`])}
        disabled={magicLinkSent}
      >
        Sign In
      </button>
      {magicLinkSent ? <div>Check your email for a login link!</div> : null}
    </form>
  );
}

async function loadDivisions() {
  const { data, error } = await supabase.from("divisions").select();
  if (error) {
    console.error(error);
    return;
  }
  return data;
}

async function loadDivision({ params }) {
  const { data, error } = await supabase
    .from("divisions")
    .select()
    .eq("id", params.divisionId)
    .single();
  if (error) {
    console.error(error);
    return;
  }
  return data;
}

function Divisions() {
  const divisions = useLoaderData();
  return (
    <ul className={tw(components.list)}>
      {divisions.map((division) => (
        <li key={division.id}>
          <Link
            to={`/divisions/${division.id}/rounds`}
            className={tw(components.item, `px-5`)}
          >
            {division.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function loadRounds() {
  const { data, error } = await supabase.from("rounds").select();
  if (error) {
    console.error(error);
    return;
  }
  return data;
}

function Rounds() {
  const rounds = useLoaderData();
  const { divisionId } = useParams();
  return (
    <ul className={tw(components.list)}>
      {rounds.map((round) => (
        <li key={round.id}>
          <Link
            to={`/divisions/${divisionId}/rounds/${round.id}`}
            className={tw(components.item, `px-5`)}
          >
            {round.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function loadRound({ params }) {
  const { data, error } = await supabase
    .from("rounds")
    .select()
    .eq("id", params.roundId)
    .single();
  if (error) {
    console.error(error);
    return;
  }
  return data;
}

function Scoring() {
  const location = useLocation();
  return (
    <ul className={tw(components.list)}>
      <li>
        <Link
          to={`${location.pathname}/queue`}
          className={tw(components.item, `px-5`)}
        >
          Realtime
        </Link>
      </li>
      <li>
        <Link
          to={`${location.pathname}/batch`}
          className={tw(components.item, `px-5`)}
        >
          Batch
        </Link>
      </li>
    </ul>
  );
}

async function loadCompetitors({ params }) {
  const { data, error } = await supabase
    .from("competitors")
    .select()
    .eq("division_id", params.divisionId);
  if (error) {
    console.error(error);
  }
  return data;
}

function Queue() {
  const { divisionId, roundId } = useParams();
  const competitors = useLoaderData();

  const competitorsByNumber = competitors.reduce(
    (prev, curr) => ({ ...prev, [curr.number]: curr }),
    {}
  );
  const queue = useStore((state) => state.queue);
  const setQueue = useStore((state) => state.setQueue);
  const enqueue = useStore((state) => state.enqueue);
  const dequeue = useStore((state) => state.dequeue);
  const setOnDeck = useStore((state) => state.setOnDeck);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.number;
    const number = Number(input.value);
    if (!competitorsByNumber[number]) {
      return;
    }
    enqueue({ number, name: competitorsByNumber[number].name });
    input.value = "";
  };

  const handleDelete = (selectedItem) => dequeue(selectedItem);

  return (
    <>
      {queue.length > 0 ? (
        <Reorder.Group
          values={queue}
          onReorder={setQueue}
          className={tw(components.list)}
        >
          {queue.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className={tw(components.item)}
            >
              <div className={tw`px-5`}>
                <span className={tw(components.number)}>{item.number}</span>
              </div>
              <span className={tw`flex-1`}>{item.name}</span>
              <button
                className={tw`p-5 bg-pink-500 text-white`}
                onClick={() => handleDelete(item)}
              >
                <XMarkIcon className={tw`w-5`} />
              </button>
              <Link
                to={`/divisions/${divisionId}/rounds/${roundId}/routes?competitor=${item.number}`}
                onClick={() => setOnDeck(item.id)}
              >
                <button className={tw`p-5 bg-purple-500 text-white`}>
                  <PlayIcon className={tw`w-5`} />
                </button>
              </Link>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div
          className={tw`text-purple-500 text-2xl flex-1 flex flex-col justify-center gap-5 text-center`}
        >
          Queue up a competitor by entering their bib #
          <div className={tw`text-4xl`}>👇</div>
        </div>
      )}
      <form className={tw`p-3 flex gap-3 bg-pink-500`} onSubmit={handleSubmit}>
        <input
          name="number"
          type="text"
          placeholder="Bib #"
          className={tw`flex-1 border-none rounded`}
        />
        <button type="submit" className={tw(components.button)}>
          <UserPlusIcon className={tw`w-5`} />
        </button>
      </form>
    </>
  );
}

async function loadRoute({ params }) {
  const { data, error } = await supabase
    .from("routes")
    .select()
    .eq("id", Number(params.routeId))
    .single();
  if (error) {
    console.error(error);
    return;
  }
  return data;
}

async function loadRoutes({ params }) {
  const { data, error } = await supabase
    .from("routes")
    .select()
    .eq("round_id", Number(params.roundId))
    .order("created_at");
  if (error) {
    console.error(error);
    return;
  }
  return data;
}

function Routes() {
  const [searchParams] = useSearchParams();
  const { divisionId, roundId } = useParams();
  const routes = useLoaderData() as any[];
  return (
    <ul className={tw(components.list)}>
      {routes.map((route) => (
        <li key={route.id}>
          <Link
            to={`/divisions/${divisionId}/rounds/${roundId}/routes/${
              route.id
            }/attempt?${searchParams.toString()}`}
            className={tw(components.item, `px-5`)}
          >
            {route.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function fetchRoute(id: number) {
  const { data: route, error } = await supabase
    .from("routes")
    .select("*, rounds(type)")
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    return;
  }
  return route;
}

async function fetchCompetitor(number: string) {
  const { data: competitor, error } = await supabase
    .from("competitors")
    .select()
    .eq("number", number)
    .single();
  if (error) {
    console.error(error);
    return;
  }
  return competitor;
}

async function loadAttemptDetails({ params, request }) {
  const number = new URL(request.url).searchParams.get("competitor");
  const route = await fetchRoute(params.routeId);
  const competitor = await fetchCompetitor(number);
  return { route, competitor };
}

async function writeQueuedAttempt({ params, request }) {
  const formData = await request.formData();
  const { error } = await supabase.from("attempts").insert({
    competitor_id: formData.get("competitor_id"),
    route_id: formData.get("route_id"),
    is_zone: formData.get("is_zone") === "true",
    is_top: formData.get("is_top") === "true",
    hold: formData.get("hold"),
    is_plus: formData.get("is_plus") === "true",
  });
  if (error) {
    throw error;
  }
  return redirect(
    `/divisions/${params.divisionId}/rounds/${params.roundId}/queue`
  );
}

function Attempt() {
  const { route, competitor } = useLoaderData();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [hold, setHold] = React.useState(0);
  const dequeue = useStore((state) => state.dequeue);
  const onDeck = useStore((state) => state.onDeck);

  const includeIds = (formData) => {
    formData.append("competitor_id", competitor.id);
    formData.append("route_id", route.id);
  };

  const includeHold = (formData) => {
    if (route.rounds.type === "sport") {
      formData.append("hold", hold);
    }
  };

  const handleFall = () => {
    const formData = new FormData();
    includeIds(formData);
    includeHold(formData);
    submit(formData, { method: "post" });
    dequeue({ id: onDeck });
  };

  const handleTop = () => {
    const formData = new FormData();
    includeIds(formData);
    includeHold(formData);
    formData.append("is_top", true);
    submit(formData, { method: "post" });
    dequeue({ id: onDeck });
  };

  return (
    <>
      <h2 className={tw`p-3 text-2xl flex gap-5 items-center`}>
        <span className={tw(components.number)}>#{competitor.number}</span>
        {competitor.name}
      </h2>
      <ul className={tw(components.list)}>
        {route.rounds.type === "sport" ? (
          <li className={tw(components.item, `p-5`)}>
            <button
              className={tw(components.button, `bg-pink-500`)}
              onClick={() => setHold(Math.max(0, hold - 1))}
            >
              <MinusIcon className={tw`h-10`} />
            </button>
            <span className={tw`text-2xl`}>{hold}</span>
            <button
              className={tw(components.button, `bg-emerald-500`)}
              onClick={() => setHold(hold + 0.5)}
            >
              <PlusIcon className={tw`h-10`} />
            </button>
          </li>
        ) : null}
        <li
          className={tw(
            components.item,
            `bg-pink-500 text-white text-2xl px-5`
          )}
          onClick={handleFall}
        >
          Fall
        </li>
        <li
          className={tw(
            components.item,
            `bg-emerald-500 text-white text-2xl px-5`
          )}
          onClick={handleTop}
        >
          Top
        </li>
        <li
          className={tw(components.item, `text-2xl px-5`)}
          onClick={() => navigate(-1)}
        >
          Back
        </li>
      </ul>
    </>
  );
}

async function loadBatch({ params }) {
  const competitors = await loadCompetitors({ params });
  const routes = await loadRoutes({ params });
  return { competitors, routes };
}

function Batch() {
  const { competitors, routes } = useLoaderData();
  const sortedCompetitors = competitors.sort((a, b) =>
    ascending(a.number, b.number)
  );
  const groupedRoutes = groups(
    routes,
    (d) => d.name.split(ROUTE_NAME_SPLITTER)[0]
  ).sort((a, b) => ascending(a[0], b[0]));
  return (
    <ul className={tw`flex flex-col`}>
      {sortedCompetitors.map((competitor) => (
        <Competitor
          key={competitor.id}
          competitor={competitor}
          groupedRoutes={groupedRoutes}
        />
      ))}
    </ul>
  );
}

async function loadAttempts({ params, request }) {
  const competitorId = new URL(request.url).searchParams.get("competitor");
  const { data, error } = await supabase
    .from("attempts")
    .select("*, routes(*)")
    .eq("routes.round_id", Number(params.roundId))
    .eq("competitor_id", Number(competitorId));
  if (error) {
    console.error(error);
    return;
  }
  const attemptsMap = data.reduce(
    (prev, curr) => ({ ...prev, [curr.route_id]: curr }),
    {}
  );
  return attemptsMap;
}

async function writeAttempt({ request }) {
  const formData = await request.formData();
  await supabase.from("attempts").upsert({
    id: formData.get("id") ?? undefined,
    route_id: formData.get("route_id"),
    competitor_id: formData.get("competitor_id"),
    is_top: formData.get("is_top") === "true",
  });
}

function Competitor({ competitor, groupedRoutes }) {
  const fetcher = useFetcher();
  const { divisionId, roundId } = useParams();
  const attemptsUrl = `/divisions/${divisionId}/rounds/${roundId}/batch/attempts`;

  React.useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(`${attemptsUrl}?competitor=${competitor.id}`);
    }
  }, [fetcher]);

  const toggleAttempt = async (routeId) => {
    const attempt = attemptsMap[routeId];
    const isTop = attempt ? !attempt.is_top : true;
    const formData = new FormData();
    if (attempt) {
      formData.append("id", attempt.id);
    }
    formData.append("route_id", routeId);
    formData.append("competitor_id", competitor.id);
    formData.append("is_top", isTop);
    fetcher.submit(formData, { method: "post", action: attemptsUrl });
  };

  const attemptsMap = fetcher.data;

  return (
    <li key={competitor.id} className={tw`p-5 flex flex-col gap-5 border-b`}>
      <div className={tw`flex gap-5 items-center`}>
        <span className={tw(components.number)}>#{competitor.number}</span>
        <span className={tw`flex-1 text-2xl`}>{competitor.name}</span>
      </div>
      {groupedRoutes.map(([group, groupRoutes], i) => (
        <div key={i}>
          <strong>{group}</strong>
          <ul
            className={tw(`flex gap-5 overflow-x-auto py-5`, {
              "opacity-50": fetcher.state === "loading",
            })}
          >
            {groupRoutes.map((route) => (
              <li
                key={route.id}
                className={tw(
                  `whitespace-nowrap p-3 flex gap-3 items-center border border-transparent rounded cursor-pointer`,
                  {
                    "!border-black": (attemptsMap ?? {})[route.id]?.is_top,
                  }
                )}
                onClick={() => toggleAttempt(route.id)}
              >
                {route.color ? (
                  <span
                    className={tw(
                      `w-5 h-5 rounded-full border`,
                      route.color === "rainbow"
                        ? `bg-gradient-to-r from-red-500 via-green-500 to-blue-500`
                        : `bg-${route.color}`
                    )}
                  />
                ) : null}
                {route.name.split(ROUTE_NAME_SPLITTER)[1]}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </li>
  );
}
