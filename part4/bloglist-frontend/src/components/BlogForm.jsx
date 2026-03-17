import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (e) => {
    e.preventDefault();
    createBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <label>
        title:
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <br />
      </label>
      <label>
        author:
        <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        <br />
      </label>
      <label>
        url:
        <input value={url} onChange={(e) => setUrl(e.target.value)} />
      </label>
      <br />
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
