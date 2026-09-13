const express = require("express");
const verifyToken = require("../middleware/auth");
const checkRole = require("../middleware/roles");
const {
	getEnrolledCourses,
	updateCourseProgress,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/enrolled", verifyToken, checkRole(["student"]), getEnrolledCourses);
router.put(
	"/progress/:id",
	verifyToken,
	checkRole(["student"]),
	updateCourseProgress,
);

module.exports = router;
