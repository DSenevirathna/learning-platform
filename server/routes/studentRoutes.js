const express = require("express");
const verifyToken = require("../middleware/auth");
const checkRole = require("../middleware/roles");
const { getEnrolledCourses } = require("../controllers/courseController");

const router = express.Router();

router.get("/enrolled", verifyToken, checkRole(["student"]), getEnrolledCourses);

module.exports = router;
