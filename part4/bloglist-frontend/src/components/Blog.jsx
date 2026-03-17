import { useState } from "react";

const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={handleClick}>{buttonText}</button>
      {showDetails && (
        <div>
          {blog.url}
          <br />
          likes {blog.likes}
          <button>like</button>
          <br />
          {blog.author}
        </div>
      )}
    </div>
  );
};

export default Blog;
