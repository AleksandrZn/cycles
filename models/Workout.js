const { Schema, model, ObjectId, Decimal128 } = require("mongoose");

const schema = new Schema({
  date: { type: Date, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      weight: { type: Decimal128, required: true },
      workRepit: { type: Number, required: true },
      preRepit: { type: Number, required: true },
      percent: { type: Decimal128, required: true }
    },
  ],
  cycleId: { type: ObjectId, ref: "Cycle" },
},{ capped : true});

module.exports = model("Workout", schema);
