const axios = require("axios");

const News = require("../models/news");

const RegularJob = {
  // Getting daily top stories
  getDailyStories() {
    const link = `${process.env.API_LINK}topstories.json?print=pretty`;
    return axios.get(link);
  },
  // Inspecting stories individually
  getIndividualStory(id) {
    const link = `${process.env.API_LINK}item/${id}.json?print=pretty`;
    return axios.get(link);
  },
  // Method to run above two functions
  getData() {
    this.getDailyStories()
      .then((response) => {
        response.data.forEach((item) => {
          this.getIndividualStory(item)
            .then((response) => {
              const data = response.data;
              if (data.score > 100 && data.type === "story") {
                this.insertDB({
                  title: data.title,
                  url: data.url,
                  score: data.score,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              return false;
            });
        });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  },
  // Insert entries to DB
  insertDB(new_data) {
    const entry = new News(new_data);
    entry.save();
  },
  // Delete the DB fields
  deleteDB() {
    News.deleteMany({}, (err, data) => {
      if (err) return false;
      return true;
    });
  },
};

module.exports = RegularJob;
