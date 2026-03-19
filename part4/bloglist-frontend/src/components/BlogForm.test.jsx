import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("submiting the create blog form calls handler with correct arguments", async () => {
  const user = userEvent.setup();
  const mockHandler = vi.fn();
  const [title, author, url] = ["new title", "new author", "new url"];

  render(<BlogForm createBlog={mockHandler} />);

  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");

  await user.type(titleInput, title);
  await user.type(authorInput, author);
  await user.type(urlInput, url);

  const sendButton = screen.getByText("create");
  await user.click(sendButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0].title).toBe(title);
  expect(mockHandler.mock.calls[0][0].author).toBe(author);
  expect(mockHandler.mock.calls[0][0].url).toBe(url);
});
