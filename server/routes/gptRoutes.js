const express = require("express");
const verifyToken = require("../middleware/auth");
const { getCourseRecommendations } = require("../controllers/gptController");

const router = express.Router();

router.post("/recommendations", verifyToken, getCourseRecommendations);

module.exports = router;
