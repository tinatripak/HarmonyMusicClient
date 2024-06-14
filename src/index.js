import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import App from "./App";
import { StateProvider } from "./Context/StateProvider";
import { initialState } from "./Context/initialState";
import reducer from "./Context/reducer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <StateProvider initialState={initialState} reducer={reducer}>
      <Analytics />
      <App />
    </StateProvider>
  </Router>
);
