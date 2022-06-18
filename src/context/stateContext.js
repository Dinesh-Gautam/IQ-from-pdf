import { createContext, useContext, useState } from "react";

const stateContext = createContext();

export const useStateContext = () => {
  return useContext(stateContext);
};

function StateProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [pdfQuestions, setPdfQuestions] = useState([]);
  const value = { questions, setQuestions, pdfQuestions, setPdfQuestions };
  return (
    <stateContext.Provider value={value}>{children}</stateContext.Provider>
  );
}

export default StateProvider;
