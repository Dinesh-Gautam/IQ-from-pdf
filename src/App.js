/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";

// import stringSimilarity from "string-similarity";

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

import { useEffect, useState } from "react";
import { useStateContext } from "./context/stateContext";
import { Input } from "@mui/joy";
function App() {
  const { setPdfQuestions } = useStateContext();
  const [fileURL, setFileURL] = useState(null);

  const [cachedPdfQuestions, setCachedPdfQuestions] = useState([]);

  useEffect(() => {
    GlobalWorkerOptions.workerSrc =
      window.location.origin + "/pdf.worker.min.js";
  }, []);

  function getPageText(pageNum, PDFDocumentInstance) {
    return new Promise(async function (resolve) {
      const pdfPage = await PDFDocumentInstance.getPage(pageNum);
      const textContent = await pdfPage.getTextContent();

      var textItems = textContent.items
        .filter((item) => item.str.length > 10)
        .map((item) => item.str);
      // var finalString = [];

      // for (var i = 0; i < textItems.length; i++) {
      //   var item = textItems[i];
      //   if (item.str.length < 10) continue;
      //   finalString.push(item.str);
      // }

      resolve(textItems);
      pdfPage.cleanup();
    });
  }

  useEffect(() => {
    if (!fileURL) return;
    fileURL.forEach(async (url) => {
      const task = getDocument(url);
      const doc = await task.promise;
      var pageNumber = 1;

      const textPage = await getPageText(pageNumber, doc);

      setCachedPdfQuestions((prev) => [...prev, textPage]);
    });
  }, [fileURL]);

  useEffect(() => {
    if (
      fileURL &&
      cachedPdfQuestions &&
      cachedPdfQuestions.length === fileURL.length
    ) {
      setPdfQuestions(cachedPdfQuestions);
      setCachedPdfQuestions([]);
    }
  }, [cachedPdfQuestions]);

  function fileChangeHandler(event) {
    const input = event.target;

    for (const file of input.files) {
      const url = URL.createObjectURL(file);
      console.log(url);
    }
    console.log(input.files);
    setFileURL([...input.files].map((file) => URL.createObjectURL(file)));
  }

  return (
    <div className="App">
      <Input type="file" onChange={fileChangeHandler} multiple />

      {/* {fileURL &&
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
        })} */}
    </div>
  );
}

export default App;
