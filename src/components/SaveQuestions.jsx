import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  Option,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import React, { useState } from "react";
import { useEffect } from "react";
import { saveQuestions, useStateContext } from "../context/stateContext";
import ModalFooter from "./ModalFooter";
import ModalTitle from "./ModalTitle";

function SaveQuestions({ type }) {
  const { questions, setQuestions, autoSave, setAutoSave } = useStateContext();

  const [saveName, setSaveName] = useState(autoSave.name ?? "");
  const [saveNameSelect, setSaveNameSelect] = useState("");
  const [prevVerSelect, setPrevVerSelect] = useState("current");
  const [savedNamesState, setSavedNamesState] = useState([]);

  const [prevVersions, setPrevVersions] = useState([]);
  const [checked, setChecked] = useState(autoSave.checked || false);

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
    saveQuestions(saveName, questions);
    // localStorage.setItem(saveName, JSON.stringify(questions));
    setSavedNamesState(savedNames);
    if (saveNameSelect === null) {
      setSaveNameSelect(savedNames[0] || saveName);
    }
    setSaveName("");
    alert("saved");
  };

  useEffect(() => {
    const verNames = JSON.parse(localStorage.getItem(saveNameSelect + "ver"));

    setPrevVersions(verNames);
  }, [saveNameSelect]);

  const getSavedBtnHandler = () => {
    if (!saveNameSelect) {
      alert("select name to get from localStorage");
      return;
    }

    const autoSave = {
      checked,
      name: saveNameSelect,
    };

    localStorage.setItem("autoSave", JSON.stringify(autoSave));

    setAutoSave(autoSave);

    let nameSelect = saveNameSelect;

    if (prevVerSelect !== "current") {
      nameSelect = prevVerSelect;
    }

    const data = JSON.parse(localStorage.getItem(nameSelect));
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

  return type === "export" ? (
    <>
      <ModalTitle text="Export Data" />
      <FormControl>
        <FormLabel>Select Name</FormLabel>
        <Select
          placeholder="Select Name"
          sx={{
            minWidth: 120,
          }}
          onChange={(e, value) => setSaveName(value)}
          value={saveName}
          name="save-data-name-select"
          id="save-data-name-select"
        >
          {savedNamesState.map((name, index) => (
            <Option key={index} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <Typography mt={1} textAlign="center">
        Or
      </Typography>

      <FormControl>
        <TextField
          label="Name"
          placeholder="type"
          onChange={(e) => setSaveName(e.target.value)}
          value={saveName}
          type="text"
          name="save-data-name"
        />
      </FormControl>

      <ModalFooter>
        <Button variant="soft" onClick={saveBtnHandler}>
          Save to local Storage
        </Button>
      </ModalFooter>
    </>
  ) : (
    <>
      <ModalTitle text="Import Data" />
      {type === "import" && savedNamesState.length > 0 ? (
        <>
          <FormControl
            orientation="horizontal"
            sx={{ mb: 2, width: 300, justifyContent: "space-between" }}
          >
            <Box>
              <FormLabel>Auto Save</FormLabel>
              {autoSave.name && checked && (
                <FormHelperText sx={{ mt: 0 }}>
                  Saving to {autoSave.name}
                </FormHelperText>
              )}
            </Box>

            <Switch
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              color={checked ? "primary" : "neutral"}
              variant={checked ? "solid" : "outlined"}
              endDecorator={checked ? "On" : "Off"}
              componentsProps={{
                endDecorator: {
                  sx: {
                    minWidth: 24,
                  },
                },
              }}
            />
          </FormControl>
          <Select
            sx={{
              minWidth: 120,
            }}
            onChange={(e, value) => setSaveNameSelect(value)}
            value={saveNameSelect}
            name="save-data-name-select"
            id="save-data-name-select"
          >
            {savedNamesState.map((name, index) => (
              <Option key={index} value={name}>
                {name}
              </Option>
            ))}
          </Select>

          {prevVersions && (
            <FormControl
              sx={{
                mt: 2,
              }}
            >
              <FormLabel> Previous Versions</FormLabel>
              <Select
                sx={{
                  minWidth: 120,
                }}
                onChange={(e, value) => {
                  setPrevVerSelect(value);
                }}
                value={prevVerSelect || "current"}
              >
                <Option value={"current"}>Current</Option>
                {prevVersions?.map(({ id, date }, index) => (
                  <Option key={id} value={id}>
                    {index + ". " + date}
                  </Option>
                ))}
              </Select>
            </FormControl>
          )}
          <ModalFooter>
            <Button
              onClick={() => {
                const really = window.confirm(
                  "Do you really want to delete data of " + saveNameSelect
                );

                if (!really) return;

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
              Delete
            </Button>
            <Button variant="soft" onClick={getSavedBtnHandler}>
              Import
            </Button>
          </ModalFooter>
        </>
      ) : (
        <Typography mt={0.5} mb={2} textColor="text.tertiary">
          No data to import.
        </Typography>
      )}
    </>
  );
}

export default SaveQuestions;
