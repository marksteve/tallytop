import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { PlayIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { apply, tw } from "twind";
import { Reorder } from "framer-motion";
import { nanoid } from "nanoid";

const competitors: Record<number, string> = {
  1: "Natalia Grossman",
  2: "Miho Nonaka",
  3: "Brooke Raboutou",
  4: "Futabi Ito",
  5: "Hannah Meul",
  6: "Oriane Bertone",
  7: "Stasa Gejo",
  8: "Jessica Pilz",
  9: "Camilla Moroni",
  10: "Franziska Sterrer",
};

export default function App() {
  return (
    <Router>
      <div className={tw`w-screen h-screen flex flex-col text-gray-700`}>
        <header
          className={tw`bg-purple-500 text-yellow-400 text-3xl text-center leading-relaxed font-black`}
        >
          Ale!
        </header>
        <Routes>
          <Route path="/round/:id" element={<Round />} />
        </Routes>
      </div>
    </Router>
  );
}

function Round() {
  const { id } = useParams();
  const [queue, setQueue] = React.useState<
    { id: string; number: number; name: string }[]
  >([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.number;
    const number = Number(input.value);
    if (!competitors[number]) {
      return;
    }
    setQueue([...queue, { id: nanoid(), number, name: competitors[number] }]);
    input.value = "";
  };

  return (
    <>
      {queue.length > 0 ? (
        <Reorder.Group
          values={queue}
          onReorder={setQueue}
          className={tw`flex-1 flex flex-col p-3 gap-3 overflow-y-auto`}
        >
          {queue.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className={tw`bg-white pl-5 rounded flex justify-between gap-5 border items-center`}
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
  button: apply`
    border-1
    border-white
    px-5
    rounded
    text-white
  `,
};
