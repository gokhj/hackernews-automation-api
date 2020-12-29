require("dotenv").config();
const express = require("express");
var exphbs = require("express-handlebars");
const cron = require("node-cron");

const cors = require("cors");

const News = require("./models/news");
const Connect = require("./controllers/connect");
const InstaPaper = require("./controllers/instapaper");
const { searchStories, getTopStories } = require("./helpers/data");

const app = express();

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Standard welcome page
app.get("/", async (req, res) => {
  let stories = await News.find({}).lean();
  stories = stories.map((story, index) => {
    const domain = story.url
      ? story.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1]
      : null;
    return (story = {
      ...story,
      index: index + 1,
      domain,
    });
  });
  res.render("home", {
    stories,
  });
});

app.get("/search", async (req, res) => {
  const stories = await searchStories(req.query.q);
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
  const stories = await getTopStories();
  // Check if length is less than 10
  stories.length > 10 ? (length = 10) : (length = stories.length);
  for (let i = 0; i < length; i++) {
    InstaPaper.sendStory(stories[i]);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
