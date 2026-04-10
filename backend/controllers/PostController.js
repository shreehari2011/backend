const Post = require("../models/Post");

const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};

const createPost = async (req, res) => {
  const { title, content, tag } = req.body;

  const post = await Post.create({
    title,
    content,
    tag,
    author: req.user.username,
    userId: req.user._id,
  });

  res.status(201).json(post);
};

const votePost = async (req, res) => {
  const { type } = req.body; // up or down

  const post = await Post.findById(req.params.id);

  if (type === "up") post.upvotes += 1;
  else post.downvotes += 1;

  await post.save();
  res.json(post);
};

module.exports = { getPosts, createPost, votePost };