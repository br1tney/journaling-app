const express = require('express');
const router = express.Router();

// Simple auth verification endpoint
router.post('/verify', async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }
    
    // In a real implementation, you would verify the JWT token here
    // For now, we'll just return success if token exists
    res.json({ valid: true, user: { username: 'user' } });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
