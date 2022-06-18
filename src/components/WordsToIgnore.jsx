import React, { useEffect, useState } from 'react'
import { useStateContext } from '../context/stateContext';

function WordsToIgnore() {
const {wordsToIgnore, setWordsToIgnore} = useStateContext();

const valueChangeHandler = (event) => {
    const value = event.target.value;

    setWordsToIgnore(value.split(','))

}

useEffect(() => {
    if(wordsToIgnore.length) {
        localStorage.setItem('wordsToIgnore' , JSON.stringify(wordsToIgnore))
    }else {
        setWordsToIgnore( JSON.parse(localStorage.getItem('wordsToIgnore')) || "")
    }
}, [wordsToIgnore])


  return (
    <div>
        <h4>Words to Ignore:</h4>
        <textarea onChange={valueChangeHandler} value={wordsToIgnore.join(',')} name="wordsToIgnore" id="wordsToIgnore" cols="30" rows="10">

        </textarea>
    </div>
  )
}

export default WordsToIgnore