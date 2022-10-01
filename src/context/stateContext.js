/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useRef, useState } from "react";

const stateContext = createContext();

export const useStateContext = () => {
  return useContext(stateContext);
};

function StateProvider({ children }) {
  const [questions, setQuestions] = useState({ questions: [], related: [] });
  const [pdfQuestions, setPdfQuestions] = useState([]);
  const [wordsToIgnore, setWordsToIgnore] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [modal, setModal] = useState({ open: false, type: null });
  const [autoSave, setAutoSave] = useState({ checked: false, name: null });

  const [edit, setEdit] = useState({
    editing: false,
    parentId: [],
    relatedId: [],
  });

  const autoSaveRef = useRef(null);

  useEffect(() => {
    const as = JSON.parse(localStorage.getItem("autoSave"));

    if (as) {
      setAutoSave(as);
    }
  }, []);

  useEffect(() => {
    if (autoSave.checked) {
      clearTimeout(autoSaveRef.current);

      autoSaveRef.current = setTimeout(() => {
        localStorage.setItem(autoSave.name, JSON.stringify(questions));
      }, 500);
    }
  }, [questions]);

  const value = {
    questions,
    setQuestions,
    pdfQuestions,
    setPdfQuestions,
    wordsToIgnore,
    setWordsToIgnore,
    selectedQuestion,
    setSelectedQuestion,
    modal,
    setModal,
    edit,
    setEdit,
    autoSave,
    setAutoSave,
  };
  return (
    <stateContext.Provider value={value}>{children}</stateContext.Provider>
  );
}

export default StateProvider;
