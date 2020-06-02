const express = require("express");
const cors = require("cors");
const cron = require("node-cron");

const News = require("./models/news");
const Connect = require("./controllers/connect");

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

// Another scheduled task to send top stories to InstaPaper every day 23:59
// Waiting for the API credentials!
cron.schedule("59 23 * * *", function () {
  console.log("A day finished, again...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
