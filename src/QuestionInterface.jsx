import React, { useEffect, useRef, useState } from "react";
import TagMaker from "./components/Tags/TagMaker";
import { useStateContext } from "./context/stateContext";
import stringSimilarity from "string-similarity";
import QuestionAdder from "./components/QuestionAdder";
import { parse, v4 as uuid } from "uuid";
import WordsToIgnore from "./components/WordsToIgnore";
import EditDate from "./components/EditDate";

function QuestionInterface() {
  // const [questions, setQuestions] = useState([]);
  const { questions, pdfQuestions, setQuestions } = useStateContext();
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [checkbox, setCheckbox] = useState({});
  const [edit, setEdit] = useState({ editing: false });
  const [sort, setSort] = useState({
    questionSort: "relatedCount",
    orderBy: "dsc",
  });

  const sortSelectChange = (e) => {
    const { name, value } = e.target;

    setSort((prev) => ({ ...prev, [name]: value }));
  };

  const sortByRelatedCount = (orderBy) => {
    console.log("sorting by related count in : " + orderBy);
    let newArr;
    if (orderBy === "dsc") {
      newArr = questions.sort((a, b) => b.related.length - a.related.length);
    } else {
      newArr = questions.sort((a, b) => a.related.length - b.related.length);
    }
    setQuestions([...newArr]);
  };

  const sortByDateYear = (orderBy) => {
    console.log("sorting by date in : " + orderBy);
    let newArr;
    if (orderBy === "dsc") {
      newArr = questions.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else {
      newArr = questions.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    }
    setQuestions([...newArr]);
  };

  const sortBtnHandler = () => {
    const { questionSort, orderBy } = sort;

    switch (questionSort) {
      case "date":
        sortByDateYear(orderBy);
        break;
      case "relatedCount":
        sortByRelatedCount(orderBy);
        break;
      default:
        sortByRelatedCount(orderBy);
    }
  };

  const copyBtnHandler = () => {
    let string = "";

    questions.forEach(({ question, related, month, year }, index) => {
      if (checkbox.importantQuestion) {
        string +=
          related.length > 0
            ? `${
                related.length && (checkbox.relatedCount || checkbox.Date)
                  ? `(${checkbox.relatedCount ? related.length + 1 : ""} ${
                      checkbox.Date
                        ? `[${month} ${year}],` +
                          related.map((e) => `[${e.month} ${e.year}]`)
                        : ""
                    }) : `
                  : ""
              } ${question} \n${
                checkbox.relatedQuestions && related.length
                  ? related
                      .map(
                        (e) =>
                          `\t- ${
                            related.Date ? `(${e.month} ${e.year})` : ""
                          } ${e.question}`
                      )
                      .join("\n")
                  : ""
              }\n\n`
            : "";
      } else {
        string += `${
          related.length && (checkbox.relatedCount || checkbox.Date)
            ? `(${checkbox.relatedCount ? related.length + 1 : ""} ${
                checkbox.Date
                  ? `[${month} ${year}],` +
                    related.map((e) => `[${e.month} ${e.year}]`)
                  : ""
              }) : `
            : ""
        } ${question} \n${
          checkbox.relatedQuestions && related.length
            ? related
                .map(
                  (e) =>
                    `\t- ${related.Date ? `(${e.month} ${e.year})` : ""} ${
                      e.question
                    }`
                )
                .join("\n")
            : ""
        }\n\n`;
      }
    });

    console.log(string);
    navigator.clipboard.writeText(string);
  };

  // const copyWithRelatedButtonHandler = () => {
  //   let string = "";

  //   questions.forEach(({ question, related }, index) => {
  //     string += `${
  //       related.length
  //         ? `(${related.length + 1} ${related.map(
  //             (e) => `[${e.month} ${e.year}]`
  //           )})`
  //         : ""
  //     } ${question}\n\t`;
  //   });

  //   console.log(string);
  //   navigator.clipboard.writeText(string);
  // };

  const saveBtnHandler = () => {
    localStorage.setItem("questions", JSON.stringify(questions));
    alert("saved");
  };

  const getSavedBtnHandler = () => {
    const data = JSON.parse(localStorage.getItem("questions"));
    if (!data) {
      alert("No data found in local storage");
      return;
    }
    setQuestions(data);
  };

  const editDateHandler = (id, relatedId) => {
    let obj = questions.find((q) => q.id === id);
    if (relatedId) {
      obj = obj.related.find((q) => q.id === relatedId);
    }
    setEdit({ editing: true, parentId: id, relatedId: relatedId || null, obj });
  };

  const editDateSubmitHandler = (obj) => {
    let newArr;
    if (edit.relatedId) {
      newArr = questions.map((q) => {
        if (q.id === edit.parentId) {
          return {
            ...q,
            related: q.related.map((relatedQ) =>
              relatedQ.id === edit.relatedId
                ? { ...relatedQ, month: obj.month, year: obj.year }
                : relatedQ
            ),
          };
        } else {
          return q;
        }
      });
    } else {
      newArr = questions.map((q) => {
        if (q.id === edit.parentId) {
          return { ...q, month: obj.month, year: obj.year };
        } else {
          return q;
        }
      });
    }
    setQuestions(newArr);
    setEdit({ editing: false });
  };

  const deleteHandler = (id) => {
    const newArr = questions.filter((q) => q.id !== id);
    setQuestions(newArr);
  };

  const checkboxChangeHandler = (event) => {
    const target = event.target;
    const { name, checked } = target;

    setCheckbox((prev) => ({ ...prev, [name]: checked }));
  };

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
      <div className="question-area-container">
        <div className="question-container">
          <h4> QuestionArea</h4>
          {questions.length > 0 && (
            <>
              <div>
                <span>Sort:</span>
                <select
                  onChange={sortSelectChange}
                  value={sort.questionSort}
                  name="questionSort"
                  id="questionSort"
                >
                  <option value="relatedCount">Related count</option>
                  <option value="date">Date year</option>
                </select>
                <span>Order by:</span>
                <select
                  onChange={sortSelectChange}
                  value={sort.orderBy}
                  name="orderBy"
                  id="orderBy"
                >
                  <option value="dsc">dsc</option>
                  <option value="asc">asc</option>
                </select>
                <button onClick={sortBtnHandler}>Sort</button>
              </div>
              <div>
                <h4>
                  {`Questions are sorted by '${sort.questionSort}' in '${sort.orderBy}' order.`}
                </h4>
              </div>
            </>
          )}
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
                    {selectedQuestion.id === q.id && (
                      <button
                        onClick={() => {
                          editDateHandler(q.id);
                        }}
                        style={{ marginLeft: "2rem" }}
                      >
                        Edit Date
                      </button>
                    )}

                    {selectedQuestion.id === q.id && (
                      <button
                        onClick={() => {
                          deleteHandler(q.id);
                        }}
                        style={{ marginLeft: "2rem" }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="right-container">
          <div className="right-wrapper">
            <QuestionAdder />
            {selectedQuestion && !!selectedQuestion.related.length && (
              <div>
                <h4>Related Questions: </h4>
                <div className="related-question">
                  {selectedQuestion.related.map((q, index) => {
                    return (
                      <div className={"question"} key={index}>
                        <span className="questions-extras questions-extras-month">{`${q.month} ${q.year}`}</span>
                        <span>{q.question}</span>
                        <button
                          onClick={() => {
                            editDateHandler(selectedQuestion.id, q.id);
                          }}
                          style={{ marginLeft: "2rem" }}
                        >
                          Edit Date
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {edit.editing && (
              <EditDate
                prevMonth={edit.obj.month}
                prevYear={edit.obj.year}
                editDateSubmitHandler={editDateSubmitHandler}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <h4>Copy Data:</h4>
        <div>
          <div>
            <input
              onChange={checkboxChangeHandler}
              checked={checkbox.importantQuestion || false}
              id="importantQuestion"
              type="checkbox"
              name="importantQuestion"
            />
            <label htmlFor="importantQuestion">Important Questions</label>
          </div>

          <div>
            <input
              onChange={checkboxChangeHandler}
              checked={checkbox.relatedQuestions || false}
              id="relatedQuestions"
              type="checkbox"
              name="relatedQuestions"
            />
            <label htmlFor="relatedQuestions">Related Questions</label>
          </div>

          <div>
            <input
              onChange={checkboxChangeHandler}
              checked={checkbox.relatedCount || false}
              id="relatedCount"
              type="checkbox"
              name="relatedCount"
            />
            <label htmlFor="relatedCount">Related Count</label>
          </div>

          <div>
            <input
              onChange={checkboxChangeHandler}
              checked={checkbox.Date || false}
              id="Date"
              type="checkbox"
              name="Date"
            />
            <label htmlFor="Date">Dates</label>
          </div>
        </div>
        <button onClick={copyBtnHandler}>Copy Questions</button>
        {/* <button onClick={copyWithRelatedButtonHandler}>
              Copy with Related Questions
            </button> */}
      </div>
      <div>
        <h4>Save Data:</h4>
        <button onClick={saveBtnHandler}>Save to local Storage</button>
        <button onClick={getSavedBtnHandler}>Get from local Storage</button>
        <button onClick={() => localStorage.clear() || alert("cleared")}>
          Clear Local Storage
        </button>
      </div>

      {/* <TagMaker /> */}
      <WordsToIgnore />
    </div>
  );
}

export default QuestionInterface;
