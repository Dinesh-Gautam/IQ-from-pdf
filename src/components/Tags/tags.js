import { useState } from "react";

export const useTags = () => {
  const [tags, setTags] = useState([]);

  function addTag(value) {
    const obj = {
      value: value || "",
    };
    setTags((prev) => [...prev, obj]);
  }

  function removeTag({ index }) {
    const RemovedTagsArr = tags.splice(index, 1);
    setTags(RemovedTagsArr);
  }

  function updateValue({ index, value }) {
    // console.log(index, value);
    console.log(tags);
    tags[index].value = value;
    // console.log(tags[index]);
    setTags((prev) => tags);
  }

  function resetTags() {
    setTags([]);
  }
  return { tags, setTags, addTag, removeTag, updateValue, resetTags };
};
