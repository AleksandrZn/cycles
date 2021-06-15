const { Schema, model, ObjectId } = require("mongoose");

const schema = new Schema(
  {
    cycleId: [{ type: ObjectId, ref: "Cycle" }],
    nutritionId: [{ type: ObjectId, ref: "Nutrition" }],
    userId: { type: ObjectId, ref: "User" },
  },
  { capped: true }
);

module.exports = model("Archive", schema);
