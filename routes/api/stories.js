const express = require("express");
const router = express.Router();

const News = require("../../models/news");

// Main route, also provides information about the API
router.get("/", (req, res) => {
  res.json({
    "msg": "Welcome to the Stories API. You can use below routes to get stories.",
    "/score/<score>":
      "Change <score> with an integer. It will return the stories more than the specified score. Eg. /api/score/500",
    "/stories/keyword/<keyword>":
      "Look for the stories that has <keyword> in it.",
    "/all": "Get all the stories with more than 100 upvotes.",
    "/top": "Get top stories by descending order.",
  });
});

// Route to provide stories that has higher score than the specified amount
router.get("/score/:score", (req, res) => {
  News.find({})
    .then((db) => {
      const found = db.some((story) => story.score > req.params.score);
      if (found) {
        stories = db.filter(
          (story) =>
            story.score > req.params.score && typeof story.url !== "undefined"
        );
        res.json(stories);
      } else {
        res.status(400).json({ msg: "Story not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: "There is a problem." });
    });
});

// Search keywords
router.get("/search/:keyword", (req, res) => {
  News.find({})
    .then((db) => {
      let found = [];
      // Checking individual stories
      db.some((story) => {
        // Splitting words
        let titleArray = story.title.split(" ");
        const key = req.params.keyword.toLowerCase();
        for (let index = 0; index < titleArray.length; index++) {
          const element = titleArray[index];
          // Replacing special characters
          const replaced_element = element
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .toLowerCase();
          // Checking match
          if (replaced_element === key) {
            found.push(story);
            break;
          }
        }
      });
      if (found && found.length != 0) {
        res.json(found);
      } else {
        res.status(400).json({ msg: "Keyword not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "There is a problem.", error: err });
    });
});

// Route to provide all stories that has more than 100 score
router.get("/all", (req, res) => {
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

// Sort the stories with descending order.
router.get("/top", (req, res) => {
  News.find({})
    .then((response) => {
      response.sort(compare);
      res.json(response);
    })
    .catch((err) => {
      res.json({
        msg: err,
      });
    });
});
// Function to sort stories by descending order
function compare(a, b) {
  let comparison = 0;
  if (a.score > b.score) comparison = -1;
  else if (a.score < b.score) comparison = 1;
  return comparison;
}

module.exports = router;
