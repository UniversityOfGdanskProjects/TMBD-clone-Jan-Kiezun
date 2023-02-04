const express = require("express");
const router = express.Router();
const { getAllMovies, searchMovies } = require("../controllers/movies");

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const movies = await getAllMovies(page);
  res.send(movies);
});

router.get("/search", async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const movies = await searchMovies(query, page);
  res.send(movies);
});

module.exports = router;
