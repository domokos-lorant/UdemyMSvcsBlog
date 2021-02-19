const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  console.log("Received event", req.body.type);
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const { id, content, postId } = data;

    let moderationEvent = {
      type: "CommentModerated",
      data: { id, postId, content },
    };

    if (content.includes("orange")) {
      moderationEvent.data.status = "rejected";
    } else {
      moderationEvent.data.status = "approved";
    }

    await axios.post("http://event-bus-srv:4005/events", moderationEvent);
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Listening on port 4003");
});
