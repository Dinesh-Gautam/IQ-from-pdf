import React, { useEffect, useState } from "react";
import TagMaker from "./components/Tags/TagMaker";

function QuestionInterface() {
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  

  function questionAdderHandler() {
    setQuestions((prev) => [...prev, { question: questionInput }]);
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
        <div>
          <button onClick={questionAdderHandler}>Add Question</button>
        </div>
      </div>
      <TagMaker />
    </div>
  );
}

export default QuestionInterface;
