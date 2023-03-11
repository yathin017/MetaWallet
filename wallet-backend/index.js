const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();

mongoose.connect(process.env.mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("mongoDB connected"));

app.use(express.json());
const users = require("./routes/users");

app.use("/users", users);

app.listen(3001, () => console.log("Server Started"));
