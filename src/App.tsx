import {
  ChevronRightIcon,
  MinusIcon,
  PlayIcon,
  PlusIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ascending } from "d3-array";
import { Reorder } from "framer-motion";
import { nanoid } from "nanoid";
import * as React from "react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  redirect,
  RouterProvider,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { tw } from "twind";
import * as components from "./components";
import supabase from "./lib/supabase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
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
        element: <Outlet />,
        children: [
          {
            path: "rounds",
            loader: loadRounds,
            element: <Rounds />,
          },
          {
            path: "rounds/:roundId",
            element: <Outlet />,
            children: [
              {
                path: "",
                loader: loadRound,
                element: <Round />,
              },
              {
                path: "routes",
                loader: loadRoutes,
                element: <Routes />,
              },
              {
                path: "routes/:routeId",
                element: <Outlet />,
                children: [
                  {
                    path: "attempt",
                    loader: loadAttempts,
                    element: <Attempt />,
                    action: writeAttempt,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

function Root() {
  const breadcrumbs = [];

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
      <a href="/">
        <h1
          className={tw`bg-purple-500 text-yellow-400 text-3xl text-center leading-relaxed font-black`}
        >
          Ale!
        </h1>
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
    <ul className={tw(components.list)}>
      <li>
        <Link to="/divisions" className={tw(components.item)}>
          <span className={tw`px-5`}>Judge</span>
        </Link>
      </li>
    </ul>
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

function Divisions() {
  const divisions = useLoaderData();
  return (
    <ul className={tw(components.list)}>
      {divisions.map((division) => (
        <li key={division.id}>
          <Link
            to={`/divisions/${division.id}/rounds`}
            className={tw(components.item)}
          >
            <span className={tw`px-5`}>{division.name}</span>
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
            className={tw(components.item)}
          >
            <span className={tw`px-5`}>{round.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function loadRound({ params }) {
  const { data: competitors, error } = await supabase
    .from("competitors")
    .select()
    .eq("division_id", params.divisionId);
  if (error) {
    console.error(error);
    return {};
  }
  return { competitors };
}

function Round() {
  const { divisionId, roundId } = useParams();
  const { competitors } = useLoaderData();

  const competitorsByNumber = competitors.reduce(
    (prev, curr) => ({ ...prev, [curr.number]: curr }),
    {}
  );
  const [queue, setQueue] = React.useState<
    { id: string; number: number; name: string }[]
  >([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.number;
    const number = Number(input.value);
    if (!competitorsByNumber[number]) {
      return;
    }
    setQueue([
      ...queue,
      { id: nanoid(), number, name: competitorsByNumber[number].name },
    ]);
    input.value = "";
  };

  const handleDelete = (selectedItem) => {
    setQueue(queue.filter((item) => item.id !== selectedItem.id));
  };

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

async function loadRoutes({ params }) {
  const { data, error } = await supabase
    .from("routes")
    .select()
    .eq("round_id", Number(params.roundId));
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
      {routes
        .sort((a, b) => ascending(a.score, b.score))
        .map((route) => (
          <li key={route.id}>
            <Link
              to={`/divisions/${divisionId}/rounds/${roundId}/routes/${
                route.id
              }/attempt?${searchParams.toString()}`}
              className={tw(components.item)}
            >
              <span className={tw`px-5`}>{route.name}</span>
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

async function loadAttempts({ params, request }) {
  const number = new URL(request.url).searchParams.get("competitor");
  const route = await fetchRoute(params.routeId);
  const competitor = await fetchCompetitor(number);
  return { route, competitor };
}

async function writeAttempt({ params, request }) {
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
  return redirect(`/divisions/${params.divisionId}/rounds/${params.roundId}`);
}

function Attempt() {
  const { route, competitor } = useLoaderData();
  const navigate = useNavigate();
  const submit = useSubmit();
  const [hold, setHold] = React.useState(0);

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
  };

  const handleTop = () => {
    const formData = new FormData();
    includeIds(formData);
    includeHold(formData);
    formData.append("is_top", true);
    submit(formData, { method: "post" });
  };

  return (
    <>
      <h2 className={tw`p-3 text-2xl flex gap-5 items-center`}>
        <span className={tw(components.number)}>{competitor.number}</span>
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
              onClick={() => setHold(hold + 1)}
            >
              <PlusIcon className={tw`h-10`} />
            </button>
          </li>
        ) : null}
        <li
          className={tw(components.item, `bg-pink-500 text-white text-2xl`)}
          onClick={handleFall}
        >
          <span className={tw`px-5`}>Fall</span>
        </li>
        <li
          className={tw(components.item, `bg-emerald-500 text-white text-2xl`)}
          onClick={handleTop}
        >
          <span className={tw`px-5`}>Top</span>
        </li>
        <li
          className={tw(components.item, `text-2xl`)}
          onClick={() => navigate(-1)}
        >
          <span className={tw`px-5`}>Back</span>
        </li>
      </ul>
    </>
  );
}
