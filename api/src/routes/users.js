require("dotenv").config();
const express = require("express");
const {
  getAllUsers,
  getUser,
  addUser,
  loginUser,
  registerUser,
} = require("../controllers/users");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await getAllUsers();
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id);
  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await deleteUser(id);
  res.send(user);
});

router.post("/", async (req, res) => {
  const { id, password } = req.body;
  const result = await addUser(id, password);
  res.send(result);
});

router.post("/login", async (req, res) => {
  const { id, password } = req.body;
  const result = await loginUser(id, password);
  res.send(result);
});

router.post("/register", async (req, res) => {
  const user = req.body;
  const result = await registerUser(user);
  console.log(result);
  res.send(result);
});

module.exports = router;
