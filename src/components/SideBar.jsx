import { Add } from "@mui/icons-material";
import {
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Sheet,
  Switch,
  Typography,
  useColorScheme,
} from "@mui/joy";
import React from "react";
import { useStateContext } from "../context/stateContext";

function SideBar() {
  const { mode, setMode } = useColorScheme();
  const { setModal } = useStateContext();

  const handleListClick = (type) => {
    setModal({ open: true, type });
  };

  function handleDarkModeCheck(e) {
    const { checked } = e.target;
    setMode(checked ? "dark" : "light");
  }

  return (
    <Sheet
      variant="outlined"
      sx={{
        bgcolor: "background.componentBg",
        boxShadow: "md",
        height: "fit-content",
        borderRadius: "md",
        position: "sticky",
        top: 16,
      }}
    >
      <List
        // variant="outlined"
        sx={{
          // boxShadow: "md",
          // maxWidth: "100%",
          p: 1,

          // borderRadius: "md",
        }}
      >
        <ListItem>
          <ListItemButton
            variant="plain"
            color="primary"
            onClick={() => handleListClick("addQuestion")}
            sx={{ p: 2, borderRadius: "sm" }}
          >
            <ListItemDecorator>
              <Add />
            </ListItemDecorator>
            <Typography fontWeight="lg">Add Question</Typography>
          </ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem>
          <ListItemButton
            onClick={() => handleListClick("importPdf")}
            sx={{ borderRadius: "sm" }}
          >
            Import PDF
          </ListItemButton>
        </ListItem>

        <ListDivider />
        <ListItem>
          <ListItemButton
            onClick={() => handleListClick("export")}
            sx={{ borderRadius: "sm" }}
          >
            Export Data
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            onClick={() => handleListClick("import")}
            sx={{ borderRadius: "sm" }}
          >
            Import Data
          </ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem>
          <ListItemButton
            onClick={() => handleListClick("CopyData")}
            sx={{ borderRadius: "sm" }}
          >
            Copy Data
          </ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem>
          <ListItemButton sx={{ borderRadius: "sm" }}>
            Words to Ignore
          </ListItemButton>
        </ListItem>
        <ListDivider />
        <ListItem
          endAction={
            <Switch
              checked={mode === "dark"}
              onChange={handleDarkModeCheck}
              id="dark-mode"
              size="sm"
              variant="outlined"
              color="neutral"
            />
          }
        >
          Dark Mode
        </ListItem>
      </List>
    </Sheet>
  );
}

export default SideBar;
