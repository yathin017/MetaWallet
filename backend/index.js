const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors')
const app = express();
require("dotenv").config();
const PORT = 3001

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

app.listen(PORT, () => console.log("Server Started"));

// Backend hosted on Cyclic: https://lazy-red-spider-wrap.cyclic.app/