/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from "@mui/joy";
import React, { useEffect } from "react";

function ModalTitle({ text }) {
  useEffect(() => {
    if (!text) {
      console.warn("No Edit prop is passed in ModalTitle");
    }
  }, []);
  return (
    <Typography
      component="h2"
      id="close-modal-title"
      level="h4"
      textColor="inherit"
      fontWeight="lg"
      mb={2}
    >
      {text}
    </Typography>
  );
}

export default ModalTitle;
