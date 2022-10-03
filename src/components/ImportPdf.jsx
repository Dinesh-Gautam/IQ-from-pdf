import { Button, Sheet, Typography } from "@mui/joy";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import ModalFooter from "./ModalFooter";
import ModalTitle from "./ModalTitle";
import { getDocument } from "pdfjs-dist";
import { pdfInfoInit, useStateContext } from "../context/stateContext";
import { v4 as uuidv4 } from "uuid";
import { Box, Stack } from "@mui/system";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import QuestionAdder from "./QuestionAdder";

function ImportPdf() {
  const inputRef = useRef(null);
  const [fileURL, setFileURL] = useState(null);
  const [cachedPdfQuestions, setCachedPdfQuestions] = useState([]);
  const { pdfQuestions, setPdfQuestions, pdfInfo, setPdfInfo } =
    useStateContext();

  function getPageText(pageNum, PDFDocumentInstance) {
    return new Promise(async function (resolve) {
      const pdfPage = await PDFDocumentInstance.getPage(pageNum);
      const textContent = await pdfPage.getTextContent();

      var textItems = textContent.items
        .filter((item) => item.str.length > 2)
        .map((item) => item.str);

      resolve(textItems);
      pdfPage.cleanup();
    });
  }

  useEffect(() => {
    if (
      fileURL &&
      cachedPdfQuestions &&
      cachedPdfQuestions.length === fileURL.length
    ) {
      console.log(cachedPdfQuestions);
      setPdfQuestions(cachedPdfQuestions);
      setCachedPdfQuestions([]);
    }
  }, [cachedPdfQuestions]);

  useEffect(
    () => () => {
      setPdfQuestions([]);
      setPdfInfo(pdfInfoInit);
    },
    []
  );

  function getDateInfo(fn) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const years = [15, 16, 17, 18, 19, 20, 21, 22];
    const month =
      months.find((m) => fn.toLowerCase().indexOf(m.toLowerCase()) !== -1) ||
      months[0];
    const year =
      years.find((m) => fn.toLowerCase().indexOf(m) !== -1) ||
      years[years.length - 1];

    return { month, year: year.toString() };
  }

  useEffect(() => {
    if (!fileURL) return;
    fileURL.forEach(async ({ id, fileName, fileUrl: url }) => {
      const task = getDocument(url);
      const doc = await task.promise;
      let pageNumber = 1;

      const textPage = await getPageText(pageNumber, doc);

      const dateInfo = getDateInfo(fileName);

      setCachedPdfQuestions((prev) => [
        ...prev,
        { id, dateInfo, fileUrl: url, fileName, text: textPage },
      ]);
    });
  }, [fileURL]);

  function fileChangeHandler(event) {
    const input = event.target;

    for (const file of input.files) {
      const url = URL.createObjectURL(file);
      console.log(url);
    }
    console.log(input.files);
    setFileURL(
      [...input.files].map((file) => ({
        id: uuidv4(),
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
      }))
    );
  }

  return (
    <>
      <ModalTitle text="Import pdf" />

      <Box sx={{ height: "100%", display: "flex", gap: 2 }}>
        <Box>
          {pdfQuestions && !pdfQuestions.length && (
            <Sheet
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: "background.componentBg",
                borderRadius: "md",
              }}
            >
              <Typography
                onClick={() => inputRef.current.click()}
                sx={{
                  cursor: "pointer",
                  opacity: 0.5,
                  minHeight: 230,
                  minWidth: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                level="h4"
              >
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  onChange={fileChangeHandler}
                  multiple
                />
                Select files
              </Typography>
            </Sheet>
          )}

          {pdfQuestions && !!pdfQuestions.length && (
            <Stack
              sx={{ maxWidth: 300, overflowX: "hidden", overflowY: "auto" }}
              gap={2}
              flexWrap="wrap"
              direction="row"
            >
              {pdfQuestions.map((q) => {
                return (
                  <Sheet
                    key={q.id}
                    onClick={() =>
                      setPdfInfo((prev) => ({ ...prev, clickedId: q.id }))
                    }
                    variant="outlined"
                    sx={{
                      backgroundColor: "background.componentBg",
                      borderColor: pdfInfo?.pdfAdded?.includes(q.id)
                        ? "success.solidBg"
                        : pdfInfo.clickedId === q.id
                        ? "primary.solidBg"
                        : "neutral.outlinedBorder",
                      borderRadius: "md",
                      p: 2,
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      cursor: "pointer",
                    }}
                  >
                    <PictureAsPdfIcon />
                    {q.fileName}
                  </Sheet>
                );
              })}
            </Stack>
          )}
        </Box>
        {fileURL && (
          <Box sx={{ overflow: "hidden", borderRadius: "md", flex: 1 }}>
            {pdfInfo.clickedId ? (
              <object
                style={{
                  width: "100%",
                  height: "100%",
                }}
                data={
                  pdfQuestions.find((q) => q.id === pdfInfo.clickedId).fileUrl
                }
              ></object>
            ) : (
              <Typography
                sx={{
                  opacity: 0.5,
                  minHeight: 200,
                  minWidth: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                level="h4"
              >
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  onChange={fileChangeHandler}
                  multiple
                />
                Select a file
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          <QuestionAdder pdfImport />
        </Box>

        {/* <Box sx={{ minWidth: 500 }}> */}
      </Box>
    </>
  );
}

export default ImportPdf;
