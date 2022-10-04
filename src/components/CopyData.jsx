import { Box, Button, Checkbox, Sheet } from "@mui/joy";
import React, { useState } from "react";
import { useStateContext } from "../context/stateContext";
import ModalFooter from "./ModalFooter";
import ModalTitle from "./ModalTitle";
import { useGetRelated } from "../QuestionInterface";

const copyBtnHandler = (questions, checkbox, getRelated) => {
  let string = "";

  function getDate(month, year, related) {
    return (
      `[${month} ${year}]` +
      (!checkbox.relatedQuestions && checkbox.Date
        ? related.map((e) => ` [${e.month} ${e.year}]`).join(",")
        : "")
    );
  }

  function getRelatedLength(related) {
    return related.length + 1;
  }

  function getRelatedDateAndQuestions(checkbox, e) {
    return `\t- ${checkbox.Date ? `(${e.month} ${e.year})` : ""} ${e.question}`;
  }

  questions.questions.forEach(({ question, month, year, id }, index) => {
    let related = getRelated(id);

    if (checkbox.importantQuestion && !related.length) return;

    let temp = "";

    if (checkbox.relatedCount || checkbox.Date) {
      if (related.length || checkbox.Date) temp += "(";

      if (checkbox.relatedCount && related.length)
        temp += getRelatedLength(related);

      if (checkbox.relatedCount && checkbox.Date && related.length) temp += " ";

      if (checkbox.Date) temp += getDate(month, year, related);

      if (related.length || checkbox.Date) temp += ") ";
    }
    temp += question;

    temp += "\n";

    if (checkbox.relatedQuestions && related.length) {
      temp += related
        .map((e) => getRelatedDateAndQuestions(checkbox, e))
        .join("\n");
      temp += "\n";
    }

    temp += "\n";
    string += temp;

    // if (checkbox.importantQuestion) {
    //   string +=
    //     related.length > 0
    //       ? `${
    //           related.length + 1 && (checkbox.relatedCount || checkbox.Date)
    //             ? `(${checkbox.relatedCount ? related.length + 1 : ""} ${
    //                 checkbox.Date
    //                   ? `[${month} ${year}] ` +
    //                     related.map((e) => `[${e.month} ${e.year}]`)
    //                   : ""
    //               }) : `
    //             : ""
    //         } ${question} \n${
    //           checkbox.relatedQuestions && related.length
    //             ? related
    //                 .map(
    //                   (e) =>
    //                     `\t- ${related.Date ? `(${e.month} ${e.year})` : ""} ${
    //                       e.question
    //                     }`
    //                 )
    //                 .join("\n")
    //             : ""
    //         }\n\n`
    //       : "";
    // } else {
    //   string += `${
    //     checkbox.relatedCount || checkbox.Date
    //       ? `(${
    //           checkbox.relatedCount & related.length ? related.length + 1 : ""
    //         } ${
    //           checkbox.Date
    //             ? `[${month} ${year}] ` +
    //               related.map((e) => `[${e.month} ${e.year}]`).join(" ")
    //             : ""
    //         }) : `
    //       : ""
    //   } ${question} \n${
    //     checkbox.relatedQuestions && related.length
    //       ? related
    //           .map(
    //             (e) =>
    //               `\t- ${related.Date ? `(${e.month} ${e.year})` : ""} ${
    //                 e.question
    //               }`
    //           )
    //           .join("\n")
    //       : ""
    //   }\n\n`;
    // }
  });

  console.log(string);
  navigator.clipboard.writeText(string);
  alert("Copied text!");
};

function CopyData() {
  const [checkbox, setCheckbox] = useState({});
  const { questions } = useStateContext();

  const getRelated = useGetRelated();

  const checkboxChangeHandler = (event) => {
    const target = event.target;
    const { name, checked } = target;

    setCheckbox((prev) => ({ ...prev, [name]: checked }));
  };
  return (
    <div>
      <ModalTitle text="Copy Data" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 300,
          "& > div": {
            p: 2,
            boxShadow: "sm",
            display: "flex",
            borderRadius: "md",
          },
        }}
      >
        <Sheet variant="outlined">
          <Checkbox
            label="Important Questions"
            overlay
            onChange={checkboxChangeHandler}
            checked={checkbox.importantQuestion || false}
            id="importantQuestion"
            type="checkbox"
            name="importantQuestion"
          />
          {/* <label htmlFor="importantQuestion">Important Questions</label> */}
        </Sheet>

        <Sheet variant="outlined">
          <Checkbox
            overlay
            label="Related Questions"
            onChange={checkboxChangeHandler}
            checked={checkbox.relatedQuestions || false}
            id="relatedQuestions"
            type="checkbox"
            name="relatedQuestions"
          />
          {/* <label htmlFor="relatedQuestions">Related Questions</label> */}
        </Sheet>

        <Sheet variant="outlined">
          <Checkbox
            overlay
            label="Related Count"
            onChange={checkboxChangeHandler}
            checked={checkbox.relatedCount || false}
            id="relatedCount"
            type="checkbox"
            name="relatedCount"
          />
          {/* <label htmlFor="relatedCount">Related Count</label> */}
        </Sheet>

        <Sheet variant="outlined">
          <Checkbox
            overlay
            label="Dates"
            onChange={checkboxChangeHandler}
            checked={checkbox.Date || false}
            id="Date"
            type="checkbox"
            name="Date"
          />
          {/* <label htmlFor="Date">Dates</label> */}
        </Sheet>
      </Box>
      <ModalFooter>
        <Button
          variant="soft"
          onClick={() => copyBtnHandler(questions, checkbox, getRelated)}
        >
          Copy Questions
        </Button>
      </ModalFooter>
      {/* <Button onClick={copyWithRelatedButtonHandler}>
          Copy with Related Questions
        </Button> */}
    </div>
  );
}

export default CopyData;
