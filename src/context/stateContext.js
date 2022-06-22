import { createContext, useContext, useState } from "react";

const stateContext = createContext();

export const useStateContext = () => {
  return useContext(stateContext);
};

function StateProvider({ children }) {
  const [questions, setQuestions] = useState({ questions: [], related: [] });
  const [pdfQuestions, setPdfQuestions] = useState([]);
  const [wordsToIgnore, setWordsToIgnore] = useState(null);
  const value = {
    questions,
    setQuestions,
    pdfQuestions,
    setPdfQuestions,
    wordsToIgnore,
    setWordsToIgnore,
  };
  return (
    <stateContext.Provider value={value}>{children}</stateContext.Provider>
  );
}

export default StateProvider;
