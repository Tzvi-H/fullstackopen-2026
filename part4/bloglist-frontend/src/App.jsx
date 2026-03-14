import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const user = window.localStorage.getItem("loggedBlogappUser");
    if (user) {
      setUser(JSON.parse(user));
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (e) {
      console.error("fail", e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const blogsElement = () => (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <label>
        username
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">login</button>
    </form>
  );

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const savedBlog = await blogService.create({ title, author, url });
      setBlogs(blogs.concat(savedBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (e) {
      console.error("fail", e);
    }
  };

  const createForm = () => (
    <form onSubmit={handleCreate}>
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

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <div>
        <h2>create new</h2>
        {createForm()}
      </div>
      {blogsElement()}
    </div>
  );
};

export default App;
