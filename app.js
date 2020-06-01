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
    "Welcome to the mini-hackernews API. To get all data, simply use /all, or to use the extensive api go with /stories."
  );
});

// Route to provide all stories that has more than 100 score
app.get("/all", (req, res) => {
  News.find({})
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json({
        msg: err,
      });
    });
});

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

app.use("/stories", require("./routes/api/stories"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
