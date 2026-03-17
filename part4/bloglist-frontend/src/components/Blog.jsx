import { useState } from "react";

const Blog = ({ blog, updateBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const buttonText = showDetails ? "hide" : "view";
  const handleClick = () => setShowDetails(!showDetails);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 };
    updateBlog(newBlog);
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={handleClick}>{buttonText}</button>
      {showDetails && (
        <div>
          {blog.url}
          <br />
          likes {blog.likes}
          <button onClick={handleLike}>like</button>
          <br />
          {blog.user.name}
        </div>
      )}
    </div>
  );
};

export default Blog;
