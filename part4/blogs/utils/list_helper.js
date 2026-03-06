const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  let currentBlog = blogs[0];
  for (blog of blogs.slice(1)) {
    if (blog.likes > currentBlog.likes) {
      currentBlog = blog;
    }
  }
  return currentBlog;
};

const mostBlogs = (blogs) => {
  const authorAndBlogCount = {};
  let currentAuthor;
  let maxBlogCount = 0;

  for (const { author } of blogs) {
    authorAndBlogCount[author] = authorAndBlogCount[author] || 0;
    authorAndBlogCount[author] += 1;
    if (authorAndBlogCount[author] > maxBlogCount) {
      currentAuthor = author;
      maxBlogCount = authorAndBlogCount[author];
    }
  }

  return { author: currentAuthor, blogs: maxBlogCount };
};

const mostLikes = (blogs) => {
  const authorAndLikeCount = {};
  let currentAuthor;
  let maxLikeCount = 0;

  for (const { author, likes } of blogs) {
    authorAndLikeCount[author] = authorAndLikeCount[author] || 0;
    authorAndLikeCount[author] += likes;
    if (authorAndLikeCount[author] > maxLikeCount) {
      currentAuthor = author;
      maxLikeCount = authorAndLikeCount[author];
    }
  }

  return { author: currentAuthor, likes: maxLikeCount };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
