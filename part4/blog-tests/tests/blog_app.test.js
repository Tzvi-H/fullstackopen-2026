const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "name 3",
        password: "123456",
        username: "username 3",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = page.getByText("log in to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("username 3");
      await page.getByLabel("password").fill("123456");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("name 3 logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("username 3");
      await page.getByLabel("password").fill("wrong password");
      await page.getByRole("button", { name: "login" }).click();

      //   await expect(page.getByText("wrong username or password")).toBeVisible();
      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("wrong username or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
    });
  });
});
