const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const { tokenExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", tokenExtractor, async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);
  const blog = new Blog(request.body);
  blog.user = user._id;

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(blog);
  } catch (e) {
    next(e);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog);
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = blogsRouter;
