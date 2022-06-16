
import React, { useEffect, useState } from 'react'
import { useTags } from './tags'
import {v4 as uuid} from "uuid"


function TagMaker() {

    const [tags, setTags] = useState([]);

    function addTag(value) {
      const obj = {
        value: value || "",
        id : uuid()
      };
      setTags((prev) => [...prev, obj]);
    }
  
    function removeTag({ id }) {
        const newArr= tags.filter(tag => tag.id !== id)
      setTags(newArr)
    }
  
    function updateValue({ index, value }) {
        
      setTags((prev) => {
        prev[index].value = value;
        return [...prev]
      });
    }
  
    function resetTags() {
      setTags([]);
    }
    
  return (
    <div>
    {tags.map((tag, index) => (
        <TagInput tag = {tag} index ={index} key ={tag.id} updateValue={updateValue} removeTag={removeTag} />
      ))}

    <div>
      <button onClick={() => addTag()}>
        Add Tags
      </button>
      <button onClick={() => resetTags()}>
        Rest
    </button>
      <button>Submit</button>
    </div>
  </div>
  )
}

function TagInput ({tag,index , updateValue , removeTag}) {

    return (
    <div>
    <input
      onChange={(e) => {
        updateValue({index : index, value : e.target.value});
      }}
      value = {tag.value}

      type="text"
      name="Tag"
      placeholder="Add Tag value"
    />
    <button onClick = {e => removeTag({id : tag.id})}>-</button>
    </div>)
}

export default TagMaker