require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/movies", require("./src/routes/movies"));
app.use("/users", require("./src/routes/users"));

app.listen(process.env.PORT, () => {
  console.log("Server started on port " + PORT);
});
