import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["leader", "member"],
      default: "member",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    toJSON: {
      transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
      },
    },
  },
);

teamMemberSchema.index({ team: 1, user: 1 }, { unique: true });

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
