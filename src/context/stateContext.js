import { createContext, useContext, useState } from "react";

const stateContext = createContext();

export const useData = () => {
  return useContext(stateContext);
};

const useStateContext = () => {
  const [state, setState] = useState(null);
  const [questions, setQuestions] = useState([]);

  return { state, setState, questions, setQuestions };
};

function StateProvider({ children }) {
  const { state, setState, questions, setQuestions } = useStateContext();

  const value = {
    state,
    setState,
    questions,
    setQuestions,
  };
  return (
    <stateContext.Provider value={value}>{children}</stateContext.Provider>
  );
}

export default StateProvider;
