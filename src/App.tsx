import { PlayIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Reorder } from "framer-motion";
import { nanoid } from "nanoid";
import * as React from "react";
import {
  createBrowserRouter,
  Link,
  redirect,
  RouterProvider,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { apply, tw } from "twind";
import supabase from "./lib/supabase";

const router = createBrowserRouter([
  { path: "/", loader: loadSession, element: <SignIn /> },
  { path: "/divisions", loader: loadDivisions, element: <Divisions /> },
  {
    path: "/divisions/:divisionId/rounds",
    loader: loadRounds,
    element: <Rounds />,
  },
  {
    path: "/divisions/:divisionId/rounds/:roundId",
    loader: loadRound,
    element: <Round />,
  },
]);

export default function App() {
  return (
    <div className={tw`w-screen h-screen flex flex-col text-gray-700`}>
      <header
        className={tw`bg-purple-500 text-yellow-400 text-3xl text-center leading-relaxed font-black`}
      >
        Ale!
      </header>
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
  return redirect("/divisions");
}

function SignIn() {
  useLoaderData();

  const [magicLinkSent, setMagicLinkSent] = React.useState(false);

  async function handleSignIn(e) {
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
  }

  return (
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
            className={tw(components.item, `h-24`)}
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
  const { divisionId } = useParams();
  const rounds = useLoaderData();
  return (
    <ul className={tw(components.list)}>
      {rounds.map((round) => (
        <li key={round.id}>
          <Link
            to={`/divisions/${divisionId}/rounds/${round.id}`}
            className={tw(components.item, `h-24`)}
          >
            {round.name}
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
              <span
                className={tw`text-gray-500 w-10 text-center border-1 rounded leading-loose`}
              >
                {item.number}
              </span>
              <span className={tw`flex-1`}>{item.name}</span>
              <button className={tw`p-5 bg-purple-50`}>
                <PlayIcon className={tw`w-5`} />
              </button>
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

const components = {
  list: apply`flex-1 flex flex-col p-3 gap-3 overflow-y-auto`,
  item: apply`
    bg-white
    border
    flex
    gap-5
    items-center
    justify-between
    pl-5
    rounded
  `,
  button: apply`
    border-1
    border-white
    px-5
    rounded
    text-white
  `,
};
