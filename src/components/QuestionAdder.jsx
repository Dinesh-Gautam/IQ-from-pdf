import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../context/stateContext";
import stringSimilarity from "string-similarity";
import { v4 as uuid } from "uuid";

function QuestionAdder() {
  const inputRef = useRef();

  const { questions, setQuestions , pdfQuestions } = useStateContext();

  const [questionInput, setQuestionInput] = useState("");

  const [monthInput, setMonthInput] = useState({
    month: "Jan",
    year: "22",
  });


  function monthInputHandler(event) {
    const name = event.target.name;
    const value = event.target.value;
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
    setQuestionInput(qI)
  }, [pdfQuestions]);

  function questionAdderHandler(questionInput) {
    
  const QuestionObj = {
    question: questionInput,
    id: uuid(),
    month: monthInput.month,
    year: monthInput.year,
  };
  console.log(questionInput)
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
    <form>
      <h4>Add Question</h4>
      <textarea
        ref={inputRef}
        style={{ width: "40%" }}
        type="text"
        value={questionInput}
        onChange={(e) => setQuestionInput(e.target.value)}
        name="question input"
        id="question_input"
        cols="20"
        rows="5"
      ></textarea>
      {/* <div>
      <input
        value={monthInput}
        onChange={(e) => monthInputHandler(e.target.value)}
        type="month"
      />
    </div> */}
      <div>
        <span>
          <label htmlFor="month">Month:</label>
          <select
            value={monthInput.month}
            onChange={monthInputHandler}
            id="month"
            name="month"
          >
            <option>Jan</option>
            <option>Feb</option>
            <option>Mar</option>
            <option>Apr</option>
            <option>May</option>
            <option>Jun</option>
            <option>Jul</option>
            <option>Aug</option>
            <option>Sep</option>
            <option>Oct</option>
            <option>Nov</option>
            <option>Dec</option>
          </select>
        </span>
        <span>
          <label htmlFor="year">Year:</label>
          <select
            value={monthInput.year}
            onChange={monthInputHandler}
            id="year"
            name="year"
          >
            <option>22</option>
            <option>21</option>
            <option>20</option>
            <option>19</option>
            <option>18</option>
            <option>17</option>
            <option>16</option>
            <option>15</option>
          </select>
        </span>
      </div>
      <div>
        <button
          type="submit"
          disabled={!questionInput}
          onClick={(e) => {
            e.preventDefault();
            const qI = questionInput.split("\n");

            qI.forEach(question => {
              if(question.trim().length > 0) {
                questionAdderHandler(question)
              }
            })
          }}
        >
          Add Question
        </button>
      </div>
    </form>
  );
}

export default QuestionAdder;
