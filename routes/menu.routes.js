const { Router } = require("express");
const Cycle = require("../models/Cycle");
const Nutrition = require("../models/Nutrition");
const Archive = require("../models/Archive");
const router = Router();
const authMiddleware = require("../middleware/auth.middleware");
const ObjectId = require("mongodb").ObjectID;

// /api/menu/constructor
router.post("/constructor", authMiddleware, async (req, res) => {
  try {
    const cycleRes = await Cycle.find({
      userId: ObjectId(req.user.userId),
      active: true,
    });
    if (cycleRes.length === 0) {
      return res.status(200).json({ ok: true });
    } else {
      return res
        .status(400)
        .json({ message: "У вас есть активные тренировки" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

// /api/menu/archive
router.post("/archive", authMiddleware, async (req, res) => {
  try {
    const archiveRes = await Archive.find({
      userId: ObjectId(req.user.userId),
    });
    if (archiveRes.length !== 0) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(400).json({ message: "В разработке" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

// /api/menu/workout
router.post("/workout", authMiddleware, async (req, res) => {
  try {
    const cycleRes = await Cycle.find({
      userId: ObjectId(req.user.userId),
      active: true,
    });
    if (cycleRes.length !== 0) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(400).json({ message: "Вы еще не создали тренировку" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

// /api/menu/nutrition
router.post("/nutrition", authMiddleware, async (req, res) => {
  try {
    const nutritionRes = await Nutrition.find({
      userId: ObjectId(req.user.userId),
      active: true,
    });
    if (nutritionRes.length !== 0) {
      return res.status(200).json({ ok: true });
    } else {
      return res
        .status(400)
        .json({ message: "В разработке" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Error database" });
  }
});

module.exports = router;
