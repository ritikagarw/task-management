import { Schema, model, models } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'progress',
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = models.Task || model('Task', taskSchema);

export default Task;
