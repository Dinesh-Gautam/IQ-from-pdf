import React, { useEffect, useRef, useState } from "react";

import { useStateContext } from "../context/stateContext";
import stringSimilarity from "string-similarity";
import { v4 as uuid } from "uuid";
import {
  Button,
  FormLabel,
  Option,
  Select,
  selectClasses,
  Textarea,
} from "@mui/joy";

import FormControl from "@mui/joy/FormControl";
import ModalFooter from "./ModalFooter";
import ModalTitle from "../ModalTitle";

function QuestionAdder() {
  const inputRef = useRef();

  const { questions, setQuestions, pdfQuestions } = useStateContext();

  const [questionInput, setQuestionInput] = useState("");

  const [monthInput, setMonthInput] = useState({
    month: "Jan",
    year: "22",
  });

  function monthInputHandler(event, newValue, name) {
    const value = newValue;
    setMonthInput((prev) => ({ ...prev, [name]: value }));
  }
  const { wordsToIgnore } = useStateContext();
  // function questionAdderHandler() {
  //   const relatedId = questions.filter(({ question }) => {
  //     const formattedInput = questionInput
  //       .toLowerCase()
  //       .split(" ")
  //       .filter((word) => !wordsToIgnore.some((w) => w === word))
  //       .join(" ");
  //     const formattedQuestion = question
  //       .toLowerCase()
  //       .split(" ")
  //       .filter((word) => !wordsToIgnore.some((w) => w === word))
  //       .join(" ");
  //     const result = stringSimilarity.compareTwoStrings(
  //       formattedInput,
  //       formattedQuestion
  //     );

  //     console.table({
  //       formattedInputQuestion: formattedInput,
  //       formattedQuestion: formattedQuestion,
  //       result: result,
  //     });

  //     if (result > 0.7) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });

  //   if (relatedId.length > 0) {
  //     const newArr = questions.map((e) => {
  //       const related = relatedId.find((arr) => arr.id === e.id);
  //       if (related) {
  //         return {
  //           ...e,
  //           related: [...e.related, QuestionObj],
  //         };
  //       } else {
  //         return e;
  //       }
  //     });

  //     setQuestions(newArr);
  //   } else {
  //     setQuestions((prev) => [...prev, { ...QuestionObj, related: [] }]);
  //   }
  //   setQuestionInput("");
  //   inputRef.current.focus();
  // }

  useEffect(() => {
    const qI = pdfQuestions.flat().join("\n");
    setQuestionInput(qI);
  }, [pdfQuestions]);

  function questionAdderHandler(questionInput) {
    const QuestionObj = {
      question: questionInput,
      id: uuid(),
      month: monthInput.month,
      year: monthInput.year,
    };
    console.log(questionInput);
    const relatedId = questions.questions.filter(({ question }) => {
      const formattedInput = questionInput
        .toLowerCase()
        .split(" ")
        .filter((word) => !wordsToIgnore.some((w) => w === word))
        .join(" ");
      const formattedQuestion = question
        .toLowerCase()
        .split(" ")
        .filter((word) => !wordsToIgnore.some((w) => w === word))
        .join(" ");
      const result = stringSimilarity.compareTwoStrings(
        formattedInput,
        formattedQuestion
      );

      // console.table({
      //   formattedInputQuestion: formattedInput,
      //   formattedQuestion: formattedQuestion,
      //   result: result,
      // });

      if (result > 0.7) {
        return true;
      } else {
        return false;
      }
    });

    if (relatedId.length > 0) {
      setQuestions((prev) => ({
        ...prev,
        related: [
          ...prev.related,
          ...relatedId.map(({ id }) => ({ ...QuestionObj, parentId: id })),
        ],
      }));
    } else {
      setQuestions((prev) => ({
        ...prev,
        questions: [...prev.questions, { ...QuestionObj }],
      }));
    }
    setQuestionInput("");
    inputRef.current.focus();
  }
  return (
    // <form>
    //   <h4>Add Question</h4>
    //   <textarea
    //     ref={inputRef}
    //     style={{ width: "40%" }}
    //     type="text"
    //     value={questionInput}
    //     onChange={(e) => setQuestionInput(e.target.value)}
    //     name="question input"
    //     id="question_input"
    //     cols="20"
    //     rows="5"
    //   ></textarea>
    //   {/* <div>
    //   <input
    //     value={monthInput}
    //     onChange={(e) => monthInputHandler(e.target.value)}
    //     type="month"
    //   />
    // </div> */}
    //   <div>
    //     <span>
    //       <label htmlFor="month">Month:</label>
    //       <select
    //         value={monthInput.month}
    //         onChange={monthInputHandler}
    //         id="month"
    //         name="month"
    //       >
    //         <Option>Jan</Option>
    //         <Option>Feb</Option>
    //         <Option>Mar</Option>
    //         <Option>Apr</Option>
    //         <Option>May</Option>
    //         <Option>Jun</Option>
    //         <Option>Jul</Option>
    //         <Option>Aug</Option>
    //         <Option>Sep</Option>
    //         <Option>Oct</Option>
    //         <Option>Nov</Option>
    //         <Option>Dec</Option>
    //       </select>
    //     </span>
    //     <span>
    //       <label htmlFor="year">Year:</label>
    //       <select
    //         value={monthInput.year}
    //         onChange={monthInputHandler}
    //         id="year"
    //         name="year"
    //       >
    //         <Option>22</Option>
    //         <Option>21</Option>
    //         <Option>20</Option>
    //         <Option>19</Option>
    //         <Option>18</Option>
    //         <Option>17</Option>
    //         <Option>16</Option>
    //         <Option>15</Option>
    //       </select>
    //     </span>
    //   </div>
    //   <div>
    //     <Box>
    //       <Button
    //         // variant="solid"
    //         // color="primary"
    //         // type="submit"
    //         disabled={!questionInput}
    //         // onClick={(e) => {
    //         //   e.preventDefault();
    //         //   const qI = questionInput.split("\n");

    //         //   qI.forEach((question) => {
    //         //     if (question.trim().length > 0) {
    //         //       questionAdderHandler(question);
    //         //     }
    //         //   });
    //         // }}
    //       >
    //         Add Question
    //       </Button>
    //     </Box>
    //   </div>
    // </form>
    <>
      <ModalTitle text="Add Question" />
      <FormControl
        sx={{
          width: "100%",
        }}
      >
        <Textarea
          placeholder="Type here…"
          ref={inputRef}
          size="lg"
          sx={{ minWidth: 800 }}
          type="text"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          name="question input"
          id="question_input"
          minRows={10}
          maxRows={30}
        />
        <ModalFooter>
          <FormControl>
            <FormLabel>Month:</FormLabel>
            <Select
              componentsProps={{
                listbox: {
                  sx: {
                    maxHeight: 200,
                    overflow: "auto", // required for scrolling
                  },
                },
              }}
              placeholder="Month"
              defaultValue={monthInput.month}
              value={monthInput.month}
              onChange={(e, n) => monthInputHandler(e, n, "month")}
              name="month"
              sx={{
                width: 120,
                [`& .${selectClasses.indicator}`]: {
                  transition: "0.2s",
                  [`&.${selectClasses.expanded}`]: {
                    transform: "rotate(-180deg)",
                  },
                },
              }}
            >
              <Option value="Jan">Jan</Option>
              <Option value="Feb">Feb</Option>
              <Option value="Mar">Mar</Option>
              <Option value="Apr">Apr</Option>
              <Option value="May">May</Option>
              <Option value="Jun">Jun</Option>
              <Option value="Jul">Jul</Option>
              <Option value="Aug">Aug</Option>
              <Option value="Sep">Sep</Option>
              <Option value="Oct">Oct</Option>
              <Option value="Nov">Nov</Option>
              <Option value="Dec">Dec</Option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Year:</FormLabel>
            <Select
              componentsProps={{
                listbox: {
                  sx: {
                    maxHeight: 200,
                    overflow: "auto", // required for scrolling
                  },
                },
              }}
              sx={{
                width: 120,
                [`& .${selectClasses.indicator}`]: {
                  transition: "0.2s",
                  [`&.${selectClasses.expanded}`]: {
                    transform: "rotate(-180deg)",
                  },
                },
              }}
              name="year"
              value={monthInput.year}
              onChange={(e, n) => monthInputHandler(e, n, "year")}
            >
              <Option value="22">22</Option>
              <Option value="21">21</Option>
              <Option value="20">20</Option>
              <Option value="19">19</Option>
              <Option value="18">18</Option>
              <Option value="17">17</Option>
              <Option value="16">16</Option>
              <Option value="15">15</Option>
            </Select>
          </FormControl>
          <Button
            variant="soft"
            type="submit"
            disabled={!questionInput}
            onClick={(e) => {
              e.preventDefault();
              const qI = questionInput.split("\n");

              qI.forEach((question) => {
                if (question.trim().length > 0) {
                  questionAdderHandler(question);
                }
              });
            }}
            sx={{ ml: "auto", borderRadius: "sm" }}
          >
            Add Question
          </Button>
        </ModalFooter>
      </FormControl>
    </>
  );
}

export default QuestionAdder;
