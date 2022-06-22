import React, { useEffect, useRef, useState } from "react";
import TagMaker from "./components/Tags/TagMaker";
import { useStateContext } from "./context/stateContext";
import stringSimilarity from "string-similarity";
import QuestionAdder from "./components/QuestionAdder";
import { parse, v4 as uuid } from "uuid";
import WordsToIgnore from "./components/WordsToIgnore";
import EditDate from "./components/EditDate";
import { NlpSentenceEncoderComponent } from "./Tensorflow/nlp";
import SaveQuestions from "./components/SaveQuestions";

const editInit = {
  editing: false,
  parentId: [],
  relatedId: [],
};

function QuestionInterface() {
  useEffect(() => {
    // console.log(nlp);
  }, []);

  // const [questions, setQuestions] = useState([]);
  const { questions, pdfQuestions, setQuestions } = useStateContext();
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [checkbox, setCheckbox] = useState({});
  const [selectedRelatedQuestions, setSelectedRelatedQuestions] = useState([]);
  const [edit, setEdit] = useState({
    editing: false,
    parentId: [],
    relatedId: [],
  });
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
      newArr = questions.questions.sort(
        (a, b) => getRelated(b.id).length - getRelated(a.id).length
      );
    } else {
      newArr = questions.questions.sort(
        (a, b) => getRelated(a.id).length - getRelated(b.id).length
      );
    }
    setQuestions((prev) => ({ ...prev, questions: [...newArr] }));
  };

  const sortByDateYear = (orderBy) => {
    console.log("sorting by date in : " + orderBy);
    let newArr;
    if (orderBy === "dsc") {
      newArr = questions.questions.sort(
        (a, b) => parseInt(b.year) - parseInt(a.year)
      );
    } else {
      newArr = questions.questions.sort(
        (a, b) => parseInt(a.year) - parseInt(b.year)
      );
    }
    setQuestions((prev) => ({ ...prev, questions: [...newArr] }));
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

    questions.forEach(({ question, month, year, id }, index) => {
      let related = questions.related.filter((r) => r.id === id);
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
    alert("Copied text!");
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

  const editDateHandler = (relatedId) => {
    selectedQuestion.forEach(({ id }) => {
      let obj = questions.questions.find((q) => q.id === id);
      if (relatedId) {
        obj = questions.related.find((q) => q.id === relatedId);
      }
      setEdit((prev) => ({
        ...prev,
        editing: true,
        parentId: [...prev.parentId, id],
        relatedId: relatedId || null,
        obj,
      }));
    });
  };

  const editDateSubmitHandler = (obj) => {
    let newArr;

    if (edit.relatedId) {
      newArr = questions.map((q) => {
        console.log(edit.relatedId);
        if (edit.parentId.some((pId) => pId === q.id)) {
          console.log(q);
          return {
            ...q,
            related: questions.related.map((relatedQ) =>
              relatedQ.id === edit.relatedId
                ? { ...relatedQ, month: obj.month, year: obj.year }
                : relatedQ
            ),
          };
        } else {
          return q;
        }
      });
      setQuestions((prev) => ({ ...prev, related: newArr }));
    } else {
      console.log(edit.parentId);
      newArr = questions.questions.map((q) => {
        if (edit.parentId.some((p) => q.id === p)) {
          return { ...q, month: obj.month, year: obj.year };
        } else {
          return q;
        }
      });
      setQuestions((prev) => ({ ...prev, questions: newArr }));
    }

    setEdit(editInit);
  };

  const deleteHandler = () => {
    const newArr = questions.questions.filter(
      (q) => !selectedQuestion.some((sid) => sid.id === q.id)
    );
    setQuestions((prev) => ({ ...prev, questions: newArr }));
  };

  const relatedDeleteHandler = (parentId, relatedId) => {
    const newArr = questions.map((q) => {
      if (q.id === parentId) {
        return {
          ...q,
          related: questions.related.filter((r) => r.id !== relatedId),
        };
      } else {
        return q;
      }
    });
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

  function getRelated(parentId) {
    return questions.related.filter((e) => e.parentId === parentId);
  }

  useEffect(() => {
    if (!questions.length && pdfQuestions && !pdfQuestions.length) return;
    // console.log(pdfQuestions);

    // const nlp = new NlpSentenceEncoderComponent();
    // nlp.Init(pdfQuestions);

    // return;

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
          {selectedQuestion.length > 0 && (
            <div>
              <button
                onClick={() => {
                  editDateHandler();
                }}
                style={{ marginLeft: "2rem" }}
              >
                Edit Date
              </button>
              <button
                onClick={() => {
                  // selectedQuestion.forEach((q) => {
                  deleteHandler();
                  // });
                }}
                style={{ marginLeft: "2rem" }}
              >
                Delete
              </button>
            </div>
          )}
          <h4> QuestionArea</h4>

          {questions.questions.length > 0 && (
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

          {questions.questions &&
            questions.questions.map((q, index) => {
              return (
                <div
                  onClick={(e) => {
                    if (e.ctrlKey) {
                      setSelectedQuestion((prev) => [...prev, q]);
                    } else {
                      setSelectedQuestion([q]);
                    }
                  }}
                  className={
                    "question " +
                    (selectedQuestion.some((sq) => sq.id === q.id)
                      ? "selected"
                      : "")
                  }
                  key={index}
                >
                  <div className="questions-extras-container">
                    <span className="questions-extras questions-extras-month">{`${q.month} ${q.year}`}</span>
                    {getRelated(q.id).length ? (
                      <span className="questions-extras">
                        {getRelated(q.id).length}
                      </span>
                    ) : (
                      ""
                    )}

                    {getRelated(q.id).map(({ id, month, year }) => (
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
        </div>
        <div className="right-container">
          <div className="right-wrapper">
            <QuestionAdder />
            {selectedQuestion && !!selectedQuestion.length && (
              <div>
                <h4>Related Questions: </h4>
                <div className="related-question">
                  {questions.questions
                    .filter((q) =>
                      selectedQuestion.some((sq) => sq.id === q.id)
                    )
                    .map((sq, index) => {
                      return getRelated(sq.id).map((q, index) => {
                        return (
                          <div
                            className={"question"}
                            // className={
                            //   "question " +
                            //   (selectedRelatedQuestions.some(
                            //     (sq) => sq.id === q.id
                            //   )
                            //     ? "selected"
                            //     : "")
                            // }
                            // onClick={(e) => {
                            //   console.log(selectedRelatedQuestions);
                            //   if (!e.ctrlKey) {
                            //     setSelectedRelatedQuestions([
                            //       {
                            //         parent: sq,
                            //         related: q,
                            //       },
                            //     ]);
                            //   } else {
                            //     setSelectedRelatedQuestions((prev) => [
                            //       ...prev,
                            //       {
                            //         parent: sq,
                            //         related: q,
                            //       },
                            //     ]);
                            //   }
                            // }}
                            key={index}
                          >
                            <span className="questions-extras questions-extras-month">{`${q.month} ${q.year}`}</span>
                            <span>{q.question}</span>
                            <button
                              onClick={() => {
                                editDateHandler(q.id);
                              }}
                              style={{ marginLeft: "2rem" }}
                            >
                              Edit Date
                            </button>
                            <button
                              onClick={() => {
                                relatedDeleteHandler(sq.id, q.id);
                              }}
                              style={{ marginLeft: "2rem" }}
                            >
                              Delete
                            </button>
                          </div>
                        );
                      });
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

      <SaveQuestions />

      {/* <TagMaker /> */}
      <WordsToIgnore />
    </div>
  );
}

export default QuestionInterface;
