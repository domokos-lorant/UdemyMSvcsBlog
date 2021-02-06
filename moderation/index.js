const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
   console.log("Received event", req.body.type);

   const { type, data } = req.body;

   if (type === "CommentCreated") {
      // const { id, title } = data;
      // posts[id] = { id, title, comments: [] };
   }

   res.send({});
});

app.listen(4003, () => {
   console.log("Listening on port 4003");
});