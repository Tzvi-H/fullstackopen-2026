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

after(async () => {
  await mongoose.connection.close();
});
