import React, { useEffect, useState } from "react";

function QuestionInterface() {
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const [tags, setTags] = useState({});
  const [tagsCount, setTagsCount] = useState(0);

  function questionAdderHandler() {
    setQuestions((prev) => [...prev, { question: questionInput }]);
    setQuestionInput("");
  }

  function tagInputChangeHandler(index, value) {
    console.log(tags);
    tags[index].value = value;
    // const changedTagValue = tags.map((tag) => {
    //   return { ...tag, value: tag.id === index ? value : tag.value };
    // });
    setTags(tags);
  }

  useEffect(() => {
    if (tagsCount < 1) return;

    setTags((prev) => ({ ...prev, [tagsCount - 1]: { value: "" } }));
  }, [tagsCount]);

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

      <div>
        {Array.from({ length: tagsCount }).map((value, index) => (
          <input
            onChange={(e) => {
              tagInputChangeHandler(index, e.target.value);
            }}
            key={index}
            value={value}
            type="text"
            name="Tag"
            placeholder="Add Tag value"
          />
        ))}

        <div>
          <button onClick={() => setTagsCount((prev) => prev + 1)}>
            Add More Tags
          </button>
          <button onClick={() => setTagsCount((prev) => prev > 0 && prev - 1)}>
            Remove last Tag
          </button>
          <button onClick={() => setTagsCount(1)}>Rest</button>
          <button>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default QuestionInterface;
