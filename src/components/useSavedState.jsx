import { useEffect, useReducer, useRef } from "react";

function saveData(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function useSavedState(init, name, debounce) {
  const debounceRef = useRef(false);
  function reducer(state, action) {
    const { type, data, name } = action;

    const dataObj = typeof data === "function" ? data(state) : data;

    switch (type) {
      case "setState": {
        if (debounce) {
          if (debounceRef.current) {
            clearTimeout(debounceRef.current);
          }
          debounceRef.current = setTimeout(() => {
            saveData(name, dataObj);
          }, 500);
        } else {
          saveData(name, dataObj);
        }
        return dataObj;
      }
      case "loadState": {
        return dataObj;
      }

      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, init);
  const only = useRef(false);
  function loadState(data) {
    dispatch({ type: "loadState", data });
  }

  function setState(data) {
    dispatch({ type: "setState", data, name });
  }

  useEffect(() => {
    if (only.current) return;
    (async () => {
      try {
        const loadedData = JSON.parse(localStorage.getItem(name));
        loadState(loadedData);
      } catch (err) {
        console.error(err);
      }
    })();
    only.current = true;
  }, []);

  return [state, setState];
}

export default useSavedState;
