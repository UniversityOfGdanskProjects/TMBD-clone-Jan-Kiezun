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
const getAllMovies = () => {
  session
    .run("MATCH (movie:Movie) RETURN movie LIMIT 25")
    .then((result) => {
      const movies = result.records.map((record) => {
        return {
          id: record._fields[0].identity.low,
          title: record._fields[0].properties.title,
          tagline: record._fields[0].properties.tagline,
          released: record._fields[0].properties.release_date,
        };
      });
      console.log(movies);
      return movies;
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  getAllMovies,
};
