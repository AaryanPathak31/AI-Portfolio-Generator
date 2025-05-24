// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  githubProfile: String,
  linkedinProfile: String,
  topProjects: [String],
  resumeUrl: String,
  blogLinks: [String],
  portfolioData: {
    skills: [{ name: String, level: Number }],
    projects: [Object],
    atsScore: Number,
    generatedContent: Object
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
