import { Menu, MenuItem } from "@mui/joy";
import React, { useState } from "react";

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuHandler = (event) => {
    event.preventDefault();
    setContextMenu(
      //   contextMenu === null
      //     ? {
      //         mouseX: event.clientX + 2,
      //         mouseY: event.clientY - 6,
      //       }
      //     : null
      event.target
    );
    console.log(contextMenu);
  };

  return { contextMenuHandler, contextMenu, setContextMenu };
}

export function ContextMenuComponent({ contextMenu, setContextMenu }) {
  const handleClose = () => {
    setContextMenu(null);
  };
  return (
    <Menu
      open={contextMenu !== null}
      //   open={true}
      onClose={handleClose}
      anchorEl={contextMenu}
    >
      <MenuItem onClick={handleClose}>Copy</MenuItem>
      <MenuItem onClick={handleClose}>Print</MenuItem>
      <MenuItem onClick={handleClose}>Highlight</MenuItem>
      <MenuItem onClick={handleClose}>Email</MenuItem>
    </Menu>
  );
}
