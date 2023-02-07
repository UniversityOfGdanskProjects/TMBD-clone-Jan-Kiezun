require("dotenv").config();
const express = require("express");
const router = express.Router();
const {
  getPopularMovie,
  getUnPopularMovie,
  getHighRatedMovie,
  getLowRatedMovie,
  getMostRatingsMovie,
  getMostPopularGenre,
  getLeastPopularGenre,
} = require("../controllers/stats");

router.get("/getStats", async (req, res) => {
  try {
    const [
      popularMovie,
      unPopularMovie,
      highRatedMovie,
      lowRatedMovie,
      mostRatingsMovie,
      mostPopularGenre,
      leastPopularGenre,
    ] = await Promise.all([
      getPopularMovie(),
      getUnPopularMovie(),
      getHighRatedMovie(),
      getLowRatedMovie(),
      getMostRatingsMovie(),
      getMostPopularGenre(),
      getLeastPopularGenre(),
    ]);
    res.send({
      popularMovie,
      unPopularMovie,
      highRatedMovie,
      lowRatedMovie,
      mostRatingsMovie,
      mostPopularGenre,
      leastPopularGenre,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
