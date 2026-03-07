const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  author: String,
  url: {
    required: true,
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
