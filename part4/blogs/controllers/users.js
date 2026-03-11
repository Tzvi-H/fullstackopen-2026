const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (password === undefined || password.length < 3) {
    return res.status(400).json({
      error: "password must have at least 3 characters",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    username,
    passwordHash,
  });

  await user.save();

  res.status(201).json(user);
});

module.exports = usersRouter;
