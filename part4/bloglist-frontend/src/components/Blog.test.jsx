import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("Blog", () => {
  beforeEach(() => {
    const blog = {
      title: "test title",
      author: "test author",
      url: "test url",
      likes: 0,
      user: { name: "john doe", username: "john90best" },
    };

    render(<Blog blog={blog} />);
  });

  test("renders content", () => {
    const element = screen.getByText("test title", { exact: false });
    expect(element).toBeDefined();
  });

  test("at start the url and likes are not displayed", () => {
    const element = screen.queryByText("test url", { exact: false });
    expect(element).not.toBeInTheDocument();
    const urlElement = screen.queryByText("likes", { exact: false });
    expect(urlElement).not.toBeInTheDocument();
  });

  test("shows details after clicking the view button", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);
    const element = screen.getByText("test url", { exact: false });
    expect(element).toBeInTheDocument();
    const urlElement = screen.queryByText("likes", { exact: false });
    expect(urlElement).toBeInTheDocument();
  });
});

test("when a user clicks the like button twice, the handler is called twice", async () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
    likes: 0,
    user: { name: "john doe", username: "john90best" },
  };
  const mockHandler = vi.fn();

  render(<Blog blog={blog} updateBlog={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
