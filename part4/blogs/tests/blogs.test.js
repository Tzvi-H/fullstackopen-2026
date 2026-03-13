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
  await User.deleteMany();
  await Promise.all(
    initialUsers.map((user) =>
      api.post("/api/users").send({
        username: user.username,
        password: user.password,
        name: user.name,
      }),
    ),
  );
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
  let authorization;
  const { username, password } = initialUsers[0];
  const loginInfo = { username, password };

  beforeEach(async () => {
    const result = await api.post("/api/login").send(loginInfo);
    authorization = "Bearer " + result.body.token;
  });

  test("fails with a 401 if token not provided", async () => {
    const newBlog = {
      title: "temp blog from test",
      author: "temp author from test",
      url: "temp author from test",
      likes: 1000,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const blogsInDb = await api.get("/api/blogs");
    assert.deepEqual(blogsInDb.body.length, initialBlogs.length);
  });

  test("creates a new blog", async () => {
    const newBlog = {
      title: "temp blog from test",
      author: "temp author from test",
      url: "temp author from test",
      likes: 1000,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: authorization })
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
      .set({ Authorization: authorization })
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

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: authorization })
      .expect(400);

    const blogsInDb = await api.get("/api/blogs");
    assert.deepEqual(blogsInDb.body.length, initialBlogs.length);
  });

  test("without a url, results in 400 status code", async () => {
    const newBlog = {
      author: "temp author from test",
      title: "temp blog from test",
      votes: 20,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: authorization })
      .expect(400);

    const blogsInDb = await api.get("/api/blogs");
    assert.deepEqual(blogsInDb.body.length, initialBlogs.length);
  });
});

describe("DELETE /api/blogs/:id", () => {
  let authorization;
  const { username, password } = initialUsers[0];
  const loginInfo = { username, password };

  beforeEach(async () => {
    const result = await api.post("/api/login").send(loginInfo);
    authorization = "Bearer " + result.body.token;
  });

  test("will successfully delete the blog", async () => {
    const newBlog = {
      title: "temp blog from test",
      author: "temp author from test",
      url: "temp author from test",
      likes: 1000,
    };

    const result = await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: authorization });
    const blogsInDb1 = await api.get("/api/blogs");
    assert.deepEqual(blogsInDb1.body.length, initialBlogs.length + 1);
    const savedBlog = result.body;

    await api
      .delete(`/api/blogs/${savedBlog.id}`)
      .set({ Authorization: authorization })
      .expect(204);
    const blogsInDb2 = await api.get("/api/blogs");
    assert.deepEqual(blogsInDb2.body.length, initialBlogs.length);
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

describe("POST /api/users", () => {
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
