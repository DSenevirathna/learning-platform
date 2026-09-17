const OpenAI = require("openai");
const Course = require("../models/Course");

const apiKey = process.env.OPENAI_API_KEY?.replace(/\s+/g, "");

const openai = apiKey ? new OpenAI({ apiKey }) : null;
let requestCount = 0;
const REQUEST_LIMIT = 250;

function pickBestMatches(availableCourses, prompt) {
  const query = prompt.toLowerCase();
  const terms = [...new Set(query.split(/\s+/).filter(Boolean))];

  return availableCourses
    .map((course) => {
      const searchable =
        `${course.title || ""} ${course.description || ""}`.toLowerCase();
      let score = 0;

      terms.forEach((term) => {
        if (searchable.includes(term)) {
          score += 2;
        }
      });

      if (course.title && course.title.toLowerCase().includes(query)) {
        score += 5;
      }

      return { course, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ course }) => ({
      _id: course._id,
      title: course.title,
      description: course.description,
    }));
}

function parseRecommendations(rawContent, availableCourses, prompt) {
  if (!rawContent) {
    return pickBestMatches(availableCourses, prompt);
  }

  const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return pickBestMatches(availableCourses, prompt);
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed) || !parsed.length) {
      return pickBestMatches(availableCourses, prompt);
    }

    return parsed
      .filter((item) => item && item.title)
      .map((item) => ({
        _id: item._id || item.id || item.title,
        title: item.title,
        description:
          item.description ||
          "A focused course designed to help you build practical skills.",
      }))
      .slice(0, 3);
  } catch (error) {
    return pickBestMatches(availableCourses, prompt);
  }
}

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

  requestCount += 1;

  try {
    const availableCourses = await Course.find({}, "title description").lean();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI advisor for an e-learning platform. Recommend up to 3 relevant courses from the exact list below. Return only valid JSON array entries with _id, title, and description fields. Use only course titles and descriptions from the provided list; do not invent courses. ${JSON.stringify(availableCourses)}`,
        },
        { role: "user", content: prompt.trim() },
      ],
      max_tokens: 250,
    });

    const content = response.choices[0]?.message?.content || "";
    const recommendations = parseRecommendations(
      content,
      availableCourses,
      prompt,
    );

    res.json({
      recommendations,
      requestsRemaining: REQUEST_LIMIT - requestCount,
    });
  } catch (error) {
    if (error.status === 401 || error.code === "invalid_api_key") {
      return res.status(503).json({
        message:
          "The AI service is not configured correctly. Please contact the administrator.",
      });
    }

    if (error.status === 429) {
      return res.status(503).json({
        message:
          "The AI service is temporarily unavailable. Please try again later.",
      });
    }

    next(error);
  }
}

module.exports = { getCourseRecommendations };
