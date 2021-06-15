const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/menu", require("./routes/menu.routes"));
app.use("/api/constructor", require("./routes/constructor.routes"));
app.use("/api/workout", require("./routes/workout.routes"));

const PORT = config.get("port");

async function start() {
  try {
    await mongoose.connect(config.get("databaseURL"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.log("Server Error", e.massage);
    process.exit(1);
  }
}

app.listen(PORT, () =>
  console.log(`Server has been started on port ${PORT}...`)
);

start();
