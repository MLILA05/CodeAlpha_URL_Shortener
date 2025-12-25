const shortid = require("shortid");
const Url = require("../models/Url");

// Create short URL
exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ message: "URL is required" });
  }

  const shortCode = shortid.generate();

  try {
    const newUrl = await Url.create({ originalUrl, shortCode });
    res.status(201).json({
      shortUrl: `${req.protocol}://${req.get("host")}/${newUrl.shortCode}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Redirect short URL
exports.redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
