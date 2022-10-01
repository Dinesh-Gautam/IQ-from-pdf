import { Box } from "@mui/joy";
import React from "react";

function ModalFooter({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        alignItems: "flex-end",
        flex: "auto",
        justifyContent: "flex-end",
        mt: 4,
        pt: 2,
      }}
    >
      {children}
    </Box>
  );
}

export default ModalFooter;
