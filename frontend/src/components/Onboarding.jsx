// frontend/src/components/Onboarding.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    email: '',
    githubProfile: '',
    linkedinProfile: '',
    topProjects: ['', '', ''],
    blogLinks: [''],
    resume: null
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload resume first
      const formDataObj = new FormData();
      formDataObj.append('resume', formData.resume);
      
      const uploadResponse = await axios.post('/api/upload/resume', formDataObj);
      
      // Submit all data for processing
      const response = await axios.post('/api/portfolio/create', {
        ...formData,
        resumeUrl: uploadResponse.data.url
      });
      
      console.log('Portfolio creation started:', response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white text-center mb-8"
        >
          Create Your AI-Powered Portfolio
        </motion.h1>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 space-y-6"
        >
          {/* Form fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">GitHub Profile</label>
              <input
                type="url"
                value={formData.githubProfile}
                onChange={(e) => setFormData({...formData, githubProfile: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70"
                placeholder="https://github.com/username"
                required
              />
            </div>
          </div>
          
          {/* Resume upload */}
          <div>
            <label className="block text-white mb-2">Resume (PDF/DOC)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
              className="w-full p-3 rounded-lg bg-white/20 text-white"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Generate My Portfolio'}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default Onboarding;
