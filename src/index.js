import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import QuestionInterface from "./QuestionInterface";
import StateProvider from "./context/stateContext";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

const root = ReactDOM.createRoot(document.getElementById("root"));

const customTheme = extendTheme({
  // colorSchemes: {
  //   light: {
  //     palette: {
  //       primary: {
  //         solidBg: "transparent",
  //         solidHoverBg: "#000",
  //         solidActiveBg: "#000",
  //         solidColor: "#000",
  //         solidBorder: "#000",
  //         solidActiveBorder: "#000",
  //       },
  //       neutral: {},
  //       focusVisible: "#000",
  //     },
  //   },
  // },
  // focus: {
  //   default: {
  //     outlineWidth: "1px",
  //     outlinedBorder: "#000",
  //   },
  // },
  components: {
    JoySelect: {
      defaultProps: {
        indicator: <KeyboardArrowDown />,
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <StateProvider>
      <CssVarsProvider theme={customTheme}>
        <QuestionInterface />
        <App />
      </CssVarsProvider>
    </StateProvider>
  </React.StrictMode>
);
