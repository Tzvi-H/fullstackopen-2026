const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const initialBlogs = require("./blogs_data");
const initialUsers = require("./users_data");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany();
  await Blog.insertMany(initialBlogs);
  await User.deleteMany();
  await User.insertMany(initialUsers);
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

  test("without a url, results in 400 status code", async () => {
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

describe("DELETE /api/blogs/:id", () => {
  test("will successfully delete the blog", async () => {
    const result = await api.get("/api/blogs");
    const firstBlog = result.body[0];
    await api.delete(`/api/blogs/${firstBlog.id}`).expect(204);
    const blogsInDb = await api.get("/api/blogs");
    assert.deepEqual(blogsInDb.body.length, initialBlogs.length - 1);
  });
});

describe("PUT /api/blogs/:id", () => {
  test("will successfully update a blog with the number of likes", async () => {
    const result = await api.get("/api/blogs");
    const firstBlog = result.body[0];
    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send({ likes: 1234 })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe.only("POST /api/users", () => {
  test("will return proper response for missing username", async () => {
    const user = {
      name: "name a",
      password: "123456",
    };
    const result = await api.post("/api/users").send(user).expect(400);

    assert(result.body.error.includes("Path `username` is required"));

    const usersInDb = await api.get("/api/users");
    assert.strictEqual(usersInDb.body.length, initialUsers.length);
  });

  test("will return proper response for too short username", async () => {
    const user = {
      name: "name a",
      password: "123456",
      username: "ab",
    };
    const result = await api.post("/api/users").send(user).expect(400);

    assert(
      result.body.error.includes(
        "(`ab`, length 2) is shorter than the minimum allowed length (3)",
      ),
    );

    const usersInDb = await api.get("/api/users");
    assert.strictEqual(usersInDb.body.length, initialUsers.length);
  });

  test("will return proper response for invalid password", async () => {
    const user = {
      name: "name a",
      password: "12",
      username: "username a",
    };
    const result = await api.post("/api/users").send(user).expect(400);

    assert(
      result.body.error.includes("password must have at least 3 characters"),
    );

    const usersInDb = await api.get("/api/users");
    assert.strictEqual(usersInDb.body.length, initialUsers.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
