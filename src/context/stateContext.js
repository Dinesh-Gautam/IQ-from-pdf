import { createContext, useContext, useState } from "react";

const stateContext = createContext();

export const useData = () => {
  return useContext(stateContext);
};

const useStateContext = () => {
  const [questions, setQuestions] = useState([]);

  return { questions, setQuestions };
};

function StateProvider({ children }) {
  const value = useStateContext();

  return (
    <stateContext.Provider value={value}>{children}</stateContext.Provider>
  );
}

export default StateProvider;
