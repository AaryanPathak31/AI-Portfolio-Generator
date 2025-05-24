// backend/routes/portfolio.js
const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { email, githubProfile, linkedinProfile, resumeUrl, topProjects, blogLinks } = req.body;
    
    // Create user record
    const user = new User({
      email,
      githubProfile,
      linkedinProfile,
      topProjects,
      resumeUrl,
      blogLinks
    });
    
    await user.save();
    
    // Process with AI service
    const [resumeAnalysis, githubAnalysis] = await Promise.all([
      axios.post(`${process.env.AI_SERVICE_URL}/analyze-resume`, { resume_url: resumeUrl }),
      axios.post(`${process.env.AI_SERVICE_URL}/analyze-github`, { github_url: githubProfile })
    ]);
    
    // Update user with analysis
    user.portfolioData = {
      resumeAnalysis: resumeAnalysis.data,
      githubAnalysis: githubAnalysis.data,
      generatedAt: new Date()
    };
    
    await user.save();
    
    res.json({ success: true, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
