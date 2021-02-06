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
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;
    const comment = { postId, content };

    const comments = commentsByPostId[postId] ?? [];
    comments.push(comment);
    commentsByPostId[postId] = comments;

    // Notify event bus.
    await axios.post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: { ...comment, postId }
    });

    res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
    console.log("Received event", req.body.type);

    res.send({});
});

app.listen(4001, () => {
    console.log("Listening on port 4001");
});