import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedBlogappUser = window.localStorage.getItem("loggedBlogappUser");
    if (loggedBlogappUser) {
      const parsedUser = JSON.parse(loggedBlogappUser);
      setUser(parsedUser);
      blogService.setToken(parsedUser.token);
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
    } catch {
      setNotificationMessage({
        type: "error",
        text: "wrong username or password",
      });
      setTimeout(() => setNotificationMessage(null), 2500);
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
      blogFormRef.current.toggleVisibility();
      setNotificationMessage({
        type: "success",
        text: `a new blog '${title}' by ${author} added`,
      });
      setTimeout(() => setNotificationMessage(null), 2500);
    } catch (e) {
      console.error("fail", e);
    }
  };

  const createForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
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
    </Togglable>
  );

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notificationMessage} />
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
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
