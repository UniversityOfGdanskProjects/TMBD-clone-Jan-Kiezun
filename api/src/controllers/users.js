require("dotenv").config();
const express = require("express");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);
const bcrypt = require("bcrypt");

const session = driver.session();

const getAllUsers = async () => {
  const result = await session.run(`MATCH (u:User) RETURN u`);
  const users = result.records.map((record) => {
    return {
      id: record._fields[0].properties.id,
      name: record._fields[0].properties.name,
      email: record._fields[0].properties.email,
      password: record._fields[0].properties.password,
    };
  });
  return users;
};

const getUser = async (id) => {
  const result = await session.run(`MATCH (u:User {id: $id}) RETURN u`, {
    id: id,
  });
  const user = result.records[0]._fields[0].properties;
  return user;
};

const registerUser = async (id, password) => {
  const result = await session.run(`MATCH (u:User {id: $id}) RETURN u`, {
    id: id,
  });
  const user = result.records[0]?._fields[0].properties;
  return user;
};

const addUser = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await session.run(
    `CREATE (u:User {id: $id, password: $password, role:"user"}) RETURN u`,
    {
      id: id,
      password: hashedPassword,
    }
  );
  const user = result.records[0]?._fields[0].properties;
  return user;
};

const loginUser = async (id, password) => {
  const result = await session.run(`MATCH (u:User {id: $id}) RETURN u`, {
    id: id,
  });
  const user = result.records[0]?._fields[0].properties;
  if (!user) return null;
  const correctPassword = await bcrypt.compare(password, user.password);
  return correctPassword ? user : null;
};

module.exports = {
  getAllUsers,
  getUser,
  registerUser,
  loginUser,
  addUser,
};
