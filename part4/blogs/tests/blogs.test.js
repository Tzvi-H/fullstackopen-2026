const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const initialBlogs = require("./blogs_data");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany();
  await Blog.insertMany(initialBlogs);
});

describe("GET /api/blogs", () => {
  test("returns correct amount of blog posts", async () => {
    const result = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.length, initialBlogs.length);
  });

  test("returns blogs that contain an id property, not _id", async () => {
    const result = await api.get("/api/blogs");

    assert("id" in result.body[0]);
    assert(!("_id" in result.body[0]));
  });
});

describe("POST /api/blogs", () => {
  test("creates a new blog", async () => {
    const newBlog = {
      title: "temp blog from test",
      author: "temp author from test",
      url: "temp author from test",
      likes: 1000,
    };

    const result = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsInDb = await api.get("/api/blogs");
    const titles = blogsInDb.body.map((b) => b.title);

    assert.strictEqual(blogsInDb.body.length, initialBlogs.length + 1);
    assert(titles.includes(newBlog.title));
  });

  test("without sending a like property, will default to 0", async () => {
    const newBlog = {
      title: "temp blog from test",
      author: "temp author from test",
      url: "temp author from test",
    };

    const result = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.likes, 0);
  });

  test("without a title, results in 400 status code", async () => {
    const newBlog = {
      author: "temp author from test",
      url: "temp author from test",
      votes: 20,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsInDb = await api.get("/api/blogs");
    assert.deepEqual(blogsInDb.body.length, initialBlogs.length);
  });

  test.only("without a url, results in 400 status code", async () => {
    const newBlog = {
      author: "temp author from test",
      title: "temp blog from test",
      votes: 20,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsInDb = await api.get("/api/blogs");
    assert.deepEqual(blogsInDb.body.length, initialBlogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
