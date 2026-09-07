const express = require("express");
const verifyToken = require("../middleware/auth");
const checkRole = require("../middleware/roles");
const {
	createCourse,
	getCourses,
	getCourse,
	updateCourse,
	deleteCourse,
	getInstructorCourses,
	enrollInCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses);
router.get("/instructor/my-courses", verifyToken, checkRole(["instructor"]), getInstructorCourses);
router.post("/", verifyToken, checkRole(["instructor"]), createCourse);
router.get("/:id", getCourse);
router.put("/:id", verifyToken, checkRole(["instructor"]), updateCourse);
router.delete("/:id", verifyToken, checkRole(["instructor"]), deleteCourse);
router.post("/:id/enroll", verifyToken, checkRole(["student"]), enrollInCourse);

module.exports = router;
