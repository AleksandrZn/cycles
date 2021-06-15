const { Schema, model, ObjectId, Decimal128 } = require("mongoose");

const schema = new Schema(
  {
    type: { type: String, default: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    active: { type: Boolean, required: true },
    mass: { type: Decimal128, required: true },
    energy: { type: Number, required: true },
    coefficient: { type: Decimal128, required: true },
    food: [
      {
        date: { type: Date, required: true },
        values: [
          {
            protein: { type: Decimal128, required: true },
            fat: { type: Decimal128, required: true },
            carb: { type: Decimal128, required: true },
            description: { type: String, default: "" },
          },
        ],
      },
    ],
    userId: { type: ObjectId, ref: "User" },
    arhiveId: { type: ObjectId, ref: "Archive" },
  },
  { capped: true }
);

module.exports = model("Nutrition", schema);
