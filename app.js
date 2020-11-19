require("dotenv").config();
const express = require("express");
var exphbs = require("express-handlebars");
const cron = require("node-cron");
const fetch = require("node-fetch");
const axios = require("axios");

const cors = require("cors");

const News = require("./models/news");
const Connect = require("./controllers/connect");
const InstaPaper = require("./controllers/instapaper");
const { searchStories } = require("./helpers/data");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Standard welcome page
app.get("/", async (req, res) => {
  const stories = await News.find({}).lean();
  res.render("home", {
    stories,
  });
});

app.get("/search", async (req, res) => {
  const stories = await searchStories(req.query.q);
  console.log(stories);
  res.render("search", {
    stories,
    key: req.query.q,
  });
});

// API Route
app.use("/api", require("./routes/api/stories"));

// Cron job to refresh stories every 3 hours
cron.schedule("0 */3 * * *", function () {
  console.log("Purging database...");
  Connect.deleteDB();
  Connect.getData();
  console.log("Database updated!");
});

// Another scheduled task to send top stories to InstaPaper every day 23:55
cron.schedule("55 23 * * *", async function () {
  // Get the top stories from API
  const fetch_response = await fetch(
    "http://hackernews.gokhanarkan.com/api/top"
  );
  // Check if accepted
  if (fetch_response.status === 200) {
    const json = await fetch_response.json();
    // Check the size of the file
    // I am aiming to send 10 stories per day
    if (json.length > 10) {
      for (let i = 0; i < 10; i++) {
        InstaPaper.sendStory(json[i]);
      }
    } else {
      json.forEach((item) => {
        InstaPaper.sendStory(item);
      });
    }
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
