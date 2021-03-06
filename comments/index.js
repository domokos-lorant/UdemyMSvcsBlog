const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  const comments = commentsByPostId[postId] ?? [];
  res.send(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comment = { id, content, status: "pending" };

  const comments = commentsByPostId[postId] ?? [];
  comments.push(comment);
  commentsByPostId[postId] = comments;

  // Notify event bus.
  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: { ...comment, postId },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received event", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { id, postId, status } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    let updateEvent = {
      type: "CommentUpdated",
      data: { ...comment, postId },
    };

    await axios.post("http://event-bus-srv:4005/events", updateEvent);
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
