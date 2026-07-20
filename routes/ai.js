// routes/ai.js
const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client with API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 11. API: Gemini AI Pet Care & Feeding Routine Generator
router.post('/care-plan', async (req, res) => {
  try {
    const { petType, breed, age, dietaryNotes } = req.body;

    if (!petType || !breed) {
      return res.status(400).json({ error: 'Please provide petType and breed.' });
    }

    const prompt = `You are an expert avian and small animal veterinarian at Eden Nest Pets. 
Provide a concise, 3-step daily care and feeding routine for a ${age || 'young'} ${breed} (${petType}). 
Dietary notes provided by owner: ${dietaryNotes || 'None'}.
Format the output as a simple bulleted list with clear, actionable advice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({
      petType,
      breed,
      recommendations: response.text,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate care routine: ' + error.message });
  }
});

module.exports = router;