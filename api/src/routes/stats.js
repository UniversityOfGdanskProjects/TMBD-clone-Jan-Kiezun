require("dotenv").config();
const express = require("express");
const router = express.Router();
/*
Most popular movie
Least popular movie
Highest rated movie
Lowest rated movie
Movie with the most ratings
Most popular genre
Least popular genre
*/
const {
  getPopularMovie,
  getUnPopularMovie,
  getHighRatedMovie,
  getLowRatedMovie,
  getMostRatingsMovie,
  getMostPopularGenre,
  getLeastPopularGenre,
} = require("../controllers/stats");

router.get("/mostPopularMovie", async (req, res) => {
  try {
    const movie = await getPopularMovie();
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/leastPopularMovie", async (req, res) => {
  try {
    const movie = await getUnPopularMovie();
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
router.get("/highRatedMovie", async (req, res) => {
  try {
    const movie = await getHighRatedMovie();
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
router.get("/lowRatedMovie", async (req, res) => {
  try {
    const movie = await getLowRatedMovie();
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
router.get("/mostRatingsMovie", async (req, res) => {
  try {
    const movie = await getMostRatingsMovie();
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
router.get("/mostPopularGenre", async (req, res) => {
  try {
    const movie = await getMostPopularGenre();
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
router.get("/leastPopularGenre", async (req, res) => {
  try {
    const movie = await getLeastPopularGenre();
    res.send(movie);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
