/**
 * @swagger
 *  components:
 *    schemas:
 *      News:
 *        type: object
 *        required:
 *          - _id
 *          - title
 *          - url
 *          - score
 *        properties:
 *          id:
 *            type: string
 *            description: Unique id of the story.
 *          title:
 *            type: string
 *            description: Title of the story.
 *          url:
 *            type: string
 *            description: The original url of the story.
 *          score:
 *            type: integer
 *            description: HackerNews user score.
 *        example:
 *           _id: 5fafa01ef6947c08d0df70a1
 *           title: Your Computer Isn't Yours
 *           url: https://sneak.berlin/20201112/your-computer-isnt-yours/
 *           score: 1411
 */

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
