const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    const postId = req.params.id;
    const comments = commentsByPostId[postId] ?? [];
    res.send(comments);
});

app.post("/posts/:id/comments", (req, res) => {
    const postId = req.params.id;
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;
    const comment = { postId, content };

    const comments = commentsByPostId[postId] ?? [];
    comments.push(comment);
    commentsByPostId[postId] = comments;

    res.status(201).send(comments);
});

app.listen(4001, () => {
    console.log("Listening on port 4001");
});