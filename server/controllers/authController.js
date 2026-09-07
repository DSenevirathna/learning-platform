const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
	return jwt.sign(
		{ id: user._id.toString(), role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "7d" }
	);
}

function publicUser(user) {
	return {
		id: user._id,
		username: user.username,
		role: user.role,
	};
}

async function signup(req, res, next) {
	try {
		const { username, password, role = "student" } = req.body;

		if (!username || !password) {
			return res.status(400).json({ message: "Username and password are required." });
		}

		if (!["student", "instructor"].includes(role)) {
			return res.status(400).json({ message: "Invalid role." });
		}

		const existingUser = await User.findOne({ username: username.trim() });
		if (existingUser) {
			return res.status(409).json({ message: "Username is already registered." });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await User.create({
			username: username.trim(),
			password: hashedPassword,
			role,
		});

		res.status(201).json({ user: publicUser(user), token: createToken(user) });
	} catch (error) {
		next(error);
	}
}

async function login(req, res, next) {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username: username?.trim() });

		if (!user || !(await bcrypt.compare(password || "", user.password))) {
			return res.status(401).json({ message: "Invalid username or password." });
		}

		res.json({ user: publicUser(user), token: createToken(user) });
	} catch (error) {
		next(error);
	}
}

module.exports = { signup, login };
