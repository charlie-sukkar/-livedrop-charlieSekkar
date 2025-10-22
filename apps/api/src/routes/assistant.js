const express = require('express');
const router = express.Router();
const dashboard = require('./dashboard');

console.log('🔄 Loading Assistant Routes...');

let assistant = null;
let assistantAvailable = false;

try {
  const AssistantEngine = require('../assistant/engine');
  assistant = new AssistantEngine();
  assistantAvailable = true;
  console.log('✅ Assistant engine initialized successfully');
} catch (error) {
  console.error('❌ Assistant engine failed to load:', error.message);
  assistantAvailable = false;
}

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: assistantAvailable ? 'assistant-engine-available' : 'assistant-engine-unavailable',
    message: assistantAvailable ? 'Assistant is fully operational' : 'Assistant engine is unavailable',
    timestamp: new Date().toISOString()
  });
});


router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Assistant routes are working!',
    assistantAvailable: assistantAvailable,
    timestamp: new Date().toISOString()
  });
});


router.get('/intents', (req, res) => {
  if (assistantAvailable && assistant.intentClassifier?.keywordPatterns) {
    const intents = Object.keys(assistant.intentClassifier.keywordPatterns);
    res.json({ success: true, data: { intents } });
  } else {
    res.json({ 
      success: true, 
      data: { intents: ['policy_question', 'order_status', 'product_search', 'complaint', 'chitchat', 'off_topic', 'violation'] }
    });
  }
});

router.post('/generate', async (req, res) => {
  if (!assistantAvailable) {
    return res.status(503).json({
      success: false,
      error: 'Assistant engine is not available',
      message: 'The AI assistant service is currently unavailable.'
    });
  }

  const startTime = Date.now();

  try {
    const { message, context = {} } = req.body;

    console.log('🤖 Processing message:', message);

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    const result = await assistant.processMessage(message, context);
    
    
    const responseTime = Date.now() - startTime;

 
    dashboard.trackAssistantQuery(
      result.intent,                    
      result.functionsCalled || [],     
      responseTime                      
    );

    res.json({
      success: true,
      data: {
        text: result.response,
        intent: result.intent,
        citations: result.citations?.validCitations || [],
        functionsCalled: result.functionsCalled || [],
        timestamp: result.timestamp,
        metadata: result.metadata
      }
    });
  } catch (error) {
    console.error('Assistant generate error:', error);
    
    const responseTime = Date.now() - startTime;
    
    dashboard.trackAssistantQuery(
      'error',       
      [],             
      responseTime    
    );

    res.status(500).json({
      success: false,
      error: 'Failed to process message: ' + error.message
    });
  }
});

console.log('✅ Assistant routes loaded successfully');
module.exports = router;