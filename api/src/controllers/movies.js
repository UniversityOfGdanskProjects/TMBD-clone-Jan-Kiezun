require("dotenv").config();
const express = require("express");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const session = driver.session();
//
// GET /movies
//
const getAllMovies = async (page) => {
  const result = await session.run(
    `MATCH (movie:Movie) RETURN movie ${
      page > 1 ? `SKIP ${(page - 1) * 20}` : ""
    } LIMIT 20`
  );
  const movies = result.records.map((record) => {
    return {
      id: record._fields[0].properties.id,
      tmdbId: record._fields[0].properties.tmdbId,
      title: record._fields[0].properties.title,
      tagline: record._fields[0].properties.tagline,
      released: record._fields[0].properties.release_date,
    };
  });
  return { page: page, movies };
};

const searchMovies = async (query, page) => {
  const result = await session.run(
    `MATCH (movie:Movie) WHERE toLower(movie.title) CONTAINS toLower($query) RETURN movie ${
      page > 1 ? `SKIP ${(page - 1) * 20}` : ""
    } LIMIT 20`,
    { query: query }
  );
  const movies = result.records.map((record) => {
    return {
      id: record._fields[0].properties.id,
      tmdbId: record._fields[0].properties.tmdbId,
      title: record._fields[0].properties.title,
      tagline: record._fields[0].properties.tagline,
      released: record._fields[0].properties.release_date,
    };
  });
  return { page: page, movies };
};

module.exports = {
  getAllMovies,
  searchMovies,
};
