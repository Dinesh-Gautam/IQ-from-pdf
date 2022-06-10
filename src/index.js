import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import QuestionInterface from "./QuestionInterface";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <QuestionInterface />
  </React.StrictMode>
);
