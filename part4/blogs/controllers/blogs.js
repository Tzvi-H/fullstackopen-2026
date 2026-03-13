const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { tokenExtractor, userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blog);
});

blogsRouter.post(
  "/",
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    const user = request.user;
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
  },
);

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

blogsRouter.delete(
  "/:id",
  tokenExtractor,
  userExtractor,
  async (request, response, next) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response
        .status(400)
        .json({ error: "blogId missing or not valid" });
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response
        .status(403)
        .json({ error: "only the creator can delete a blog" });
    }

    await blog.deleteOne();
    response.status(204).end();
  },
);

module.exports = blogsRouter;
