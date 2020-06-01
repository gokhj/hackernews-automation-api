const express = require("express");
const router = express.Router();

const News = require("../../models/news");

// Main route, also provides information about the API
router.get("/", (req, res) => {
  res.json({
    msg: "Welcome to the Stories API. You can use below routes to get stories.",
    "/stories/<score>":
      "Change <score> with an integer. It will return the stories more than the specified score.",
    score_example: "<url>/stories/500",
    "/stories/keyword/<keyword>":
      "Look for the stories that has <keyword> in it.",
    "keyword_example:": "<url>/stories/keywords/stripe",
  });
});

// Route to provide stories that has higher score than the specified amount
router.get("/:score", (req, res) => {
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
router.get("/keywords/:keyword", (req, res) => {
  News.find({})
    .then((db) => {
      let found = [];
      db.some((story) => {
        let titleArray = story.title.split(" ");
        const key = req.params.keyword.toLowerCase();
        for (let index = 0; index < titleArray.length; index++) {
          const element = titleArray[index];
          const replaced_element = element
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .toLowerCase();
          if (replaced_element === key) {
            found.push(story);
            break;
          }
        }
      });
      if (found) {
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

module.exports = router;
