import mongoose from "mongoose";

import {
  TASK_PRIORITY,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS,
  TASK_STATUS_OPTIONS,
} from "../constants/task.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: TASK_STATUS_OPTIONS,
      default: TASK_STATUS.TODO,
      index: true,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY_OPTIONS,
      default: TASK_PRIORITY.MEDIUM,
      index: true,
    },
    assignee: {
      type: String,
      default: "",
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Task = mongoose.model("Task", taskSchema);
