require("dotenv").config();
const express = require("express");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const getAllMovies = async (page) => {
  const session = driver.session();
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
  const total = await session.run(`MATCH (movie:Movie) RETURN count(movie)`);
  const maxPages = Math.ceil(total.records[0]._fields[0].low / 20);
  return { maxPages, page, movies };
};

const getMovie = async (id) => {
  const session = driver.session();
  const result = await session.run(
    `match (u:User)-[r:RATED]->(m:Movie {id: $id}) return u,r,m`,
    { id: id }
  );
  const ratings = result.records.map((record) => {
    return {
      user_id: record._fields[0].properties.id,
      rating: record._fields[1].properties.rating,
      timestamp: record._fields[1].properties.timestamp,
    };
  });
  // console.log(result.records[0]._fields[2]);
  const movie = {
    ...result.records[0]._fields[2].properties,
    genres: result.records[0]._fields[2].properties.genres
      .split("'")
      .filter((e, i) => i & 1)
      .filter((word) => word !== "id" && word !== "name"),
  };
  console.log(movie);

  const comments = await getComments(id);
  const allInfo = { ratings: ratings, comments: comments, movie: movie };
  return allInfo;
};

const searchMovies = async (phrase, page, genre, sort_field, asc) =>
  new Promise((resolve, reject) => {
    const session = driver.session();
    const whereClause = `WHERE toLower(m.genres) CONTAINS toLower($genre) AND toLower(m.title) CONTAINS toLower($phrase)`;
    const sortClause = sort_field ? `ORDER BY m.${sort_field} ${asc}` : "";
    const paginate = page > 1 ? `SKIP ${(page - 1) * 20}` : "";
    const query = `MATCH (m:Movie) ${whereClause} RETURN m ${sortClause} ${paginate} LIMIT 20`;
    session
      .run(query, { phrase: phrase, genre: genre })
      .then(async (result) => {
        const movies = result.records.map((record) => {
          return {
            id: record._fields[0].properties.id,
            tmdbId: record._fields[0].properties.tmdbId,
            title: record._fields[0].properties.title,
            tagline: record._fields[0].properties.tagline,
            poster_path: record._fields[0].properties.poster_path,
          };
        });
        const session2 = driver.session();
        const query2 = `MATCH (m:Movie) ${whereClause} RETURN count(m)`;
        const total = await session2.run(query2, {
          phrase: phrase,
          genre: genre,
        });
        const maxPages = Math.ceil(total.records[0]._fields[0].low / 20);
        resolve({ maxPages, page, movies });
      })
      .catch((error) => {
        reject(error);
      });
  });

const checkIfIdExists = async (id) => {
  const session = driver.session();
  const result = await session.run(`MATCH (m:Movie {id: $id}) RETURN m`, {
    id: id,
  });
  return result.records.length > 0;
};
const getPages = new Promise((resolve, reject) => {
  const session = driver.session();
  session
    .run(`MATCH (movie:Movie) RETURN count(movie)`)
    .then((result) => {
      const count = result.records[0]._fields[0].low;
      resolve(Math.ceil(count / 20));
    })
    .catch((error) => {
      reject(error);
    });
});

const getPopularMovies = async (page) => {
  const session = driver.session();
  console.log("page", page);
  const result = await session.run(
    `MATCH (movie:Movie) RETURN movie ORDER BY toFloat(movie.popularity) DESC ${
      page > 1 ? `SKIP ${(page - 1) * 20}` : ""
    } LIMIT 20`
  );
  const movies = result.records.map((record) => {
    return {
      id: record._fields[0].properties.id,
      tmdbId: record._fields[0].properties.tmdbId,
      title: record._fields[0].properties.title,
      tagline: record._fields[0].properties.tagline,
      overview: record._fields[0].properties.overview,
      released: record._fields[0].properties.release_date,
      popularity: record._fields[0].properties.popularity,
      poster_path: record._fields[0].properties.poster_path,
    };
  });
  const total = await session.run(`MATCH (movie:Movie) RETURN count(movie)`);
  const maxPages = Math.ceil(total.records[0]._fields[0].low / 20);
  return { maxPages, page, movies };
};

const addMovie = async (movie) => {
  const session = driver.session();
  const {
    title,
    tagline,
    release_date,
    genres,
    overview,
    vote_average,
    vote_count,
    popularity,
  } = movie;
  let id = Math.floor(Math.random() * 100000000000000000) + "";
  while (await checkIfIdExists(id)) {
    id = Math.floor(Math.random() * 100000000000000000) + "";
  }
  console.log(movie);
  console.log(overview);
  const query = `CREATE (m:Movie {
    id: $id,
    title: $title,
    tagline: $tagline,
    release_date: $release_date,
    genres: $genres,
    overview: $overview,
    vote_average: $vote_average,
    vote_count: $vote_count,
    popularity: $popularity
  }) RETURN m`;
  const params = {
    id: id,
    ...movie,
  };

  const result = await session.run(query, params);
  return result;
};

const addComment = async (comment) => {
  const session = driver.session();
  const { movieId, userId, text, timestamp } = comment;
  const query = `MATCH (m:Movie {id: $movieId}), (u:User {id: $userId})
  CALL apoc.create.relationship(u, "COMMENTED", {text: $text, timestamp: $timestamp}, m) YIELD rel
  RETURN r`;
  const params = {
    movieId,
    userId,
    text,
    timestamp,
  };
  const result = await session.run(query, params);
  return result.records[0]._fields[0].properties;
};

const updateComment = async (comment) => {
  const session = driver.session();
  const { movieId, userId, text, timestamp } = comment;
  const query = `MATCH (u:User {id: $userId})-[r:COMMENTED]->(m:Movie {id: $movieId})
  SET r.text = $text, r.timestamp = $timestamp
  RETURN r`;
  const params = {
    movieId,
    userId,
    text,
    timestamp,
  };
  const result = await session.run(query, params);
  return result.records[0]._fields[0].properties;
};

const getComments = async (movieId) => {
  const session = driver.session();
  const query = `MATCH (u:User)-[r:COMMENTED]->(m:Movie {id: $movieId})
  RETURN u,r,m`;
  const params = {
    movieId,
  };
  const result = await session.run(query, params);
  const comments = result.records.map((record) => {
    return {
      user_id: record._fields[0].properties.id,
      text: record._fields[1].properties.text,
      timestamp: record._fields[1].properties.timestamp,
    };
  });
  return comments;
};

const setRating = async (rating_data) => {
  const session = driver.session();
  const { movieId, userId, rating, timestamp } = rating_data;
  const query = `MATCH (m:Movie {id: $movieId}), (u:User {id: $userId})
  MERGE (u)-[r:RATED]->(m)
  SET r.rating = $rating, r.timestamp = $timestamp`;
  const params = {
    movieId,
    userId,
    rating,
    timestamp,
  };
  const result = await session.run(query, params);
  console.log(result);
  return result.records[0]?._fields[0].properties || "Rating upadted";
};

const getRatings = async (movieId) => {
  const session = driver.session();
  const query = `MATCH (u:User)-[r:RATED]->(m:Movie {id: $movieId})
  RETURN u,r,m`;
  const params = {
    movieId,
  };
  const result = await session.run(query, params);
  const ratings = result.records.map((record) => {
    return {
      user_id: record._fields[0].properties.id,
      rating: record._fields[1].properties.rating,
      timestamp: record._fields[1].properties.timestamp,
    };
  });
  return ratings;
};

module.exports = {
  getAllMovies,
  getMovie,
  searchMovies,
  getPopularMovies,
  addMovie,
  addComment,
  getComments,
  setRating,
  getRatings,
};
