const mongoose = require("mongoose");
const Course = require("../models/Course");

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function createCourse(req, res, next) {
  try {
    const { title, description, content } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }

    const course = await Course.create({
      title: title.trim(),
      description,
      content,
      instructor: req.user.id,
    });

    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
}

async function getCourses(req, res, next) {
  try {
    const courses = await Course.find()
      .populate("instructor", "username role")
      .sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    next(error);
  }
}

async function getCourse(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "username role",
    );
    if (!course) return res.status(404).json({ message: "Course not found." });

    res.json({ course });
  } catch (error) {
    next(error);
  }
}

async function updateCourse(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not own this course." });
    }

    const { title, description, content } = req.body;
    if (title !== undefined) {
      if (!title.trim())
        return res.status(400).json({ message: "Title is required." });
      course.title = title.trim();
    }
    if (description !== undefined) course.description = description;
    if (content !== undefined) course.content = content;
    await course.save();

    res.json({ course });
  } catch (error) {
    next(error);
  }
}

async function deleteCourse(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not own this course." });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted." });
  } catch (error) {
    next(error);
  }
}

async function getInstructorCourses(req, res, next) {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("enrolledStudents", "username role")
      .sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    next(error);
  }
}

async function enrollInCourse(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { enrolledStudents: req.user.id } },
      { returnDocument: "after" },
    );
    if (!course) return res.status(404).json({ message: "Course not found." });

    res.json({ message: "Enrollment successful.", course });
  } catch (error) {
    next(error);
  }
}

async function getEnrolledCourses(req, res, next) {
  try {
    const courses = await Course.find({ enrolledStudents: req.user.id })
      .populate("instructor", "username role")
      .sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  enrollInCourse,
  getEnrolledCourses,
};
