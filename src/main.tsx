import "@fontsource/recursive/variable-full.css";
import { withForms } from "@twind/forms";
import React from "react";
import ReactDOM from "react-dom/client";
import { setup } from "twind";
import * as colors from "twind/colors";
import App from "./App";
import "./index.css";

setup({
  preflight: withForms(),
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["RecursiveVariable", "sans-serif"],
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
