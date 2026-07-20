// routes/ai.js
const express = require('express');
const router = express.Router();

router.post('/care-plan', async (req, res) => {
  const { petType, breed, age, dietaryNotes } = req.body;

  if (!petType || !breed) {
    return res.status(400).json({ error: 'Please provide petType and breed.' });
  }

  try {
    const prompt = `You are an expert veterinarian at Eden Nest Pets. 
Provide a concise, 3-step daily care and feeding routine for a ${age || 'young'} ${breed} (${petType}). 
Dietary notes: ${dietaryNotes || 'None'}.
Format as a clear bulleted list.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openrouter/free', // Uses the active auto-router for free models
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter Error Response:', data);
      throw new Error(data.error?.message || `HTTP ${response.status} Error`);
    }

    return res.status(200).json({
      petType,
      breed,
      recommendations: data.choices[0].message.content,
    });
  } catch (error) {
    console.error('AI Processing Error:', error.message);

    const fallbackCarePlan = `• Morning: Feed high-quality pellet/seed mix tailored for ${breed} (${petType}) along with fresh, clean water.
• Afternoon: Provide fresh greens, fruit treats, or forage enrichment according to ${dietaryNotes || 'dietary needs'}.
• Evening: Perform daily cage/habitat check, clean water dishes, and monitor overnight behavior.`;

    return res.status(200).json({
      petType,
      breed,
      recommendations: fallbackCarePlan,
      note: 'Fallback active due to network/API limit.'
    });
  }
});

module.exports = router;