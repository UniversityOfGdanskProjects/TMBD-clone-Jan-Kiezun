require("dotenv").config();
const express = require("express");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);
//
//Movies
//
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
  const result = await session.run(`match (m:Movie {id: $id}) return m`, {
    id: id,
  });
  const movie = result.records[0]._fields[0].properties;

  const allInfo = movie;
  return allInfo;
};

const searchMovies = async (phrase, page, genres, sort_field, asc) =>
  new Promise((resolve, reject) => {
    const session1 = driver.session();
    const session2 = driver.session();
    const genresClause = genres.length
      ? "WITH m, collect(toLower(g.name)) AS nodeGenres, $genres AS genres WHERE all(g IN split(genres,',') WHERE toLower(g) IN nodeGenres) "
      : "";
    const whereClause = `${
      genres.length ? " AND " : " WHERE "
    } toLower(m.title) CONTAINS toLower("${phrase}")`;
    const toFloat =
      sort_field in ["rating", "popularity", "vote_average", "vote_count"];
    const toDate = sort_field in ["release_date"];
    const sortClause = sort_field
      ? `ORDER BY ${
          toFloat
            ? `toFloat(m.${sort_field})`
            : toDate
            ? `toDate(m.${sort_field})`
            : `m.${sort_field}`
        } ${asc}`
      : "";
    const paginate = page > 1 ? `SKIP ${(page - 1) * 20}` : "";
    const query1 = `MATCH (m:Movie)-[r:GENRE]->(g:Genre) ${genresClause} ${whereClause} RETURN DISTINCT m ${sortClause} ${paginate} LIMIT 20`;
    const query2 = `MATCH (m:Movie)-[r:GENRE]->(g:Genre) ${genresClause} ${whereClause} RETURN count(m)`;
    console.log(query1);
    Promise.all([
      session1.run(query1, { genres: genres.toString() }),
      session2.run(query2, { genres: genres.toString() }),
    ]).then(([result, total]) => {
      const movies = result.records.map((record) => {
        return {
          id: record._fields[0].properties.id,
          tmdbId: record._fields[0].properties.tmdbId,
          title: record._fields[0].properties.title,
          tagline: record._fields[0].properties.tagline,
          poster_path: record._fields[0].properties.poster_path,
        };
      });
      const maxPages = Math.ceil(total.records[0]._fields[0].low / 20);
      resolve({ maxPages, page, movies });
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

const getGenres = (id = null) =>
  new Promise((resolve, reject) => {
    const session = driver.session();
    const query = id
      ? `MATCH (m:Movie {id:"${id}"})-[:GENRE]->(g:Genre) RETURN g`
      : `MATCH (g:Genre) RETURN g`;
    session
      .run(query)
      .then((result) => {
        const genres = result.records.map(
          (record) => record._fields[0].properties.name
        );
        resolve(genres);
      })
      .catch((error) => {
        reject(error);
      });
  });

const getPopularMovies = async (page) => {
  const session = driver.session();
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
    overview,
    vote_average,
    vote_count,
    popularity,
    budget,
    revenue,
    genres,
  } = movie;
  let id = Math.floor(Math.random() * 100000000000000000) + "";
  while (await checkIfIdExists(id)) {
    id = Math.floor(Math.random() * 100000000000000000) + "";
  }
  const genresString = genres.map((genre) => `"${genre}"`).toString();
  const query = `CALL apoc.create.node(['Movie'], {
    id: $id,
    title: $title,
    tagline: $tagline,
    release_date: $release_date,
    overview: $overview,
    vote_average: $vote_average,
    vote_count: $vote_count,
    popularity: $popularity,
    budget: $budget,
    revenue: $revenue
  }) YIELD node
  WITH node as n, [${genresString}] as genres
  UNWIND genres as genre
  MATCH (g:Genre {name: genre})
  CALL apoc.create.relationship(n, "GENRE", {}, g) YIELD rel
  RETURN rel,n`;
  const params = {
    id: id,
    ...movie,
    vote_average: 5,
    vote_count: 100,
  };

  console.log(params);

  console.log(query, genres.toString());
  // return;
  const result = await session.run(query, params);
  return result;
};

const deleteMovie = async (id) => {
  const session = driver.session();
  const query = `MATCH (m:Movie {id: $id}) DETACH DELETE m`;
  const params = {
    id,
  };

  const result = await session.run(query, params);
  return result;
};

const updateMovie = async (id, movie) => {
  const session = driver.session();
  const query = `MATCH (m:Movie {id: $id}) 
  SET m.title = $title,
  m.tagline = $tagline,
  m.release_date = $release_date,
  m.overview = $overview,
  m.vote_average = $vote_average,
  m.vote_count = $vote_count,
  m.popularity = $popularity,
  m.budget = $budget,
  m.revenue = $revenue
  RETURN m`;
  const params = {
    id,
    ...movie,
    vote_average: 5,
    vote_count: 100,
  };

  const result = await session.run(query, params);
  return result;
};

//
//Comments
//
const addComment = async (comment) => {
  const session = driver.session();
  const { movie_id, user_id, text, timestamp } = comment;
  const id = Math.floor(Math.random() * 1000000000) + "";
  const query = `MATCH (m:Movie {id: $movie_id}), (u:User {id: $user_id})
  CALL apoc.create.relationship(u, "COMMENTED", {id:$id, text: $text, timestamp: $timestamp}, m) YIELD rel
  RETURN rel`;
  const params = {
    id,
    movie_id,
    user_id,
    text,
    timestamp,
  };
  const result = await session.run(query, params);
  return result.records[0]._fields[0].properties;
};

const updateComment = async (comment) => {
  const session = driver.session();
  const { user_id, comment_id, text, timestamp } = comment;
  const query = `MATCH (u:User {id: $user_id})-[r:COMMENTED {id:$comment_id}]->(m:Movie)
  SET r.text = $text, r.timestamp = $timestamp
  RETURN r`;
  const params = {
    comment_id,
    user_id,
    text,
    timestamp,
  };
  const result = await session.run(query, params);
  return result.records[0]._fields[0].properties;
};

const deleteComment = async (comment) => {
  const session = driver.session();
  const { movie_id, comment_id } = comment;
  const query = `MATCH (u:User)-[r:COMMENTED {id:$comment_id}]->(m:Movie {id: $movie_id})
  DELETE r`;
  const params = {
    movie_id,
    comment_id,
  };
  const result = await session.run(query, params);
  return result;
};

const getComments = async (movieId) => {
  const session = driver.session();
  const query = `MATCH (u:User)-[r:COMMENTED]->(m:Movie {id: $movieId})
  RETURN u,r,m ORDER BY toFloat(r.timestamp) DESC`;
  const params = {
    movieId,
  };
  const result = await session.run(query, params);
  const comments = result.records.map((record) => {
    return {
      user_id: record._fields[0].properties.id,
      comment_id: record._fields[1].properties.id,
      text: record._fields[1].properties.text,
      timestamp: record._fields[1].properties.timestamp,
    };
  });
  return comments;
};
//
//Ratings
//
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
  return result.records[0]?._fields[0].properties || "Rating updated";
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
  deleteMovie,
  updateMovie,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  setRating,
  getRatings,
  getGenres,
};
