import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
    likes: 0,
    user: null,
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("test title", { exact: false });
  expect(element).toBeDefined();
});
