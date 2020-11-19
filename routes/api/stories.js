const express = require("express");
const router = express.Router();

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const {
  getTopStories,
  getAllStories,
  searchStories,
  getHigherScore,
} = require("../../helpers/data");

// Route to provide all stories that has more than 100 score
router.get("/all", async (req, res) => {
  /**
   * @swagger
   * tags:
   *   name: All
   *   description: Get all the stories with more than 100 upvotes.
   */

  /**
   * @swagger
   * paths:
   *  /all/:
   *    get:
   *      summary: Get all stories
   *      tags: [All]
   *      responses:
   *        "200":
   *          description: Array of news
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/News'
   */
  res.json(await getAllStories());
});

router.get("/top", async (req, res) => {
  /**
   * @swagger
   * tags:
   *   name: Top
   *   description: Get top stories by descending order.
   */

  /**
   * @swagger
   * paths:
   *  /top/:
   *    get:
   *      summary: Get top stories
   *      tags: [Top]
   *      responses:
   *        "200":
   *          description: Array of news
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/News'
   */
  res.json(await getTopStories());
});

// Route to provide stories that has higher score than the specified amount
router.get("/score/:score", async (req, res) => {
  /**
   * @swagger
   * tags:
   *   name: Score
   *   description: Return the stories more than the specified score.
   */

  /**
   * @swagger
   * paths:
   *  /score/{score}:
   *    get:
   *      summary: Get stories with the bottom limit
   *      tags: [Score]
   *      parameters:
   *        - in: path
   *          name: score
   *          schema:
   *            type: integer
   *          required: true
   *          description: Bottom limit
   *      responses:
   *        "200":
   *          description: Array of news
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/News'
   */
  res.json(await getHigherScore(req.params.score));
});

// Search keywords
router.get("/search/:keyword", async (req, res) => {
  /**
   * @swagger
   * tags:
   *   name: Search
   *   description: Look for the stories that has <keyword> in it.
   */

  /**
   * @swagger
   * paths:
   *  /search/{term}:
   *    get:
   *      summary: Search for keys
   *      tags: [Search]
   *      parameters:
   *        - in: path
   *          name: term
   *          schema:
   *            type: string
   *          required: true
   *          description: Search key
   *      responses:
   *        "200":
   *          description: Array of news
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/News'
   */
  res.json(await searchStories(req.params.keyword.toLowerCase()));
});

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "HackerNews Stories API Wrapper",
      version: "1.1.0",
      description:
        "<a href='/'>Go back</a><br/>Welcome to the Stories API. You can use below routes to check stories on HackerNews.",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/",
      },
      contact: {
        name: "Gökhan Arkan",
        url: "https://gokhanarkan.com",
        email: "gokhan@hey.com",
      },
    },
    servers: [
      {
        url: "/api/",
      },
    ],
  },
  apis: ["./models/news.js", "./routes/api/stories.js"],
};
const specs = swaggerJsdoc(options);
router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: false,
  })
);

module.exports = router;
