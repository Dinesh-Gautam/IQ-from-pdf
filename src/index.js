import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import QuestionInterface from "./QuestionInterface";
import StateProvider from "./context/stateContext";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import SideBar from "./components/SideBar";
import { Box } from "@mui/joy";
import RenderModal from "./components/RenderModal";
import RelatedQuestions from "./components/RelatedQuestions";

const root = ReactDOM.createRoot(document.getElementById("root"));

const defaultProps = {
  variant: "outlined",
  color: "neutral",
};

const customTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          appBody: "var(--joy-palette-common-black)",
          componentBg: "var(--joy-palette-neutral-900)",
        },

        neutral: {
          outlinedActiveOutline: "#259589 ",
        },
      },
    },
  },

  components: {
    JoyTextField: {
      defaultProps: { ...defaultProps },
    },
    JoyButton: { defaultProps: { ...defaultProps } },
    JoyTextarea: {
      defaultProps: { ...defaultProps },
    },
    JoySelect: {
      defaultProps: {
        ...defaultProps,
        indicator: <KeyboardArrowDown />,
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <StateProvider>
      <CssVarsProvider theme={customTheme}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.appBody",
            display: "flex",
            gap: 2,
            p: 2,
          }}
        >
          <SideBar />
          <QuestionInterface />
          <RelatedQuestions />
          <RenderModal />
        </Box>

        {/* <App /> */}
      </CssVarsProvider>
    </StateProvider>
  </React.StrictMode>
);
