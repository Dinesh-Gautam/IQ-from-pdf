import "./App.css";

import stringSimilarity from "string-similarity";

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

import { useEffect, useRef, useState } from "react";
function App() {
  const inputRef = useRef();
  const [fileURL, setFileURL] = useState(null);
  useEffect(() => {
    const result = stringSimilarity.compareTwoStrings(
      "What do you mean by addressing mode? Explain any two",
      "What do you mean by addressing mode? Explain any five."
      // "Write in brief about Cache memory."
    );
    GlobalWorkerOptions.workerSrc =
      window.location.origin + "/pdf.worker.min.js";

    console.log(result);
  }, []);

  function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function (resolve) {
      PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
        // The main trick to obtain the text of the PDF page, use the getTextContent method
        pdfPage.getTextContent().then(function (textContent) {
          var textItems = textContent.items;
          var finalString = [];

          // Concatenate the string of the item to the final string
          for (var i = 0; i < textItems.length; i++) {
            var item = textItems[i];
            if (item.str.length < 10) continue;
            finalString.push(item.str);
          }

          // Solve promise with the text retrieven from the page
          resolve(textItems);
          pdfPage.cleanup();
        });
      });
    });
  }

  useEffect(() => {
    if (!fileURL) return;
    fileURL.forEach(async (url) => {
      const task = getDocument(url);
      console.log(task);
      const doc = await task.promise;

      var totalPages = doc.numPages;
      var pageNumber = 1;

      // Extract the text
      getPageText(pageNumber, doc).then(function (textPage) {
        // Show the text of the page in the console
        console.log(textPage);
      });
    });
  }, [fileURL]);

  function fileChangeHandler() {
    const input = inputRef.current;

    for (const file of input.files) {
      const url = URL.createObjectURL(file);
      console.log(url);
    }
    console.log(input.files);
    setFileURL([...input.files].map((file) => URL.createObjectURL(file)));
  }

  return (
    <div className="App">
      <input ref={inputRef} type="file" onChange={fileChangeHandler} multiple />

      {fileURL &&
        fileURL.map((url, index) => {
          return (
            <iframe
              height={400}
              width={400}
              key={index}
              title={index}
              src={url}
            />
          );
        })}
    </div>
  );
}

export default App;
