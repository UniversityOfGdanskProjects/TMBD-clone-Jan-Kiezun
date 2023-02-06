require("dotenv").config();
const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovie,
  searchMovies,
  getPopularMovies,
  addMovie,
  updateMovie,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  setRating,
  getRatings,
  getGenres,
} = require("../controllers/movies");
const API_KEY = process.env.API_KEY;
const axios = require("axios");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await getAllMovies(page);
    res.send(movies);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/popular", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    console.log("page: ", page);
    const movies = await getPopularMovies(page);
    res.send(movies);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const genres = req.query.genres || "";
    const sort_field = req.query.sort || "";

    console.log(genres);

    const genre = genres
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    const order = (sort_field && req.query.order) || "ASC";
    const movies = await searchMovies(query, page, genre, sort_field, order);
    res.send(movies);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/genres", async (req, res) => {
  try {
    const genres = await getGenres();
    res.send(genres);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const movie = getMovie(id);
    const genres = getGenres(id);
    Promise.all([movie, genres]).then((values) => {
      const [movie, genres] = values;
      movie.genres = genres;
      res.send(movie);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//
//MOVIE CRUD
//
router.post("/add", async (req, res) => {
  try {
    const movie = req.body;
    const result = await addMovie(movie);
    res.send({ message: "Movie added", result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.patch("/:movie_id", async (req, res) => {
  try {
    const movie_id = req.params.movie_id;
    const movie = req.body;
    const result = await updateMovie(movie_id, movie);
    res.send({ message: "Movie updated", result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
//
//COMMENTS CRUD
//
router.post("/comments/add", async (req, res) => {
  try {
    const comment = req.body;
    const result = await addComment(comment);
    res.send({ message: "Comment added", result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/comments/:movieId", async (req, res) => {
  try {
    const id = req.params.movieId;
    const comments = await getComments(id);
    res.send(comments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.patch("/comments/edit", async (req, res) => {
  try {
    const comment = req.body;
    const result = await updateComment(comment);
    res.send({ message: "Comment updated", result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.delete("/comments/delete/:comment_id/:movie_id", async (req, res) => {
  try {
    const comment = {
      comment_id: req.params.comment_id,
      movie_id: req.params.movie_id,
    };
    const result = await deleteComment(comment);
    res.send({ message: "Comment deleted", result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
//
//RATINGS CRUD
//
router.put("/ratings/set", async (req, res) => {
  try {
    const rating = req.body;
    const result = await setRating(rating);
    res.send({ result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/ratings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const ratings = await getRatings(id);
    console.log(ratings);
    res.send(ratings);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
