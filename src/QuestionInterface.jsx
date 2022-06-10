import React, { useState } from "react";

function QuestionInterface() {
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  function questionAdderHandler(event) {
    setQuestions((prev) => [...prev, { question: questionInput }]);
    setQuestionInput("");
  }
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
        <button onClick={questionAdderHandler}>Add Question</button>
      </div>
    </div>
  );
}

export default QuestionInterface;
