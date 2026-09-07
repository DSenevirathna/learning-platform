require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const gptRoutes = require("./routes/gptRoutes");

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/gpt", gptRoutes);

app.use((req, res) => {
	res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
	console.error(error);
	if (res.headersSent) return next(error);
	res.status(error.name === "ValidationError" ? 400 : 500).json({
		message: error.name === "ValidationError" ? error.message : "Internal server error.",
	});
});

async function startServer() {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is not configured.");
	}

	await connectDB();
	app.listen(port, () => {
		console.log(`Server running on http://localhost:${port}`);
	});
}

if (require.main === module) {
	startServer().catch((error) => {
		console.error("Server startup failed:", error.message);
		process.exit(1);
	});
}

module.exports = app;
