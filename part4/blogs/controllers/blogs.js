const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body);

  try {
    await blog.save();
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
