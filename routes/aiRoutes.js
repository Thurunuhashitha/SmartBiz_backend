const express = require("express");
const { askAI } = require("../services/aiService.js");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// 1. Natural language reports: “How did I perform last month?” 
router.post("/report", verifyToken, async (req, res) => {
  try {
    const { timeframe, salesData, expenseData } = req.body;
    const companyId = req.user.id;
    
    // Constructing a detailed prompt using the provided data
    const prompt = `Generate a concise business performance report for the timeframe: ${timeframe}. 
    Here is the data:
    Sales: ${JSON.stringify(salesData)}
    Expenses: ${JSON.stringify(expenseData)}
    
    Please provide insights on profitability, main expense areas, and give 2-3 actionable recommendations. Format as plain text or simple markdown.`;

    const result = await askAI(prompt, companyId, 'report');
    res.json({ result });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Email generator for customer follow-ups or complaints 
router.post("/email", verifyToken, async (req, res) => {
  try {
    const { customerName, context, type } = req.body;
    const companyId = req.user.id;
    
    const prompt = `Write a professional ${type === 'complaint' ? 'apology and resolution' : 'follow-up'} email to a customer named ${customerName}. 
    Context: ${context}
    
    Keep it polite, concise, and aligned with standard business practices. Do not include placeholders like [Your Name] unless absolutely necessary, and sign off as "SmartBiz Team".`;

    const result = await askAI(prompt, companyId, 'email');
    res.json({ result });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Marketing post writer (“Write a Facebook post for new arrivals”)
router.post("/marketing", verifyToken, async (req, res) => {
  try {
    const { platform, productDetails, tone } = req.body;
    const companyId = req.user.id;
    
    const prompt = `Write a catchy ${platform} marketing post for the following product/update: 
    ${productDetails}
    
    Tone: ${tone || 'enthusiastic and professional'}
    Include relevant emojis and hashtags appropriate for ${platform}.`;

    const result = await askAI(prompt, companyId, 'marketing');
    res.json({ result });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Legacy generic ask endpoint
router.post("/ask", verifyToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    const companyId = req.user.id;
    const result = await askAI(prompt, companyId);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;