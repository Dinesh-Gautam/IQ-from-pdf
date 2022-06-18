import React, { useEffect, useState } from "react";
import TagMaker from "./components/Tags/TagMaker";
import { useStateContext } from "./context/stateContext";
import stringSimilarity from "string-similarity";

import { v4 as uuid } from "uuid";

function QuestionInterface() {
  // const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const [monthInput, setMonthInput] = useState({
    month: "January",
    year: "2022",
  });
  const { questions, setQuestions } = useStateContext();

  const QuestionObj = {
    question: questionInput,
    id: uuid(),
    month: monthInput.month,
    year: monthInput.year,
  };

  function monthInputHandler(event) {
    const name = event.target.name;
    const value = event.target.value;
    setMonthInput((prev) => ({ ...prev, [name]: value }));
  }

  function questionAdderHandler() {
    const relatedId = questions.filter(({ question }) => {
      const result = stringSimilarity.compareTwoStrings(
        questionInput,
        question
      );

      if (result > 0.5) {
        return true;
      } else {
        return false;
      }
    });

    if (relatedId.length > 0) {
      const newArr = questions.map((e) => {
        const related = relatedId.find((arr) => arr.id === e.id);
        if (related) {
          return {
            ...e,
            related: [...e.related, QuestionObj],
          };
        } else {
          return e;
        }
      });

      setQuestions(newArr);
    } else {
      setQuestions((prev) => [...prev, { ...QuestionObj, related: [] }]);
    }
    setQuestionInput("");
  }

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  return (
    <div>
      <div>
        QuestionArea
        <div>
          {questions &&
            questions.map((q, index) => {
              return (
                <div key={index}>
                  <span>{q.question}</span>
                </div>
              );
            })}
        </div>
      </div>

      <div>
        <textarea
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          name="question input"
          id="question_input"
          cols="30"
          rows="10"
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
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
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
              <option>2022</option>
              <option>2021</option>
              <option>2020</option>
              <option>2019</option>
              <option>20218</option>
              <option>2016</option>
            </select>
          </span>
        </div>
        <div>
          <button disabled={!questionInput} onClick={questionAdderHandler}>
            Add Question
          </button>
        </div>
      </div>
      <TagMaker />
    </div>
  );
}

export default QuestionInterface;
