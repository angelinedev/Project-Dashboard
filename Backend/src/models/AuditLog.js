import mongoose from "mongoose";

import { TASK_STATUS_OPTIONS } from "../constants/task.js";

const auditLogSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    actor: {
      type: String,
      default: "system",
      trim: true,
    },
    fromStatus: {
      type: String,
      enum: TASK_STATUS_OPTIONS,
      default: null,
    },
    toStatus: {
      type: String,
      enum: TASK_STATUS_OPTIONS,
      default: null,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
