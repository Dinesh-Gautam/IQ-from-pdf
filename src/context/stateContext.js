import { createContext, useContext, useState } from "react";

const stateContext = createContext();

export const useStateContext = () => {
  return useContext(stateContext);
};

function StateProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const value = { questions, setQuestions };
  return (
    <stateContext.Provider value={value}>{children}</stateContext.Provider>
  );
}

export default StateProvider;
