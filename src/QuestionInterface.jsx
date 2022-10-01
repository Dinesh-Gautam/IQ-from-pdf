/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import TagMaker from "./components/Tags/TagMaker";
import { useStateContext } from "./context/stateContext";
// import stringSimilarity from "string-similarity";
// import { parse, v4 as uuid } from "uuid";
import { useEditData } from "./components/EditDate";
// import { NlpSentenceEncoderComponent } from "./Tensorflow/nlp";
import Button from "@mui/joy/Button";
import RelatedQuestions from "./components/RelatedQuestions";
import {
  Box,
  Chip,
  FormLabel,
  IconButton,
  ListDivider,
  ListItemDecorator,
  Menu,
  MenuItem,
  Option,
  Select,
  Sheet,
  Typography,
  useColorScheme,
} from "@mui/joy";
import { DeleteForever, Edit, MoreVert } from "@mui/icons-material";
import FormControl from "@mui/joy/FormControl";

export function useGetRelated() {
  const { questions } = useStateContext();

  return (parentId) => questions.related.filter((e) => e.parentId === parentId);
}

function QuestionInterface() {
  const { setMode } = useColorScheme();
  useEffect(() => {
    // console.log(nlp);
    setMode("dark");
  }, []);

  // const [questions, setQuestions] = useState([]);
  const [undo, setUndo] = useState([]);
  const { questions, setQuestions, selectedQuestion, setSelectedQuestion } =
    useStateContext();

  const [sort, setSort] = useState({
    questionSort: "relatedCount",
    orderBy: "dsc",
  });

  const getRelated = useGetRelated();

  const sortSelectChange = (e) => {
    const { name, value } = e;

    setSort((prev) => ({ ...prev, [name]: value }));
  };

  const sortBtnHandler = () => {
    const { questionSort, orderBy } = sort;

    switch (questionSort) {
      case "date":
        sortByDateYear(orderBy);
        break;
      case "relatedCount":
        sortByRelatedCount(orderBy);
        break;
      default:
        sortByRelatedCount(orderBy);
    }
  };
  useEffect(sortBtnHandler, [sort]);

  const sortByRelatedCount = (orderBy) => {
    console.log("sorting by related count in : " + orderBy);
    let newArr;
    if (orderBy === "dsc") {
      newArr = questions.questions.sort(
        (a, b) => getRelated(b.id).length - getRelated(a.id).length
      );
    } else {
      newArr = questions.questions.sort(
        (a, b) => getRelated(a.id).length - getRelated(b.id).length
      );
    }
    setQuestions((prev) => ({ ...prev, questions: [...newArr] }));
  };

  const sortByDateYear = (orderBy) => {
    console.log("sorting by date in : " + orderBy);
    let newArr;
    if (orderBy === "dsc") {
      newArr = questions.questions.sort(
        (a, b) => parseInt(b.year) - parseInt(a.year)
      );
    } else {
      newArr = questions.questions.sort(
        (a, b) => parseInt(a.year) - parseInt(b.year)
      );
    }
    setQuestions((prev) => ({ ...prev, questions: [...newArr] }));
  };

  const deleteHandler = () => {
    setUndo((prev) => [...prev, questions]);
    const newArr = questions.questions.filter(
      (q) => !selectedQuestion.some((sid) => sid.id === q.id)
    );
    setQuestions((prev) => ({ ...prev, questions: newArr }));
    setSelectedQuestion([]);
  };

  const undoDeleteBtnHandler = () => {
    console.log("Undo");
    const newArr = undo[undo.length - 1];
    setUndo((prev) => undo.splice(undo.length - 1, 1));
    setQuestions(newArr);
  };

  const groupBtnHandler = (pid) => {
    const pq = { id: pid };

    const rq = selectedQuestion
      .filter((q) => q.id !== pq.id)
      .map((q) => ({ ...q, parentId: pq.id }));
    // const mrq = rq.map(q => getRelated(q.id)).flat();
    const mrq = questions.related.map((q) => {
      if (rq.some(({ id }) => q.parentId === id)) {
        return {
          ...q,
          parentId: pq.id,
        };
      } else {
        return q;
      }
    });

    console.log(mrq);
    setQuestions((prev) => ({
      questions: prev.questions.filter(
        ({ id }) => !rq.some((q) => q.id === id)
      ),
      related: [...mrq, ...rq],
    }));
  };

  useEffect(() => {
    // console.log(questions);
  }, [questions]);

  // let cacheQuestion = useRef([]);
  // const { contextMenuHandler, contextMenu, setContextMenu } = useContextMenu();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const [editDateHandler] = useEditData();

  const onMouseEnter = (id) => {
    setAnchorEl(null);
    setShowMoreOptions({ show: true, id });
  };
  const onMouseLeave = () => {
    // setShowMoreOptions({ show: false, id: null });
  };

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box
      sx={{
        // width: "80%",
        // m: "auto",
        // mt: 2,
        // mb: 2,
        flex: 1,
        borderRadius: "md",
        border: "1px solid",
        borderColor: "neutral.outlinedBorder",
        boxShadow: "md",
        p: 1,
        pr: 2,
        pl: 2,
        bgcolor: "background.componentBg",
      }}
      onClick={(e) => {
        // setSelectedQuestion([]);
      }}
    >
      {/* <ContextMenuComponent
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
      /> */}
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
            editDateHandler();
            handleClose();
          }}
        >
          <ListItemDecorator>
            <Edit />
          </ListItemDecorator>
          Edit
        </MenuItem>
        {selectedQuestion.length > 1 && (
          <MenuItem
            onClick={(e) => {
              groupBtnHandler(showMoreOptions.id);
              handleClose();
            }}
          >
            <ListItemDecorator />
            Group
          </MenuItem>
        )}
        <ListDivider />
        <MenuItem
          onClick={(e) => {
            deleteHandler();
            handleClose();
          }}
        >
          <ListItemDecorator sx={{ color: "inherit" }}>
            <DeleteForever />
          </ListItemDecorator>
          Delete
        </MenuItem>
      </Menu>
      <div
      // className="question-area-container"
      >
        <div
        // className="question-container"
        >
          {undo.length > 0 && (
            <div>
              <Button onClick={undoDeleteBtnHandler}>Undo Delete</Button>
            </div>
          )}
          <Typography level="h4">QuestionArea</Typography>

          {questions.questions.length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-end",
                  mb: 2,
                  mt: 2,
                }}
              >
                <FormControl>
                  <FormLabel>Sort</FormLabel>
                  <Select
                    size="sm"
                    onChange={(e, value) =>
                      sortSelectChange({ name: "questionSort", value })
                    }
                    value={sort.questionSort}
                    name="questionSort"
                    id="questionSort"
                    sx={{
                      minWidth: 150,
                    }}
                  >
                    <Option value="relatedCount">Related count</Option>
                    <Option value="date">Date year</Option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel
                    id="select-field-demo-orderBy"
                    htmlFor="select-field-orderBy-button"
                  >
                    Order by:
                  </FormLabel>
                  <Select
                    size="sm"
                    onChange={(e, value) =>
                      sortSelectChange({ name: "orderBy", value })
                    }
                    label={"test"}
                    value={sort.orderBy}
                    name="orderBy"
                    id="orderBy"
                    componentsProps={{
                      button: {
                        id: "select-field-orderBy-button",
                        "aria-labelledby":
                          "select-field-orderBy-label select-field-orderBy-button",
                      },
                    }}
                  >
                    <Option value="dsc">dsc</Option>
                    <Option value="asc">asc</Option>
                  </Select>
                </FormControl>
                {/* <Button onClick={sortBtnHandler}>Sort</Button> */}
              </Box>
              <Box mb={2}>
                <Typography level="h6">
                  {`Questions are sorted by '${sort.questionSort}' in '${sort.orderBy}' order.`}
                </Typography>
              </Box>
            </>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {questions.questions &&
              questions.questions.map((q, index, qOArray) => {
                return (
                  <Sheet
                    // onContextMenu={contextMenuHandler}
                    onMouseEnter={() => onMouseEnter(q.id)}
                    onMouseLeave={() => onMouseLeave()}
                    variant={"outlined"}
                    sx={{
                      // p: 2,
                      borderColor:
                        selectedQuestion.some((sq) => sq.id === q.id) &&
                        "neutral.500",
                      bgcolor:
                        selectedQuestion.some((sq) => sq.id === q.id) &&
                        "background.componentBg",
                      boxShadow: "sm",
                      borderRadius: "md",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      pr: 2,
                      pl: 2,
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (
                        selectedQuestion.find((e) => e.id === q.id) !==
                        undefined
                      ) {
                        setSelectedQuestion((prev) =>
                          prev.filter((pq) => pq.id !== q.id)
                        );
                      } else {
                        if (e.ctrlKey) {
                          setSelectedQuestion((prev) => [...prev, q]);
                        } else if (e.shiftKey) {
                          let startingIndex = 0;
                          let endIndex = 0;
                          let deleteCount = 0;

                          const qArr = [...qOArray];

                          if (
                            qArr.indexOf(q) -
                              qArr.indexOf(selectedQuestion[0]) >
                            0
                          ) {
                            startingIndex =
                              qArr.indexOf(
                                selectedQuestion[selectedQuestion.length - 1]
                              ) + 1;
                            endIndex = qArr.indexOf(q);
                            deleteCount = endIndex - startingIndex + 1;
                          } else {
                            endIndex = qArr.indexOf(selectedQuestion[0]);
                            startingIndex = qArr.indexOf(q);
                            deleteCount = endIndex - startingIndex;
                          }

                          const splicedArray = qArr.splice(
                            startingIndex,
                            deleteCount
                          );
                          const concatedArr =
                            splicedArray.concat(selectedQuestion);

                          const uniqueArray = concatedArr.filter(
                            (e, i, arr) => arr.indexOf(e) === i
                          );

                          setSelectedQuestion(uniqueArray);
                        } else {
                          setSelectedQuestion([q]);
                        }
                      }
                    }}
                    className={"question "}
                    key={index}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                        mb={1}
                      >
                        <Chip
                          size="sm"
                          variant="soft"
                          color="neutral"
                        >{`${q.month} ${q.year}`}</Chip>
                        {getRelated(q.id).length ? (
                          <Chip size="sm" variant="outlined" color="neutral">
                            {getRelated(q.id).length + 1}
                          </Chip>
                        ) : (
                          ""
                        )}

                        {getRelated(q.id).map(({ id, month, year }) => (
                          <Chip
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            key={id}
                          >{`${month} ${year}`}</Chip>
                        ))}
                      </Box>

                      <Typography>
                        <Typography>{`${index + 1}. `}</Typography>
                        <Typography>{q.question}</Typography>
                      </Typography>
                    </Box>
                    {showMoreOptions.show &&
                      showMoreOptions.id === q.id &&
                      selectedQuestion.find((e) => e.id === q.id) !==
                        undefined && (
                        <IconButton
                          id="positioned-demo-button"
                          aria-controls={
                            open ? "positioned-demo-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          variant="outlined"
                          color="neutral"
                          onMouseDown={handleClick}
                        >
                          <MoreVert />
                        </IconButton>
                      )}
                  </Sheet>
                );
              })}
          </Box>
        </div>
        <div
        // className="right-container"
        >
          <div
          // className="right-wrapper"
          >
            {/* <QuestionAdder /> */}
            {/* {selectedQuestion && !!selectedQuestion.length && (
    
            )} */}
            {/* {edit.editing && (
              <EditDate
                prevMonth={edit.obj.month}
                prevYear={edit.obj.year}
                editDateSubmitHandler={editDateSubmitHandler}
              />
            )} */}
          </div>
        </div>
      </div>
      {/* <CopyData /> */}
      {/* <SaveQuestions /> */}
      {/* <TagMaker /> */}
      {/* <WordsToIgnore />  */}
    </Box>
  );
}

export default QuestionInterface;
