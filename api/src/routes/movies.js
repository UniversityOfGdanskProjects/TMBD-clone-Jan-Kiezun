const express = require("express");
const router = express.Router();
const { getAllMovies } = require("../controllers/movies");

router.get("/", async (req, res) => {
  const movies = await getAllMovies();
  res.send(movies);
});

module.exports = router;
