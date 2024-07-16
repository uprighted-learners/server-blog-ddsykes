const { error } = require("console");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const blogFilePath = path.join(__dirname, "../api/blog.json");

//Get all posts
router.get("/posts", (req, res) => {
  fs.readFile(blogFilePath, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });
    const posts = JSON.parse(data);
    res.status(200).json(posts);
  });
});

//Get a single post by using post_id
router.get("/posts/:post_id", (req, res) => {
  const postId = parseInt(req.params.post_id);
  fs.readFile(blogFilePath, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.post_id === postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  });
});

//Creating a new post
router.post("/posts", (req, res) => {
  const newPost = req.body;
  fs.readFile(blogFilePath, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read the data" });
    const posts = JSON.parse(data);
    newPost.post_id = posts.length ? posts[posts.length - 1].post_id + 1 : 1;
    posts.push(newPost);
    fs.writeFile(blogFilePath, JSON.stringify(posts, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Failed to write the data" });
      res.status(201).json(newPost);
    });
  });
});

//Updating the existing  post
router.put("/posts/:post_id", (req, res) => {
  const postId = parseInt(req.params.postId);
  const updatedPost = req.body;
  fs.readFile(blogFilePath, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read the data" });
    let posts = JSON.parse(data);
    const postIndex = posts.findIndex((p) => p.post_id === postId);
    if (postIndex === -1)
      return res.status(404).json({ error: "Post not found" });
    posts[postIndex] = { ...posts[postIndex], ...updatedPost };
    fs.writeFile(blogFilePath, JSON.stringify(posts, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Failed to write the data" });
      res.status(200).json(posts[postIndex]);
    });
  });
});

//Delete the post
router.delete("/posts/:post_id", (req, res) => {
  const postId = parseInt(req.params.post_id);
  fs.readFile(blogFilePath, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read the data" });
    let posts = JSON.parse(data);
    const newPosts = posts.filter((p) => p.post_id !== postId);
    if (newPosts.length === posts.length)
      return res.status(404).json({ error: "Post not found" });
    fs.writeFile(blogFilePath, JSON.stringify(newPosts, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Failed to write the data" });
      res.status(200).json({ message: "Post is deleted" });
    });
  });
});

module.exports = router;
