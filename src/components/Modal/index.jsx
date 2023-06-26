"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styles from "./Modal.module.css";
import { Button } from "@mui/material";
import ReactDatePicker from "react-datepicker";
import { useSession } from "next-auth/react";
import "react-datepicker/dist/react-datepicker.css";

export default function BasicModal({
  id,
  mutate,
  openModal,
  setOpenModal,
  heading,
  taskContent,
  handlePopClose
}) {
  const session = useSession();
  const [task, setTask] = useState(taskContent);

  const handleChange = (e) => {
    if (e && e.target) {
      setTask({ ...task, [e.target.name]: e.target.value });
    } else {
      setTask({ ...task, dueDate: e });
    }
  };

  const handleSubmit = async () => {
    try {
      await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ ...task, username: session.data.user.email }),
      });
      setTask({});
      setOpenModal(false);
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditTask = async () => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title: task.title, desc: task.desc, dueDate: task.dueDate }),
      });
      setOpenModal(false);
      handlePopClose();
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className={styles.box}>
          <div className={styles.form}>
            <div className={styles.heading}>{heading}</div>
            <hr />
            <input
              type="text"
              name="title"
              placeholder="Enter Task Title"
              value={task?.title}
              onChange={handleChange}
              className={styles.inputs}
            />
            <textarea
              cols="30"
              rows="3"
              name="desc"
              placeholder="Enter Task Description"
              value={task?.desc}
              onChange={handleChange}
              className={styles.inputs}
            />
            <ReactDatePicker
              name="dueDate"
              placeholderText={"Please select a date"}
              showIcon
              dateFormat="dd-MM-yyyy"
              selected={task?.dueDate && new Date(task?.dueDate)}
              minDate={
                (task?.dueDate && new Date(task?.dueDate)) || new Date()
              }
              onChange={handleChange}
              className={styles.datePicker}
              wrapperClassName={styles.datePickerWrapper}
            />
            <Button
              disabled={
                !(task?.title && task?.desc && task?.dueDate) ||
                JSON.stringify(taskContent) === JSON.stringify(task)
              }
              variant="contained"
              onClick={heading === "Add Task"? handleSubmit: handleEditTask}
              sx={{
                marginTop: "1.5rem",
                padding: "0.8rem",
                fontSize: "1.2rem",
                backgroundColor: "#53c28b",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(83, 194, 139, 0.8)",
                },
                "&:disabled": {
                  backgroundColor: "rgba(83, 194, 139, 0.3)",
                  color: "gray",
                },
              }}
              className={styles.button}
            >
              {heading}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
