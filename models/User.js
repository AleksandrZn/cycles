const { Schema, model, ObjectId } = require("mongoose");

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: String, required: true },
  archiveId: { type: ObjectId, ref: "Archive" },
  cycleId: { type: ObjectId, ref: "Cycle" },
  nutritionId: { type: ObjectId, ref: "Nutrition" },
});

module.exports = model("User", schema);
