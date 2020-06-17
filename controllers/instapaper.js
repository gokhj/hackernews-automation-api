require("dotenv").config();
const axios = require("axios");

const InstaPaper = {
  sendStory(story) {
    const url = "https://www.instapaper.com/api/add";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    };
    // Some HackerNews stories do not have external links, just checking before POST
    if (story.url === undefined) {
      console.log(story);
      return false;
    }

    try {
      // Sending the story url encoded
      storyUrl = encodeURIComponent(story.url);

      axios({
        method: "POST",
        url: url,
        headers: headers,
        data: `${process.env.INSTAPAPER_CREDENTIALS}${storyUrl}`,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = InstaPaper;
