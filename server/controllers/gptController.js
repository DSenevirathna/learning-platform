const OpenAI = require("openai");
const Course = require("../models/Course");

const openai = process.env.OPENAI_API_KEY
	? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
	: null;
let requestCount = 0;
const REQUEST_LIMIT = 250;

async function getCourseRecommendations(req, res, next) {
	if (!openai) {
		return res.status(503).json({ message: "OpenAI is not configured." });
	}
	if (requestCount >= REQUEST_LIMIT - 5) {
		return res.status(429).json({ message: "API request limit reached." });
	}

	const prompt = req.body?.prompt;
	if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
		return res.status(400).json({ message: "A prompt is required." });
	}

	try {
		const availableCourses = await Course.find({}, "title description").lean();
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: `You are an AI advisor for an e-learning platform. Recommend relevant courses from this list: ${JSON.stringify(availableCourses)}.`,
				},
				{ role: "user", content: prompt.trim() },
			],
			max_tokens: 250,
		});

		requestCount += 1;
		res.json({
			recommendations: response.choices[0]?.message?.content || "No recommendations available.",
			requestsRemaining: REQUEST_LIMIT - requestCount,
		});
	} catch (error) {
		next(error);
	}
}

module.exports = { getCourseRecommendations };
