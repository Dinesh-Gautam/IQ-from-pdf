import React, { useState } from "react";
import { useEffect } from "react";
import { useStateContext } from "../context/stateContext";

function SaveQuestions() {
  const { questions, setQuestions } = useStateContext();

  const [saveName, setSaveName] = useState("");
  const [saveNameSelect, setSaveNameSelect] = useState("");
  const [savedNamesState, setSavedNamesState] = useState([]);
  const saveBtnHandler = () => {
    if (!saveName) {
      alert("Please enter a name");
      return;
    }

    let savedNames = JSON.parse(localStorage.getItem("questions-set-name"));
    if (!savedNames.includes(saveName)) {
      savedNames.push(saveName);
    }
    localStorage.setItem("questions-set-name", JSON.stringify(savedNames));
    localStorage.setItem(saveName, JSON.stringify(questions));
    setSavedNamesState(savedNames);
    if (saveNameSelect === null) {
      setSaveNameSelect(savedNames[0] || saveName);
    }
    setSaveName("");
    alert("saved");
  };

  const getSavedBtnHandler = () => {
    if (!saveNameSelect) {
      alert("select name to get from localStorage");
      return;
    }
    const data = JSON.parse(localStorage.getItem(saveNameSelect));
    if (!data) {
      alert("No data found in local storage");
      return;
    }
    setQuestions(data);
  };

  useEffect(() => {
    let savedNames = JSON.parse(localStorage.getItem("questions-set-name"));
    if (!savedNames) {
      savedNames = [];
      localStorage.setItem("questions-set-name", JSON.stringify(savedNames));
      return;
    }

    setSavedNamesState(savedNames);
    setSaveNameSelect(savedNames[0] || null);
  }, []);

  return (
    <div>
      <h4>Save Data:</h4>
      <div>
        <input
          onChange={(e) => setSaveName(e.target.value)}
          value={saveName}
          type="text"
          name="save-data-name"
        />
        <button onClick={saveBtnHandler}>Save to local Storage</button>
      </div>
      {savedNamesState.length > 0 && (
        <div>
          <select
            onChange={(e) => setSaveNameSelect(e.target.value)}
            value={saveNameSelect}
            name="save-data-name-select"
            id="save-data-name-select"
          >
            {savedNamesState.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button onClick={getSavedBtnHandler}>Get from local Storage</button>
          <button
            onClick={() => {
              localStorage.removeItem(saveNameSelect);
              const newArr = savedNamesState.filter(
                (name) => name !== saveNameSelect
              );
              localStorage.setItem(
                "questions-set-name",
                JSON.stringify(newArr)
              );
              setSavedNamesState(newArr);
              setSaveNameSelect(newArr[0] || null);
              alert("cleared: " + saveNameSelect);
            }}
          >
            Clear Local Storage
          </button>
        </div>
      )}
    </div>
  );
}

export default SaveQuestions;
