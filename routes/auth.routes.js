const { Router } = require("express");
const User = require("../models/User");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = Router();
const emailValidator = require("deep-email-validator");
const jwt_reset = require("jwt-simple");
const ObjectId = require("mongodb").ObjectID;

// /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { valid, reason, validators } = await emailValidator.validate(email);
    if (!valid) {
      res.status(400).json({
        message: "Пожалуйста, предоставьте действующий адрес электронной почты",
        reason: validators[reason].reason,
      });
    } else {
      const candidate = await User.findOne({ email });
      if (candidate) {
        res.status(400).json({ message: "Вы уже зарегестрированы" });
      }
      const passwordHash = await bcrypt.hash(password, 14);
      const user = new User({
        email,
        password: passwordHash,
        date: Date.now(),
      });
      await user.save();
      res.status(201).json({ message: "Вы успешно зарегестрированы" });
    }
  } catch (e) {
    res.status(500).json({ message: "Error registration" });
  }
});

// /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Неверный пароль, попробуйте снова" });
    }

    const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
      expiresIn: "3h",
    });
    res.json({ token, userId: user.id });
  } catch (e) {
    res.status(500).json({ message: "Ошибка авторизации попробуйте позже" });
  }
});

// /api/auth/reset
router.post("/reset", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const { valid, reason, validators } = await emailValidator.validate(email);
    if (!valid) {
      res.status(400).json({
        message: "Адрес электронной почты не действитилен",
        reason: validators[reason].reason,
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
    };

    const nodemailer = require("nodemailer");

    const secret = user.password + "-" + user.date;
    const token = jwt_reset.encode(payload, secret);

    async function main() {
      let transporter = nodemailer.createTransport(
        {
          host: "smtp.mail.ru",
          port: 465,
          secure: true,
          auth: {
            user: "cycles.trainings@bk.ru",
            pass: "Nodemailer",
          },
        },
        {
          from: '"Cycles" <cycles.trainings@bk.ru>',
        }
      );

      let info = await transporter.sendMail({
        from: '"Cycles" <cycles.trainings@bk.ru>',
        to: email,
        subject: "Cycles Teams",
        html:
          '<a href="http://localhost:3000/resetpassword/' +
          payload.id +
          "/" +
          token +
          '">Reset password</a>',
      });
    }

    main().catch(console.error);

    res.status(200).json({
      message: "Письмо выслано на ваш почтовый адресс",
    });
  } catch (e) {
    res.status(500).json({ message: "Ошибка отправления" });
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
    const { id, token, password } = req.body;

    const user = await User.findById(ObjectId(id));

    if (!user) {
      return res.status(400).json({ message: "Неверная ссылка" });
    }
    const secret = user.password + "-" + user.date;
    const payload = jwt_reset.decode(token, secret);
    if (user.email == payload.email) {
      const passwordHash = await bcrypt.hash(password, 14);
      await User.updateOne(
        { _id: ObjectId(id) },
        { $set: { password: passwordHash, date: Date.now() } }
      );
      return res.status(200).json({ message: "Пароль сброшен" });
    } else {
      return res.status(400).json({ message: "Неверная ссылка" });
    }
  } catch (e) {
    res.status(500).json({ message: "Ошибка сброса" });
  }
});
module.exports = router;
