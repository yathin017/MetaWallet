const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors')
const app = express();
require("dotenv").config();

app.use(cors())
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("mongoDB connected"));

app.use(express.json());
const users = require("./routes/users");

app.use("/", users);

app.listen(3001, () => console.log("Server Started"));
