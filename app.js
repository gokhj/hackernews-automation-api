require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const fetch = require("node-fetch");

const cors = require("cors");

const News = require("./models/news");
const Connect = require("./controllers/connect");
const InstaPaper = require("./controllers/instapaper");

const app = express();

app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Standard welcome page
app.get("/", (req, res) => {
  res.send(
    "<p>Welcome to Gökhan's HackerNews wrapper. Use <a href=\"/api\">/api</a> to check what's been going on.</p>"
  );
});

// API Route
app.use("/api", require("./routes/api/stories"));

// Cron job to refresh stories every 6 hours
cron.schedule("0 */6 * * *", function () {
  console.log("Purging database...");
  // Deleting the database
  Connect.deleteDB();
  // Add new stories
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
