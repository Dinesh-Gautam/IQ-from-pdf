import { Box, Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";
import { useStateContext } from "../context/stateContext";
import CopyData from "./CopyData";
import EditDate from "./EditDate";
import ImportPdf from "./ImportPdf";
import QuestionAdder from "./QuestionAdder";
import SaveQuestions from "./SaveQuestions";

function RenderModal() {
  const { modal, setModal } = useStateContext();
  return (
    <>
      <Modal
        aria-labelledby="close-modal-title"
        open={modal.open}
        onClose={(event) => {
          setModal({ open: false, type: null });
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ModalDialog layout={modal.type === "importPdf" ? "fullscreen" : null}>
          <ModalClose variant="plain" />

          {modal.type === "addQuestion" && <QuestionAdder />}
          {modal.type === "CopyData" && <CopyData />}
          {modal.type === "import" && <SaveQuestions type={modal.type} />}
          {modal.type === "export" && <SaveQuestions type={modal.type} />}
          {modal.type === "edit" && <EditDate />}
          {modal.type === "importPdf" && <ImportPdf />}
          {/* </Box> */}
        </ModalDialog>
        {/* <Sheet
          variant="outlined"
          sx={{
            minWidth: 300,
            borderRadius: "md",
            p: 3,
            pb: 2,
            boxShadow: "md",
          }}
        > */}
        {/* 
          <Box>Buttons</Box> */}
        {/* </Sheet> */}
      </Modal>
    </>
  );
}

export default RenderModal;
