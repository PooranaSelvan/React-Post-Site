const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require("uuid");

const { getStoredPosts, storePosts } = require('./data/posts');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/posts', async (req, res) => {
  const storedPosts = await getStoredPosts();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ posts: storedPosts });
});

app.get('/posts/:id', async (req, res) => {
  const storedPosts = await getStoredPosts();
  const post = storedPosts.find((post) => post.id === req.params.id);


  if (!post) {
    res.status(404).json({ message: "Post not found!" });
  } else {
    res.status(200).json({ ...post });
  }
});

app.post('/posts', async (req, res) => {
  const existingPosts = await getStoredPosts();
  const postData = req.body;
  const newPost = {
    ...postData,
    id: uuidv4(),
  };
  const updatedPosts = [newPost, ...existingPosts];
  await storePosts(updatedPosts);
  res.status(201).json({ message: 'New Post Added Successfully!', post: newPost });
});

app.post("/update-post", async (req, res) => {
  const existingPosts = await getStoredPosts();

  const { postId, body, author } = req.body;

  if (!postId) {
    res.status(404).json({ message: "Invalid Post Id!" });
    return;
  }

  if (!body) {
    res.status(404).json({ message: "Invalid Post Body!" });
    return;
  }

  if (!author) {
    res.status(404).json({ message: "Invalid Post Author!" });
    return;
  }

  let index = existingPosts.findIndex(ele => ele.id === postId);

  if (index === -1) {
    return res.status(404).json({ message: "Post not found!" });
  }

  existingPosts[index] = {
    ...existingPosts[index],
    body,
    author
  }

  await storePosts(existingPosts);

  res.status(201).json({ post: { id: postId, body, author }, message: "Post Updated Successfully!" });
});

app.post("/delete-post", async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    res.status(404).json({ message: "Invalid Post Id!" });
    return;
  }

  console.log(postId);

  const existingPosts = await getStoredPosts();

  let post = existingPosts.find(ele => ele.id === postId);

  if (post) {
    await storePosts(existingPosts.filter(ele => ele.id !== postId));
    res.status(201).json({ message: "Post Deleted Successfully" });
  } else {
    res.status(404).json({ message: "Post Not Found!" });
  }
});

app.listen(8080, () => {
  console.log("Server is Running!");
});