/* eslint-disable no-unused-vars */
import { Button, Option, Select, TextField, FormLabel, Stack } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import React, { useState } from "react";
import { useStateContext } from "../context/stateContext";
import ModalFooter from "./ModalFooter";
import ModalTitle from "./ModalTitle";

const editInit = {
  editing: false,
  parentId: [],
  relatedId: [],
};

export function useEditData() {
  const { questions, setQuestions, selectedQuestion, setModal, edit, setEdit } =
    useStateContext();

  const submitHandler = (obj) => {
    let newArr;

    if (edit.relatedId) {
      newArr = questions.related.map((r) => {
        if (r.id === edit.relatedId) {
          return {
            ...r,
            question: obj.question,
            month: obj.month,
            year: obj.year,
          };
        } else {
          return r;
        }
      });

      setQuestions((prev) => ({ ...prev, related: newArr }));
    } else {
      newArr = questions.questions.map((q) => {
        if (edit.parentId.some((p) => q.id === p)) {
          return {
            ...q,
            question: obj.question,
            month: obj.month,
            year: obj.year,
          };
        } else {
          return q;
        }
      });
      setQuestions((prev) => ({ ...prev, questions: newArr }));
    }
    setModal({ open: false, type: null });
    setEdit(editInit);
  };
  const dataHandler = (relatedId) => {
    selectedQuestion.forEach(({ id }) => {
      let obj = questions.questions.find((q) => q.id === id);
      if (relatedId) {
        obj = questions.related.find((q) => q.id === relatedId);
      }
      setEdit((prev) => ({
        ...prev,
        editing: true,
        parentId: [...prev.parentId, id],
        relatedId: relatedId || null,
        obj,
      }));
    });

    setModal({ open: true, type: "edit" });
  };
  return [dataHandler, submitHandler];
}

function EditDate() {
  const { edit } = useStateContext();
  const [_, editDateSubmitHandler] = useEditData();
  const [Input, setMonthInput] = useState({
    month: edit?.obj?.month || "Jan",
    year: edit?.obj?.year || "22",
    question: edit?.obj?.question || "",
  });
  function monthInputHandler(value, name) {
    setMonthInput((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <ModalTitle text="Edit" />

      <Stack gap={2} direction="column">
        <FormControl>
          <TextField
            sx={{
              minWidth: 500,
            }}
            label="Question"
            placeholder="type"
            onChange={(e) => monthInputHandler(e.target.value, "question")}
            value={Input.question}
            type="text"
          />
        </FormControl>
        <Stack gap={2} direction="row">
          <FormControl
            sx={{
              flex: 1,
            }}
          >
            <FormLabel htmlFor="month">Month:</FormLabel>
            <Select
              value={Input.month}
              onChange={(e, value) => monthInputHandler(value, "month")}
              id="month"
              name="month"
            >
              <Option value="Jan">Jan</Option>
              <Option value="Feb">Feb</Option>
              <Option value="Mar">Mar</Option>
              <Option value="Apr">Apr</Option>
              <Option value="May">May</Option>
              <Option value="Jun">Jun</Option>
              <Option value="Jul">Jul</Option>
              <Option value="Aug">Aug</Option>
              <Option value="Sep">Sep</Option>
              <Option value="Oct">Oct</Option>
              <Option value="Nov">Nov</Option>
              <Option value="Dec">Dec</Option>
            </Select>
          </FormControl>
          <FormControl
            sx={{
              flex: 1,
            }}
          >
            <FormLabel htmlFor="year">Year:</FormLabel>
            <Select
              value={Input.year}
              onChange={(e, value) => monthInputHandler(value, "year")}
              id="year"
              name="year"
            >
              <Option value="22">22</Option>
              <Option value="21">21</Option>
              <Option value="20">20</Option>
              <Option value="19">19</Option>
              <Option value="18">18</Option>
              <Option value="17">17</Option>
              <Option value="16">16</Option>
              <Option value="15">15</Option>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <ModalFooter>
        <Button
          variant="soft"
          onClick={() => {
            editDateSubmitHandler(Input);
          }}
        >
          Submit
        </Button>
      </ModalFooter>
    </>
  );
}

export default EditDate;
