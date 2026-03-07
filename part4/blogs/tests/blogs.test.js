const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const blogs = require("./blogs_data");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany();
  await Blog.insertMany(blogs);
});

describe("GET /api/blogs", () => {
  test("returns correct amount of blog posts", async () => {
    const result = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.length, blogs.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
