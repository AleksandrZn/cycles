const { Schema, model, ObjectId } = require("mongoose");

const schema = new Schema(
  {
    type: { type: String, default: true },
    start: { type: Date, required: true },
    end: { type: Date },
    active: { type: Boolean, required: true },
    userId: { type: ObjectId, ref: "User" },
    workouts: [{ type: ObjectId, ref: "Workout" }],
    link: { type: String, default: "" },
    cycleName: { type: String, default: "" },
  },
  { capped: true }
);

module.exports = model("Cycle", schema);
