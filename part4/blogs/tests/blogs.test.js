const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const blogs = require("./blogs_data");

test("dummy returns 1", () => {
  const result = listHelper.dummy([]);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes([blogs[0]]);
    assert.strictEqual(result, 7);
  });

  test("of a bigger list, is calculated right", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});
