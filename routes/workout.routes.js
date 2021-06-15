const { Router } = require("express");
const Cycle = require("../models/Cycle");
const Workout = require("../models/Workout");
const router = Router();
const authMiddleware = require("../middleware/auth.middleware");
const ObjectId = require("mongodb").ObjectID;
const validUrl = require("valid-url");

function byField(field) {
  return (a, b) => (new Date(a[field]) > new Date(b[field]) ? 1 : -1);
}

// /api/workout/get
router.post("/get", authMiddleware, async (req, res) => {
  try {
    const cycle = await Cycle.findOne({
      userId: ObjectId(req.user.userId),
      active: true,
    });
    if (cycle.link === "") {
      const workout = await Workout.find({
        cycleId: ObjectId(cycle._id),
      });
      workout.sort(byField("date"));
      let date = req.body.date.split(".");
      date = date[2] + "-" + date[1] + "-" + date[0];
      if (workout !== []) {
        for (let index = 0; index < workout.length; index++) {
          let workoutDate = workout[index].date.toLocaleDateString().split(".");
          workoutDate =
            workoutDate[2] + "-" + workoutDate[1] + "-" + workoutDate[0];

          if (Date.parse(workoutDate) === Date.parse(date)) {
            return res
              .status(200)
              .json({ ok: 1, data: workout[index], name: cycle.type, type: 1 });
          } else if (Date.parse(workoutDate) > Date.parse(date)) {
            return res
              .status(200)
              .json({ ok: 2, data: workout[index], name: cycle.type, type: 1 });
          }
          if (workout.length === index + 1) {
            await Cycle.updateOne(
              { active: true },
              { $set: { active: false } }
            );

            return res.status(200).json({ ok: 3 });
          }
        }
      } else {
        return res.status(400).json({ message: "Ошибка" });
      }
    } else {
      return res.status(200).json({ link: cycle.link, name: cycle.cycleName });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

router.post("/access", authMiddleware, async (req, res) => {
  try {
    let date = req.body.date.split(".");
    date = date[2] + "-" + date[1] + "-" + date[0];
    const cycle = await Cycle.findOne({
      userId: ObjectId(req.user.userId),
      active: true,
    });
    if (cycle.link !== "") {
      await Cycle.updateOne(
        { active: true, userId: ObjectId(req.user.userId) },
        { $set: { active: false, end: date } }
      );
      return res.status(200).json({ ok: true });
    }
    const workout = await Workout.find({
      cycleId: ObjectId(cycle._id),
    });
    workout.sort(byField("date"));

    if (workout !== []) {
      for (let index = 0; index < workout.length; index++) {
        let workoutDate = workout[index].date.toLocaleDateString().split(".");
        workoutDate =
          workoutDate[2] + "-" + workoutDate[1] + "-" + workoutDate[0];
        if (Date.parse(workoutDate) > Date.parse(date)) {
          await Workout.deleteOne({
            _id: ObjectId(workout[index]._id),
          });
        }
        if (workout.length === index + 1) {
          await Cycle.updateOne(
            { active: true, userId: ObjectId(req.user.userId) },
            { $set: { active: false, end: date } }
          );
          return res.status(200).json({ ok: true });
        }
      }
    } else {
      return res.status(400).json({ message: "Ошибка" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

router.post("/delete", authMiddleware, async (req, res) => {
  try {
    const cycle = await Cycle.findOne({
      userId: ObjectId(req.user.userId),
      active: true,
    });
    const workout = await Workout.find({
      cycleId: ObjectId(cycle._id),
    });
    if (workout !== []) {
      for (let index = 0; index < workout.length; index++) {
        await Workout.deleteOne({ _id: ObjectId(workout[index]._id) });
      }
      await Cycle.deleteOne({ _id: ObjectId(cycle._id) });
      return res.status(200).json({ ok: true });
    } else {
      return res.status(400).json({ message: "Ошибка" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

router.post("/refreshLink", authMiddleware, async (req, res) => {
  try {
    if (!validUrl.isUri(req.body.link))
      return res.status(400).json({ message: "Ссылка не действительна" });
    const cycle = await Cycle.findOne({
      userId: ObjectId(req.user.userId),
      active: true,
    });
    if (cycle !== []) {
      await Cycle.updateOne(
        { active: true, userId: ObjectId(req.user.userId) },
        { $set: { link: req.body.link } }
      );
      return res.status(200).json({ ok: true });
    } else {
      return res.status(400).json({ message: "Ошибка" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

module.exports = router;
