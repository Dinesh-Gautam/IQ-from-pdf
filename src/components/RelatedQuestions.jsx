import { DeleteForever, Edit, MoreVert } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  ListDivider,
  ListItemDecorator,
  Menu,
  MenuItem,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import React, { useState } from "react";
import { useStateContext } from "../context/stateContext";
import { useGetRelated } from "../QuestionInterface";
import { useEditData } from "./EditDate";

function RelatedQuestions() {
  const { questions, setQuestions, selectedQuestion } = useStateContext();

  const [editDateHandler] = useEditData();

  const getRelated = useGetRelated();

  const relatedDeleteHandler = (parentId, relatedId) => {
    // deletedQuestions = questions
    const newArr = questions.related.filter((r) => r.id !== relatedId);

    setQuestions((prev) => ({ ...prev, related: newArr }));
  };

  const unGroupRelatedHandler = (id) => {
    const rq = questions.related.find((q) => q.id === id);

    setQuestions((prev) => ({
      questions: [...prev.questions, rq],
      related: prev.related.filter((q) => q.id !== id),
    }));
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [qandsq, setQandsq] = useState({});

  const copyQuestionHandler = ({ pid, rid }) => {
    let text = "";
    text = rid
      ? questions.related.find((q) => q.id === rid).question
      : getRelated(sq.id)
          .map((q) => q.question)
          .join("\n");

    console.log(text);
    navigator.clipboard.writeText(text);
  };

  const onMouseEnter = (id) => {
    setAnchorEl(null);
    setShowMoreOptions({ show: true, id });
  };

  const handleClick = (event, q, sq) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setQandsq({ q, sq });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { q, sq } = qandsq;
  return (
    <Sheet
      variant="outlined"
      sx={{
        bgcolor: "background.componentBg",
        boxShadow: "md",
        borderRadius: "md",
        flex: 1,
        p: 1,
        pr: 2,
        pl: 2,
      }}
    >
      <Menu
        id="positioned-demo-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        aria-labelledby="positioned-demo-button"
        placement="bottom-end"
      >
        <MenuItem
          onClick={(e) => {
            editDateHandler(q.id);
            handleClose();
          }}
        >
          <ListItemDecorator>
            <Edit />
          </ListItemDecorator>
          Edit
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            copyQuestionHandler({ rid: q.id });
            handleClose();
          }}
        >
          <ListItemDecorator />
          Copy
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            copyQuestionHandler({ pid: sq.id });
            handleClose();
          }}
        >
          <ListItemDecorator />
          Copy All
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            unGroupRelatedHandler(q.id);
            handleClose();
          }}
        >
          <ListItemDecorator />
          Un Group
        </MenuItem>

        <ListDivider />
        <MenuItem
          onClick={(e) => {
            relatedDeleteHandler(sq.id, q.id);
            handleClose();
          }}
        >
          <ListItemDecorator sx={{ color: "inherit" }}>
            <DeleteForever />
          </ListItemDecorator>
          Delete
        </MenuItem>
      </Menu>

      <Typography mb={2} level="h4">
        Related Questions
      </Typography>

      <Stack direction="column" gap={1}>
        {questions.questions
          .filter((q) => selectedQuestion.some((sq) => sq.id === q.id))
          .map((sq, index) => {
            return getRelated(sq.id).map((q, index) => {
              return (
                <Sheet
                  variant="outlined"
                  sx={{
                    // p: 2,
                    boxShadow: "sm",
                    borderRadius: "md",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                    pl: 2,
                    pr: 2,
                  }}
                  onMouseEnter={() => onMouseEnter(q.id)}
                  // className={
                  //   "question " +
                  //   (selectedRelatedQuestions.some(
                  //     (sq) => sq.id === q.id
                  //   )
                  //     ? "selected"
                  //     : "")
                  // }
                  // onClick={(e) => {
                  //   console.log(selectedRelatedQuestions);
                  //   if (!e.ctrlKey) {
                  //     setSelectedRelatedQuestions([
                  //       {
                  //         parent: sq,
                  //         related: q,
                  //       },
                  //     ]);
                  //   } else {
                  //     setSelectedRelatedQuestions((prev) => [
                  //       ...prev,
                  //       {
                  //         parent: sq,
                  //         related: q,
                  //       },
                  //     ]);
                  //   }
                  // }}
                  key={index}
                >
                  <Box>
                    <Box>
                      <Chip
                        size="sm"
                        variant="outlined"
                        color="neutral"
                      >{`${q.month} ${q.year}`}</Chip>
                    </Box>
                    <Typography ml={1}>{q.question}</Typography>
                  </Box>
                  {showMoreOptions.show && showMoreOptions.id === q.id && (
                    <IconButton
                      id="positioned-demo-button"
                      aria-controls={open ? "positioned-demo-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      variant="outlined"
                      color="neutral"
                      onMouseDown={(event) => handleClick(event, q, sq)}
                    >
                      <MoreVert />
                    </IconButton>
                  )}
                </Sheet>
              );
            });
          })}
      </Stack>
    </Sheet>
  );
}

export default RelatedQuestions;
