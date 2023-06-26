"use client";

import { useState, useEffect } from "react";
import styles from "./Card.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Popover, Tooltip } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BasicModal from "../Modal";

const Card = ({ id, title, desc, dueDate, status, mutate }) => {
  const [openModal, setOpenModal] = useState(false);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskColors, setTaskColors] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  
  let taskDate = new Date(dueDate)
  dueDate = taskDate.toISOString().substring(0, 10);
  
  useEffect(() => {
    if (status === "completed") {
      setTaskStatus("Completed");
      setTaskColors({ status: "#004c00", card: "#99ff99" });
    } else if (status === "progress") {
      setTaskStatus("In Progress");
      setTaskColors({ status: "#c0a300", card: "#ffff99" });
    } else if (status === "pending") {
      setTaskStatus("Pending");
      setTaskColors({ status: "#660000", card: "#ff9999" });
    }
  }, [status]);

  const handleDelete = async () => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const markComplete = async () => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
      });
      handlePopClose();
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popId = open ? "simple-popover" : undefined;


  return (
    <div className={styles.card}>
      <div
        className={styles.taskStatus}
        style={{ backgroundColor: `${taskColors.status}` }}
      >
        <div>{taskStatus}</div>
        <IconButton
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
        >
          <MoreVertIcon className="text-white" />
        </IconButton>
        <Popover
          id={popId}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          sx={{ marginTop: "2.2em", marginLeft: "0.8em" }}
        >
          <div className={styles.popOver}>
            <Tooltip title="Completed" arrow placement="top">
              <IconButton onClick={markComplete}>
                <DoneIcon sx={{ color: "blue" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit" arrow placement="top">
              <IconButton onClick={() => setOpenModal(true)}>
                <EditIcon sx={{ color: "gray" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow placement="top">
              <IconButton onClick={handleDelete}>
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          </div>
        </Popover>
      </div>
      <div
        className={styles.contentBackground}
        style={{ backgroundColor: `${taskColors.card}` }}
      >
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <hr />
          <div className={styles.description}>{desc}</div>
          <hr />
          <div className={styles.dueDate}>
            Due date: {dueDate.split("-").reverse().join("-")}
          </div>
        </div>
      </div>
      <div className="moreOptions"></div>

        <BasicModal
          id={id}
          mutate={mutate}
          openModal={openModal}
          setOpenModal={setOpenModal}
          heading="Edit Task"
          taskContent={{ title, desc, dueDate }}
          handlePopClose={handlePopClose}
        />
    </div>
  );
};

export default Card;
