/* eslint-disable react-hooks/exhaustive-deps */
import { Box, FormLabel, Textarea } from "@mui/joy";
import React, { useEffect } from "react";
import { useStateContext } from "../context/stateContext";

function WordsToIgnore() {
  const { wordsToIgnore, setWordsToIgnore } = useStateContext();

  const valueChangeHandler = (event) => {
    const value = event.target.value;

    setWordsToIgnore(value.split(","));
  };

  useEffect(() => {
    if (wordsToIgnore) {
      localStorage.setItem("wordsToIgnore", JSON.stringify(wordsToIgnore));
    } else {
      setWordsToIgnore(JSON.parse(localStorage.getItem("wordsToIgnore")) || []);
    }
  }, [wordsToIgnore]);

  return (
    <Box m={2}>
      <FormLabel>Words to Ignore:</FormLabel>
      <Textarea
        placeholder="Type words to Ignore here..."
        onChange={valueChangeHandler}
        value={wordsToIgnore?.join(",") || ""}
        name="wordsToIgnore"
        id="wordsToIgnore"
        minRows="10"
      ></Textarea>
    </Box>
  );
}

export default WordsToIgnore;
