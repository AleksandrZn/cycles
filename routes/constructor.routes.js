const { Router } = require("express");
const Cycle = require("../models/Cycle");
const Workout = require("../models/Workout");
const router = Router();
const authMiddleware = require("../middleware/auth.middleware");
const ObjectId = require("mongodb").ObjectID;
const validUrl = require("valid-url");

// /api/constructor/create
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const cycle = new Cycle({
      type: req.body.type,
      start: req.body.start,
      end: req.body.end,
      active: req.body.active,
      userId: ObjectId(req.user.userId),
      workouts: [],
    });
    await cycle.save();
    const cycleId = await Cycle.findOne({
      userId: ObjectId(req.user.userId),
      active: true
    });
    let workouts = req.body.workouts;
    let exercises = req.body.exercises;
    let dataExercises = [];
    exercises.map((item) => {
      item.percent = [
        item.percent,
        (105 - item.percent) / (req.body.duration - 1),
      ];
    });
    for (
      let index = 0,
        days = [1, 2, 3, 4, 5, 6, 0],
        duration = req.body.duration,
        date = new Date(req.body.start),
        k = 0;
      index < duration;
      index++
    ) {
      while (k < 7) {
        workouts.map(async (item) => {
          if (date.getDay() === days[item[0]]) {
            dataExercises = [];
            item[1].map((elem) => {
              dataExercises = [
                ...dataExercises,
                {
                  name: exercises[elem.id].exercise,
                  weight: exercises[elem.id].weight,
                  workRepit: elem.inputRepit,
                  preRepit: exercises[elem.id].preRepit,
                  percent:
                    exercises[elem.id].percent[0] +
                    exercises[elem.id].percent[1] * index,
                },
              ];
            });
            let bufDate = new Date(date);
            const workout = new Workout({
              date: bufDate,
              exercises: dataExercises,
              cycleId: cycleId,
            });

            await workout.save();
            const work = await Workout.findOne({ date: bufDate });
            await Cycle.updateOne(
              { active: true },
              { $push: { workouts: work._id } }
            );
          }
        });
        k++;
        if (k !== 0) date = new Date(date.setDate(date.getDate() + 1));
        if (k === 7) {
          k = 0;
          break;
        }
      }
    }
    if (cycle) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(400).json({ message: "Ошибка" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

// /api/constructor/createExcel
router.post("/createExcel", authMiddleware, async (req, res) => {
  try {
    if (!validUrl.isUri(req.body.link))
      return res.status(400).json({ message: "Ссылка не действительна" });
    const cycle = new Cycle({
      type: "Тренировки в Excel",
      start: req.body.date,
      active: true,
      userId: ObjectId(req.user.userId),
      link: req.body.link,
      cycleName: req.body.name,
    });

    await cycle.save();
    if (cycle) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(400).json({ message: "Ошибка" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

module.exports = router;
