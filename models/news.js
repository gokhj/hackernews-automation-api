require("dotenv").config();
const mongoose = require("mongoose");
// Connecting db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("db connected");
});

// Model schema for the database
const newSchema = new mongoose.Schema({
  title: String,
  url: String,
  score: Number,
});

const News = mongoose.model("news", newSchema);

module.exports = News;
