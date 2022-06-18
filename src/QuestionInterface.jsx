import React, { useEffect, useRef, useState } from "react";
import TagMaker from "./components/Tags/TagMaker";
import { useStateContext } from "./context/stateContext";
import stringSimilarity from "string-similarity";
import QuestionAdder from "./components/QuestionAdder";
import { v4 as uuid } from "uuid";
import WordsToIgnore from "./components/WordsToIgnore";



function QuestionInterface() {
  // const [questions, setQuestions] = useState([]);
  const { questions, pdfQuestions, setQuestions } = useStateContext();
  const [selectedQuestion, setSelectedQuestion] = useState("");

const copyBtnHandler = () => {
let string = ""

  questions.forEach(({question, related} , index) => {
    string+= `${related.length ? `(${related.length + 1} ${related.map(e => `[${e.month} ${e.year}]`)})` : ""} ${question} \n\n`;
  })

  console.log(string)
  navigator.clipboard.writeText(string)
}

const copyWithRelatedButtonHandler = () => {
  let string = ""

  questions.forEach(({question, related} , index) => {
    string+= `${related.length ? `(${related.length + 1} ${related.map(e => `[${e.month} ${e.year}]`)})` : ""} ${question}\n\t${related.length ?  related.map(e => `- (${e.month} ${e.year}) ${e.question}`).join("\n\t") : ""}\n\n`;
  })

  console.log(string)
  navigator.clipboard.writeText(string)
}

const saveBtnHandler = () => {
  localStorage.setItem('questions' , JSON.stringify(questions));
  alert("saved")
}

const getSavedBtnHandler =() => {
  const data = JSON.parse(localStorage.getItem('questions'));
  if(!data)
  {
    alert("No data found in local storage");
    return
  }
  setQuestions(data)
}


  useEffect(() => {
    // console.log(questions);
  }, [questions]);

  let cacheQuestion = useRef([]);

  useEffect(() => {
    if (!questions.length && pdfQuestions && !pdfQuestions.length) return;
    // console.log(pdfQuestions);

    pdfQuestions.forEach((pdfPage) => {
      pdfPage.forEach((questionInput) => {
        let tempQuestions = cacheQuestion.current;
        const QuestionObj = {
          question: questionInput,
          id: uuid(),
          month: "Temp",
          year: "Temp",
        };
        console.log(tempQuestions);
        const relatedId = tempQuestions.filter(({ question }) => {
          const result = stringSimilarity.compareTwoStrings(
            questionInput,
            question
          );
          // console.log(questionInput, question);

          if (result > 0.7) {
            return true;
          } else {
            return false;
          }
        });
        if (relatedId.length > 0) {
          const newArr = tempQuestions.map((e) => {
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

          cacheQuestion.current = newArr;
          // setQuestions(newArr);
        } else {
          cacheQuestion.current = [
            ...tempQuestions,
            { ...QuestionObj, related: [] },
          ];
          // setQuestions((prev) => [...prev, { ...QuestionObj, related: [] }]);
        }
      });
    });

    setQuestions(cacheQuestion.current);
  }, [pdfQuestions]);
  return (
    <div>
      <div>
        <h4> QuestionArea</h4>
        <div className="question-container">
          {questions &&
            questions.map((q, index) => {
              return (
                <div
                  onClick={(e) => setSelectedQuestion(q)}
                  className={
                    "question " +
                    (selectedQuestion.id === q.id ? "selected" : "")
                  }
                  key={index}
                >
                  <div className="questions-extras-container">
                    <span className="questions-extras questions-extras-month">{`${q.month} ${q.year}`}</span>
                    {q.related.length ? (
                      <span className="questions-extras">
                        {q.related.length}
                      </span>
                    ) : (
                      ""
                    )}

                    {q.related.map(({ id, month, year }) => (
                      <span
                        key={id}
                        className="questions-extras"
                      >{`${month} ${year}`}</span>
                    ))}
                  </div>
                  <div>
                    <span>{`${index + 1}. `}</span>
                    <span>{q.question}</span>
                  </div>
                </div>
              );
            })}
            <button onClick={copyBtnHandler}>Copy Questions</button>
            <button onClick={copyWithRelatedButtonHandler}>Copy with Related Questions</button>

            <div>
              <button onClick={saveBtnHandler}>Save to local Storage</button>
            <button onClick={getSavedBtnHandler}>Get from local Storage</button>
            <button onClick={() => localStorage.clear() || alert("cleared")}>Clear Local Storage</button>
            </div>
        </div>
        {selectedQuestion && !!selectedQuestion.related.length && (
          <div>
            <h4>Related Questions: </h4>
            <div>
              {selectedQuestion.related.map((q, index) => {
                return (
                  <div className={"question"} key={index}>
                    <span className="questions-extras questions-extras-month">{`${q.month} ${q.year}`}</span>
                    <span>{q.question}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <QuestionAdder />
      {/* <TagMaker /> */}
      <WordsToIgnore />
    </div>
  );
}

export default QuestionInterface;
