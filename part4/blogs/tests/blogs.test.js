const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns 1", () => {
  const result = listHelper.dummy([]);
  assert.strictEqual(result, 1);
});
