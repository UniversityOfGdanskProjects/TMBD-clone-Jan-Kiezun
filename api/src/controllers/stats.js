require("dotenv").config();
const express = require("express");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
  { disableLosslessIntegers: true }
);

//getPopularMovie
//getUnPopularMovie
//getHighRatedMovie
//getLowRatedMovie
//getMostRatingsMovie
//getMostPopularGenre
//getLeastPopularGenre

const getPopularMovie = async () => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (m:Movie) RETURN m ORDER BY toFloat(m.popularity) DESC LIMIT 1`
  );
  const movie = result.records[0]._fields[0].properties;
  return { movie, popularity: movie.popularity };
};

const getUnPopularMovie = async () => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (m:Movie) RETURN m ORDER BY toFloat(m.popularity) ASC LIMIT 1`
  );
  const movie = result.records[0]._fields[0].properties;
  return { movie, popularity: movie.popularity };
};

const getHighRatedMovie = async () => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:User)-[r:RATED]->(m:Movie) RETURN m, AVG(toFloat(r.rating)) as average ORDER BY average DESC LIMIT 1`
  );
  const movie = result.records[0]._fields[0].properties;
  const average = result.records[0]._fields[1];
  return { movie, average };
};

const getLowRatedMovie = async () => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (u:User)-[r:RATED]->(m:Movie) RETURN m, AVG(toFloat(r.rating)) as average ORDER BY average ASC LIMIT 1`
  );
  const movie = result.records[0]._fields[0].properties;
  const average = result.records[0]._fields[1];
  return { movie, average };
};

const getMostRatingsMovie = async () => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (m:Movie) WITH apoc.node.degree.in(m, 'RATED') AS output, m RETURN m, output ORDER BY output DESC LIMIT 1`
  );
  const movie = result.records[0]._fields[0].properties;
  const output = result.records[0]._fields[1];
  console.log(result.records[0]._fields[1]);
  return { movie, howMany: output };
};

const getMostPopularGenre = async () => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (g:Genre) WITH apoc.node.degree.in(g, 'GENRE') AS output, g RETURN g, output ORDER BY output DESC LIMIT 1`
  );
  const genre = result.records[0]._fields[0].properties;
  const output = result.records[0]._fields[1];
  return { genre, howMany: output };
};

const getLeastPopularGenre = async () => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (g:Genre) WITH apoc.node.degree.in(g, 'GENRE') AS output, g RETURN g, output ORDER BY output ASC LIMIT 1`
  );
  const genre = result.records[0]._fields[0].properties;
  const output = result.records[0]._fields[1];
  return { genre, howMany: output };
};

const session = driver.session();

module.exports = {
  getPopularMovie,
  getUnPopularMovie,
  getHighRatedMovie,
  getLowRatedMovie,
  getMostRatingsMovie,
  getMostPopularGenre,
  getLeastPopularGenre,
};
