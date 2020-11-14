const express = require("express");
const router = express.Router();

const {
  getTopStories,
  getAllStories,
  searchStories,
  getHigherScore,
} = require("../../helpers/data");

// Main route, also provides information about the API
router.get("/", (req, res) => {
  res.json({
    msg: "Welcome to the Stories API. You can use below routes to get stories.",
    "/score/<score>":
      "Change <score> with an integer. It will return the stories more than the specified score. Eg. /api/score/500",
    "/stories/keyword/<keyword>":
      "Look for the stories that has <keyword> in it.",
    "/all": "Get all the stories with more than 100 upvotes.",
    "/top": "Get top stories by descending order.",
  });
});

// Route to provide stories that has higher score than the specified amount
router.get("/score/:score", async (req, res) => {
  res.json(await getHigherScore(req.params.score));
});

// Search keywords
router.get("/search/:keyword", async (req, res) => {
  res.json(await searchStories(req.params.keyword.toLowerCase()));
});

// Route to provide all stories that has more than 100 score
router.get("/all", async (req, res) => {
  res.json(await getAllStories());
});

router.get("/top", async (req, res) => {
  res.json(await getTopStories());
});

module.exports = router;
