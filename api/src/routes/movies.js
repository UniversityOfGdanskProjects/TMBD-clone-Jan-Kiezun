require("dotenv").config();
const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovie,
  searchMovies,
  getPopularMovies,
  addMovie,
  addComment,
  getComments,
  setRating,
  getRatings,
} = require("../controllers/movies");
const API_KEY = process.env.API_KEY;
const axios = require("axios");

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const movies = await getAllMovies(page);
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const movie = await getMovie(id);
  res.send(movie);
});

router.get("/search", async (req, res) => {
  const query = req.query.q || "";
  const page = parseInt(req.query.page) || 1;
  const genre = req.query.genre || "";
  const sort_field = req.query.sort || "";

  const asc = (sort_field && req.query.asc) || "ASC";
  const movies = await searchMovies(query, page, genre, sort_field, asc);
  res.send(movies);
});

router.get("/popular", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const movies = await getPopularMovies(page);
  res.send(movies);
});

router.post("/add", async (req, res) => {
  const movie = req.body;
  const result = await addMovie(movie);
  res.send({ message: "Movie added", result });
});

router.post("/comments/add", async (req, res) => {
  const comment = req.body;
  const result = await addComment(comment);
  res.send({ message: "Comment added", result });
});

router.get("/comments/:id", async (req, res) => {
  const id = req.params.id;
  const comments = await getComments(id);
  res.send(comments);
});

router.put("/ratings/set", async (req, res) => {
  const rating = req.body;
  const result = await setRating(rating);
  res.send({ result });
});

router.get("/ratings/:id", async (req, res) => {
  const id = req.params.id;
  const ratings = await getRatings(id);
  res.send(ratings);
});

module.exports = router;
