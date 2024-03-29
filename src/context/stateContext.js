/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
const stateContext = createContext();

export const useStateContext = () => {
  return useContext(stateContext);
};

export const pdfInfoInit = {
  clickedId: null,
  pdfAdded: [],
};

export function saveQuestions(name, data) {
  const prevVersion = JSON.parse(localStorage.getItem(name + "ver")) || [];
  const prevData = localStorage.getItem(name);

  if (prevData) {
    const date = new Date().toLocaleDateString();
    const id = uuidv4();
    prevVersion.unshift({ id, date });
    localStorage.setItem(name + "ver", JSON.stringify(prevVersion));
    localStorage.setItem(id, prevData);
  }

  localStorage.setItem(name, JSON.stringify(data));
}

// function garbageCollectOldQuestions(prevVersion) {

// }

function StateProvider({ children }) {
  const [questions, setQuestions] = useState({
    questions: [],
    related: [],
  });
  const [pdfQuestions, setPdfQuestions] = useState([]);
  const [wordsToIgnore, setWordsToIgnore] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [modal, setModal] = useState({ open: false, type: null });
  const [autoSave, setAutoSave] = useState({ checked: false, name: null });
  const [pdfInfo, setPdfInfo] = useState(pdfInfoInit);

  const [edit, setEdit] = useState({
    editing: false,
    parentId: [],
    relatedId: [],
  });

  const autoSaveRef = useRef(null);

  useEffect(() => {
    const as = JSON.parse(localStorage.getItem("autoSave"));
    if (as) {
      as.checked = false;
      setAutoSave(as);
    }
  }, []);

  useEffect(() => {
    if (autoSave.checked) {
      clearTimeout(autoSaveRef.current);

      autoSaveRef.current = setTimeout(() => {
        saveQuestions(autoSave.name, questions);
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
    pdfInfo,
    setPdfInfo,
  };
  return (
    <stateContext.Provider value={value}>{children}</stateContext.Provider>
  );
}

export default StateProvider;
