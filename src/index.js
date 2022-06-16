import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import QuestionInterface from "./QuestionInterface";
import StateProvider from "./context/stateContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StateProvider>
      <QuestionInterface />
    </StateProvider>
  </React.StrictMode>
);
