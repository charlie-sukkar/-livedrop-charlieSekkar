
const IntentClassifier = require('./intent-classifier');
const FunctionRegistry = require('./function-registry');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const fetch = require('node-fetch');

class AssistantEngine {
  constructor() {

      console.log('🔍 DEBUG CONFIG LOADING...');
  this.config = this.loadConfig();
  console.log('🔍 CONFIG LOADED:', {
    hasIdentity: !!this.config.identity,
    identity: this.config.identity,
    hasRules: !!this.config.rules,
    rulesCount: this.config.rules?.length
  });

    this.intentClassifier = new IntentClassifier();
    this.functionRegistry = new FunctionRegistry();
    
    this.config = this.loadConfig();
    this.knowledgeBase = this.loadKnowledgeBase();
    this.conversationMemory = new Map();
    
   
    this.functionCallCount = 0;
    this.maxFunctionCalls = 2;
    this.requestTimeout = 60000;

   
    this.globalStats = {
      intents: {
        policy_question: 0,
        order_status: 0,
        product_search: 0,
        complaint: 0,
        chitchat: 0,
        off_topic: 0,
        violation: 0,
        error: 0
      },
      functions: {
        getOrderStatus: 0,
        searchProducts: 0,
        getCustomerOrders: 0,
        getPolicyInfo: 0
      },
      responseMethods: {
        llmCalls: 0,
        directResponses: 0,
        fallbackResponses: 0
      },
      totalQueries: 0,
      successfulFunctionCalls: 0,
      failedFunctionCalls: 0
    };
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, '../../../../docs/prompts.yaml');
      console.log('📄 Config path:', configPath);
      
      if (!fs.existsSync(configPath)) {
        console.warn('❌ YAML config not found, using defaults');
        return this.getDefaultConfig();
      }
      
      const configFile = fs.readFileSync(configPath, 'utf8');
      const yamlConfig = yaml.load(configFile);
      
      
      const config = {
        identity: yamlConfig.identity || this.getDefaultConfig().identity,
        intents: yamlConfig.intents || this.getDefaultConfig().intents,
        rules: yamlConfig.rules || yamlConfig.general_guidelines || this.getDefaultConfig().rules
      };
      
      console.log('✅ Config loaded successfully');
      return config;
    } catch (error) {
      console.warn('❌ Error loading config:', error.message);
      return this.getDefaultConfig();
    }
  }

  loadKnowledgeBase() {
    try {
      const kbPath = path.join(__dirname, '../../../../docs/ground-truth.json');
      console.log('📁 Knowledge base path:', kbPath);
      
      if (!fs.existsSync(kbPath)) {
        console.warn('❌ Knowledge base not found, using empty array');
        return [];
      }
      
      const kbData = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
      console.log(`✅ Loaded ${kbData.length} policies from knowledge base`);
      return kbData;
    } catch (error) {
      console.warn('❌ Error loading knowledge base:', error);
      return [];
    }
  }

  getDefaultConfig() {
    return {
      identity: {
        name: "Lin",
        role: "Customer Support Specialist",
        personality: "friendly, professional, empathetic",
        tone: "friendly, professional, empathetic",
      },
      intents: {
        policy_question: {
          behavior: "Provide accurate policy information with proper citations",
          grounding_required: true
        },
        order_status: {
          behavior: "Use function calling to get real order data",
          grounding_required: true
        },
        product_search: {
          behavior: "Use function calling to search products",
          grounding_required: true
        },
        complaint: {
          behavior: "Show genuine empathy and provide solutions",
          grounding_required: false
        },
        chitchat: {
          behavior: "Be friendly but steer back to business",
          grounding_required: false
        },
        off_topic: {
          behavior: "Politely redirect to relevant topics",
          grounding_required: false
        },
        violation: {
          behavior: "Maintain professionalism and boundaries",
          grounding_required: false
        }
      },
      rules: [
        "Never reveal you are an AI or mention llama",
        "Always maintain your identity as a human support specialist",
        "Use polite and professional language",
        "Provide citations from policies when relevant using [PolicyID]",
        "Keep responses concise and to the point",
        "Do not hallucinate information",
        "ONLY use citations that exactly match provided policy IDs",
        "NEVER invent or make up policy IDs",
        "Provide ONLY the direct answer to the user's question",
        "Do NOT continue with fake conversations or follow-up questions",
        "Stop immediately after answering the question"
      ]
    };
  }

  async processMessage(userInput, context = {}) {
    const startTime = Date.now();
    
    try {
      this.globalStats.totalQueries++;
      this.functionCallCount = 0; 

      const intent = this.classifyIntent(userInput);
      console.log(`🎯 Classified intent: ${intent.intent}`);

      const functionResults = await this.executeIntentFunctions(intent, userInput, context);
      const relevantPolicies = this.findRelevantPolicies(userInput);
      
      console.log(`📚 Found ${relevantPolicies.length} relevant policies`);


      let response;
      const shouldUseLLM = this.shouldUseLLM(intent, userInput, functionResults);
      
      if (shouldUseLLM) {
        console.log('🤖 Using LLM for response');
        this.globalStats.responseMethods.llmCalls++;
        response = await this.generateLLMResponse(userInput, intent, relevantPolicies, functionResults, context);
      } else {
        console.log('⚡ Using direct response');
        this.globalStats.responseMethods.directResponses++;
        response = this.generateDirectResponse(userInput, intent, relevantPolicies, functionResults, context);
      }

      const validPolicyIds = this.knowledgeBase.map(policy => policy.id);
      const cleanedResponse = this.cleanResponse(response, validPolicyIds);
      const validatedResponse = cleanedResponse;
      const citationValidation = this.validateCitations(validatedResponse);

      this.updateConversationMemory(context.email, userInput, validatedResponse);

      return {
        intent: intent.intent,
        response: validatedResponse, 
        citations: citationValidation,
        relevantPolicies: relevantPolicies.map(p => p.id),
        functionsCalled: functionResults.filter(r => r.success).map(r => r.functionName), 
        timestamp: new Date().toISOString(),
        metadata: {
          processingTime: Date.now() - startTime,
          userIdentified: !!context.email,
          usedLLM: shouldUseLLM,
          confidence: intent.confidence
        }
      };

    } catch (error) {

      this.globalStats.intents.error++;
      this.globalStats.responseMethods.fallbackResponses++;
      console.error('❌ Error in processMessage:', error);
      return this.getErrorResponse(error);
    }
  }

  shouldUseLLM(intent, userInput = '', functionResults = []) {
    const llmIntents = ['policy_question', 'order_status', 'product_search'];
    
    if (functionResults.length > 0 && functionResults.some(r => r.success)) {
      return true;
    }
    
    return llmIntents.includes(intent.intent);
  }

  generateDirectResponse(userInput, intent, relevantPolicies, functionResults, context) {
    console.log('⚡ Generating direct response for:', intent.intent);
    
    switch (intent.intent) {
      case 'chitchat':
        return this.getChitchatResponse(userInput);
      case 'off_topic':
        return "I'm support assistant, lin, here to help you with clothing store related questions like orders, returns, products, and policies. Is there anything I can assist you with regarding our store?";
      case 'violation':
        return "I'm here to provide helpful and professional support. If you're experiencing any issues, I'd be happy to help resolve them. Could you please let me know how I can assist you today?";
      case 'complaint':
        return this.getComplaintResponse(userInput);
      default:
        return this.getFallbackResponse(userInput);
    }
  }

  getChitchatResponse(userInput) {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm Lin, your clothing store support specialist. How can I assist you with returns, orders, or product information today?";
    } else if (input.includes('how are you') || input.includes("how's it going")) {
      return "I'm doing well, thank you for asking! I'm here to help you with any questions about our store. What can I assist you with today?";
    } else if (input.includes('name') || input.includes('who are you') || input.includes('Introduce yourself')) {
      return "I'm Lin, your dedicated customer support specialist at our clothing store. I'm here to help you with orders, returns, and any other questions you might have!";
    } else if (input.includes('thank') || input.includes('thanks')) {
      return "You're welcome! Is there anything else I can help you with today?";
    } else if (input.includes('help') || input.includes('what can you')) {
      return "I can help you track orders, search products, check return policies, and answer questions about our clothing store. What would you like assistance with?";
    } else if (input.includes('hours') || input.includes('open') || input.includes('close')) {
      return "Our customer support is available 24/7 for online assistance! For specific store hours, please check our website location details.";
    } else if (input.includes('contact') || input.includes('phone') || input.includes('email')) {
      return "I'm your digital assistant Lin! For immediate complex issues, you can also email support@store.com. What can I help you with today?";
    } else if(input.includes('who created you')){
      return "I was created by Fresh Fit to help you shop smarter, faster, and easier!";
    } else {
      return "Hello! I'm Lin from customer support. How can I assist you with our clothing store today?";
    }
  }

  getComplaintResponse(userInput) {
    const input = userInput.toLowerCase();
    
    if (input.includes('late') || input.includes('delayed') || input.includes('waiting')) {
      return "I understand your order is delayed and apologize for the inconvenience. Could you share your order ID so I can check the current status and provide an updated delivery estimate?";
    } else if (input.includes('broken') || input.includes('damaged') || input.includes('defective')) {
      return "I'm sorry to hear the item arrived damaged. We'll gladly replace it or process a refund. Please share your order details and photos if possible.";
    } else if (input.includes('wrong') || input.includes('incorrect') || input.includes('not what')) {
      return "I apologize that you received the wrong item. I can help you get the correct product. Could you provide your order ID and let me know what you received vs. what you ordered?";
    } else if (input.includes('return') || input.includes('refund') && input.includes('not')) {
      return "I understand your return/refund hasn't been processed as expected. Please share your order ID and I'll investigate the status immediately.";
    } else if (input.includes('order') || input.includes('delivery') || input.includes('shipping') || input.includes('unhappy')) {
      return "I understand you're having issues with your order. I'd be happy to help resolve this. Could you please provide your order ID or email address so I can look into this for you?";
    } else if (input.includes('return') || input.includes('refund')) {
      return "I'm sorry to hear you're having issues with a return. Our return policy allows returns within 30 days. Please share your order details and I'll help you get this sorted out.";
    } else if (input.includes('product') || input.includes('item') || input.includes('quality')) {
      return "I apologize for any issues with our products. Could you please share more details about the problem? I'll do my best to help resolve this for you.";
    } else {
      return "I'm sorry you're experiencing issues. To help you best, could you share your order ID and specific details about what went wrong?";
    }
  }

async executeIntentFunctions(intent, userInput, context = {}) {
  const results = [];
  
  if (this.functionCallCount >= this.maxFunctionCalls) {
    return results;
  }

  try {
    const params = this.extractFunctionParameters(intent, userInput, context);
    
    if (intent.intent === 'order_status') {
      if ((userInput.toLowerCase().includes('recent orders') || 
           userInput.toLowerCase().includes('my orders') ||
           userInput.toLowerCase().includes('order history')) && 
          context.customerId && 
          this.functionCallCount < this.maxFunctionCalls) {
        
        const result = await this.handleFunctionCall('getCustomerOrders', { 
          customerId: context.customerId, 
          limit: 5 
        });
        results.push(result);
      }
      
      if (params.orderId && this.functionCallCount < this.maxFunctionCalls) {
        const result = await this.handleFunctionCall('getOrderStatus', { 
          orderId: params.orderId 
        });
        results.push(result);
      }
    }
    
    if (intent.intent === 'product_search' && 
        (userInput.toLowerCase().includes('search') || 
         userInput.toLowerCase().includes('show me') || 
         userInput.toLowerCase().includes('looking for') ||
         userInput.toLowerCase().includes('find'))) {
      
      const searchQuery = this.extractSearchQuery(userInput);
      if (searchQuery && this.functionCallCount < this.maxFunctionCalls) {
        const result = await this.handleFunctionCall('searchProducts', { 
          query: searchQuery,
          limit: 5
        });
        results.push(result);
      }
    }
    
    
  } catch (error) {
    console.error(`❌ Function execution for ${intent.intent} failed:`, error);
  }
  
  return results;
}
  extractFunctionParameters(intent, userInput, context = {}) {
    const params = {};
    
    switch (intent.intent) {
      case 'order_status':
        params.orderId = this.extractOrderId(userInput);
        params.customerId = context.customerId || context.email;
        break;
      case 'product_search':
        params.query = this.extractSearchQuery(userInput);
        break;
      case 'policy_question':
        params.category = this.extractPolicyCategory(userInput);
        break;
    }
    
    return params;
  }

extractOrderId(input) {

  const patterns = [
    /(?:order|order number|order id|orderid|#|track|status of|where is)[:\s]*(ord_\d+_[a-zA-Z0-9]{9,})/i,
    
    /(ord_\d+_[a-zA-Z0-9]{9,})/i,

    /\b(ord_[a-zA-Z0-9_]{10,})\b/i  
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const extracted = match[1] ? match[1].trim() : match[0].trim();
      console.log(`🔍 Order ID extracted: ${extracted}`);
      return extracted;
    }
  }
  
  return null;
}

extractSearchQuery(input) {
  console.log(`🔍 RAW INPUT: "${input}"`);
  
  const searchPatterns = [
    /(?:search|find|look for|show me|looking for|have|got|carry|sell)\s+(?:for\s+)?(.+)/i,
    /(?:can you|do you)\s+(?:show me|find|search for|have)\s+(.+)/i,
    /(?:what|which|where).*?\s+(?:do you have|can i find|are available)\s+(.+)/i,
    /(?:i need|i want|i'm looking for)\s+(.+)/i,
    /(?:what|which)\s+(.+?)(?:\?|$)/i
  ];
  
  let extracted = input;
  
  for (const pattern of searchPatterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      extracted = match[1];
      break;
    }
  }
  
  // 🚨 COMPREHENSIVE CLEANING
  let cleaned = extracted
    .replace(/\?/g, '')
    .replace(/^\s*(?:a|some|any|the)\s+/i, '')
    .trim();
  
  // 🚨 REMOVE TRAILING PHRASES (FIXED)
  const trailingPatterns = [
    // Remove question phrases at the end
    /\s+(?:do you have|are there|can you find|do you carry|do you sell).*$/i,
    
    // Remove generic clothing terms ONLY if at the end and not part of product name
    /\s+(?:clothes|clothing|wear|apparel|items|products)$/i,
    
    // Remove stock/availability phrases
    /\s+(?:in stock|available|in store|online|on sale)$/i,
    
    // Remove "for X" phrases
    /\s+for\s+(?:me|women|men|kids|children)$/i,
    
    // Remove polite endings
    /\s+(?:please|thanks|thank you|pls|plz)$/i
  ];
  
  trailingPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // 🚨 PRESERVE PRODUCT NAMES THAT INCLUDE THESE WORDS
  // If the cleaned result becomes too short, maybe it was part of the product name
  const words = cleaned.split(/\s+/);
  if (words.length === 1 && ['wear', 'clothes', 'clothing'].includes(words[0].toLowerCase())) {
    // Single word that got trimmed - restore original context
    cleaned = extracted.replace(/\?/g, '').trim();
  }
  
  cleaned = cleaned.replace(/^for\s+/i, '').trim();
  
  console.log(`🔍 Query extraction: "${input}" → "${cleaned}"`);
  
  // Final validation
  return cleaned.length >= 2 && cleaned.length < 100 ? cleaned : null;
}

 extractPolicyCategory(input) {
  const inputLower = input.toLowerCase();
  const categories = {
    'returns': ['return', 'refund', 'exchange', 'send back'],
    'shipping': ['shipping', 'delivery', 'ship', 'track', 'tracking', 'international'],
    'payment': ['payment', 'credit card', 'debit card', 'pay', 'billing'],
    'discounts': ['discount', 'student', 'promo', 'coupon', 'sale'],
    'privacy': ['privacy', 'data', 'personal', 'information'],
    'security': ['security', 'secure', 'protection'],
    'support': ['support', 'contact', 'help', 'customer service']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => inputLower.includes(keyword))) {
      console.log(`🔍 Detected category: ${category} for: ${input}`);
      return category;
    }
  }

  console.log(`🔍 No specific category detected for: ${input}`);
  return null;
}

async generateLLMResponse(userInput, intent, relevantPolicies, functionResults, context) {

 


  const prompt = this.constructPrompt(userInput, intent, relevantPolicies, functionResults, context);
  
  console.log('\n🔍 DEBUG LLM INPUT:');
  console.log('User Input:', userInput);
  console.log('Intent:', intent.intent);
  console.log('Function Results Count:', functionResults.length);
  
  const productResults = functionResults.find(r => r.functionName === 'searchProducts' && r.success);
  if (productResults) {
    console.log('🔍 PRODUCT DATA SENT TO LLM:');
    console.log('Products found:', productResults.data.results?.length || 0);
    console.log('First product:', productResults.data.results?.[0] ? {
      name: productResults.data.results[0].name,
      price: productResults.data.results[0].price,
      inStock: productResults.data.results[0].inStock
    } : 'No products');
  } else {
    console.log('🔍 NO PRODUCT DATA FOUND');
  }
  
  console.log('Prompt (first 300 chars):', prompt.substring(0, 300));
  
  return await this.callLLM(prompt, intent.intent);
}

constructPrompt(userInput, intent, relevantPolicies, functionResults, context) {
  
  console.log('🚨 CONSTRUCT PROMPT DEBUG - ALL FUNCTION RESULTS:');
functionResults.forEach((result, index) => {
  console.log(`Function ${index}: ${result.functionName}`);
  console.log(`Success: ${result.success}`);
  console.log(`Data:`, JSON.stringify(result.data, null, 2));
  console.log('---');
});

  if (!this.config) {
    console.error('🚨 Config is undefined, using defaults');
    this.config = this.getDefaultConfig();
  }
  
  if (!this.config.rules || !Array.isArray(this.config.rules)) {
    console.error('🚨 Rules is not an array, using defaults');
    this.config.rules = this.getDefaultConfig().rules;
  }

  const identity = this.config.identity || this.getDefaultConfig().identity;
  const intentConfig = this.config.intents?.[intent.intent] || this.getDefaultConfig().intents[intent.intent];
  const rules = this.config.rules;

  let prompt = `You are ${identity.name}, a ${identity.role}.
Personality: ${identity.personality}
Tone: ${identity.tone}
Style: ${identity.style}

ABSOLUTE RULES:
${rules.map(rule => `• ${rule}`).join('\n')}

CURRENT INTENT: ${intent.intent}
INTENT BEHAVIOR: ${intentConfig?.behavior || 'Help the user appropriately'}

`;

  if (intentConfig?.response_format) {
    prompt += `RESPONSE FORMAT (MUST FOLLOW EXACTLY):
${intentConfig.response_format}

`;
  }

if (intent.intent === 'policy_question') {
  if (relevantPolicies.length === 0) {
    prompt += `CRITICAL: NO POLICY INFORMATION AVAILABLE
  
"I don't have specific policy information on this topic. Contact our support team for detailed assistance."

`;
  } else {

    const bestPolicy = relevantPolicies[0]; 
    
    prompt += `CRITICAL: YOU MUST USE THIS EXACT ANSWER

EXACT ANSWER TO COPY:
"${bestPolicy.answer} [${bestPolicy.id}]"

RULES:
1. Copy the EXACT text above including the [PolicyID]
2. DO NOT add any other text, questions, or explanations
3. DO NOT continue the conversation
4. DO NOT make up any information
5. STOP after providing the answer

EXAMPLE:
User: "What is your return policy?"
Response: "We accept returns within 30 days of delivery as long as the items are unused, unwashed, and include original tags and packaging [Policy1.1]"



`;
  }
}

  if (intent.intent === 'product_search') {
    const products = functionResults.find(r => r.functionName === 'searchProducts')?.data?.results || [];
    
    if (products.length > 0) {
      prompt += `CRITICAL: PRODUCT SEARCH - USE EXACT DATA PROVIDED, DO NOT ADD TEXT BEFORE


YOUR RESPONSE MUST FOLLOW THIS EXACT TEMPLATE:
I found ${products.length} product(s):

${products.map(p => `• ${p.name} - $${p.price} (${p.stock > 10 ? 'In Stock' : p.stock > 0 ? `Low Stock: Only ${p.stock} left` : 'Out of Stock'}) - ${p.description}`).join('\n')}

`;
    } else {
      prompt += `No products found matching your search.`;
    }
  }

if (intent.intent === 'order_status') {
  const singleOrderResult = functionResults.find(r => r.functionName === 'getOrderStatus');
  const customerOrdersResult = functionResults.find(r => r.functionName === 'getCustomerOrders');
  
  if (customerOrdersResult && customerOrdersResult.success && customerOrdersResult.data.orders && customerOrdersResult.data.orders.length > 0) {
    const orders = customerOrdersResult.data.orders.slice(0, 3);
    const orderList = orders.map(order => `${order.orderId} (${order.status}) - $${order.total}`).join(', ');
    
    prompt += `CRITICAL: RESPOND WITH EXACTLY THIS TEXT - USE PROVIDED DATA:
"You have ${customerOrdersResult.data.totalOrders} orders. Recent: ${orderList}. Use specific order IDs for detailed status."

DO NOT:
- Add any text before or after
- Format as JSON, lists, or tables
- Ask questions
- Continue the conversation

`;
    
  } else if (singleOrderResult && singleOrderResult.success) {
    const order = singleOrderResult.data;
    const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString();
    
    prompt +=`CRITICAL: RESPOND WITH EXACTLY THIS TEXT - NO ADDITIONAL CONTENT:
 "Your order ${order.orderId} is ${order.status}. Total: $${order.total}. Estimated delivery: ${deliveryDate} via ${order.carrier}."

 DO NOT:
- Add any text before or after
- Format as JSON, lists, or tables
- Ask questions
- Continue the conversation
`;
  }
  else {
    prompt+=`I can't track your order, Invalid order ID`;
  }
}

  const successfulResults = functionResults.filter(r => r.success);
  if (successfulResults.length > 0) {
    prompt += "FUNCTION RESULTS (USE THIS DATA):\n";
    successfulResults.forEach(result => {
      prompt += `${JSON.stringify(result.data, null, 2)}\n`;
    });
    prompt += "\n";
  }

  if (intentConfig?.example) {
    prompt += `EXAMPLE FROM YAML:
${intentConfig.example}

`;
  }

  prompt += `USER: "${userInput}"
${identity.name}:`;

  console.log('📝 Prompt length:', prompt.length);
  return prompt;
}

  async callLLM(prompt, intent=null) {
    const colabUrl = process.env.COLAB_LLM_ENDPOINT?.replace(/\/$/, '');
    console.log('🔍 LLM Endpoint being used:', colabUrl); // Add this log
    if (!colabUrl) {
      console.log('❌ No LLM endpoint configured');
      return this.getFallbackResponse(prompt);
    }

    try {
      console.log('🚀 Calling LLM...');
      const startTime = Date.now();
      
      const response = await fetch(`${colabUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt,
          max_tokens: 250,        
          temperature: 0.1,      
          top_p: 0.7,           
          repetition_penalty: 1.2, 

stop: [
  "USER:", "User:", "user:", "---", "===", "Please", "If you", "For more", 
  "Thank you", "Feel free", "Let me", "Happy to", "I'm here", "Additionally", 
  "However", "Note:", "CRITICAL:", "Remember,", "PolicyID", "Could you", 
  "Would you like", "Do you need", "Is there anything else", "Let me know if",
  "Absolutely!", "Sure thing!", "Of course!", "I'd be happy", "More details"
]
        }),
        timeout: this.requestTimeout
      });

      const responseTime = Date.now() - startTime;
      console.log(`⏱️  LLM response time: ${responseTime}ms`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      let llmResponse = data.text || data.response || '';
      
      return this.cleanLLMResponse(llmResponse, intent.intent);
      
    } catch (error) {
      console.log('❌ LLM call failed:', error.message);
      return this.getFallbackResponse(prompt);
    }
  }

cleanLLMResponse(response, intent = null) {
  if (!response) return this.getFallbackResponse();
  
  console.log('🛠️ RAW LLM RESPONSE:', response);
  
  let cleaned = response.trim();
  

const blacklist = [

  /RETURN POLICIES:[\s\S]*$/i,
  /FUNCTION RESULTS:[\s\S]*$/i,
   /RETURN_POLICY:[\s\S]*$/i,
  /Note:[\s\S]*$/i,   
   /Note:*$/i,
    /Note[\s\S]*$/i,
  /Please let me know.*$/i,
   /the user.*$/i,
  /his response provides clear.*$/i,
   /Please let us know.*$/i,
   /COPY.*$/i,
   /Please let us know if there’s anything else!.*$/i,
   /Please provide more detailed privacy practices if needed.*$/i,
  /if there is anything else I can assist.*$/i,
  /if there is anything else.*$/i,
  /anything else I can assist.*$/i,
  /I can assist you with.*$/i,
  /Do any of these items look interesting to you?\s*/i,
  /Your request has been processed successfully.\s*/i,
   /If you have any other queries or require further assistance,.\s*/i,
  /Would you like[\s\S]*$/i, 
  /Do you need[\s\S]*$/i,
  /Your query[\s\S]*$/i,
  /if you have[\s\S]*$/i,
  /Thank you![\s\S]*$/i,
 /PRODUCT_SEARCH[\s\S]*$/i,
  /I am lin[\s\S]*$/i,
  /\d{1,2}:\d{2} (AM|PM)\n?/gmi,
  /Related resources:.*$/i,
  /\*\*Note:\*\*.*$/i,
  /END OF MESSAGE.*$/i,
  /CLICK HERE!.*$/i,
  /DISCOUNTED RESPONSE:.$/i,
  /CRITICAL:.$/i,
  / PRODUCT SEARCH:.$/i, 
  /<https?:\/\/[^>]+>/,
  /check your tracking number.*$/i,
  /Please check your tracking.*$/i,
  /Please let me know.*$/i,
  /click the link below.*$/i,
   /Use specific order IDs for detailed status\.[\s\S]*$/gi,
  /#\w+/g,
  /[✨🛍️📦👗💼👩‍💼👨‍💼🔍💡🌟📞🏷️👕👖👔]/g,

  /If you're interested in more details.*$/i,
  /If you have any further questions.*$/i,
  /Thank you for choosing our store.*$/i,
  /Should you need assistance.*$/i,
  /Have a great day!.*$/i,
  /free to reach out.*$/i,
  /Please let me know!.*$/i,

  /I'm sorry, but there seems.*$/i,
  /Let me clarify:.*$/i,
  /due to system limitations.*$/i,

  /\*\*END OF RESPONSE\*\*[\s\S]*$/i,      
  /---[\s\S]*$/i,                          

  /Please provide more specific instructions if needed!.*$/i,
  /Please provide more specific instructions.*$/i,

  /Absolutely, let’s clarify whether[\s\S]*$/i,
  /let’s clarify whether[\s\S]*$/i,
   /^DIRECT_ANSWER\s*\[Policy\d+\.\d+\]\s*/i,
  /^I apologize if there was confusion in my previous response\.\s*/i,
  /^The exact return policy should be:\s*/i,
  /^Let me provide the exact policy:\s*/i,
  /^According to our policies?:\s*/i,
  /^Here(?:'s| is) the exact policy:\s*/i,

  /\* \* \*[\s\S]*$/i,                     
  /---.*$/i,                              

  /However,[\s\S]*$/i,                    

  /Related resources:.*$/i,

  /^User:.+$/gmi,                    
  /^Lin:.+$/gmi,                      
  /User:\s*.+$/gmi,                  
  /Lin:\s*.+$/gmi,                 
  /User:\s*".*?"$/gmi,               
  /Lin:\s*".*?"$/gmi,                
  /\bUser:\b.+$/gmi,                 
  /\bLin:\b.+$/gmi,                  
  /QUESTION:[\s\S]*$/i,                          
  /Answer:.*$/i,                           
  
  /RETURN_POLICY_ID:.*$/i,                  

  /Please let me know if there is anything else I can assist you with!.*$/i,
  /Please let me know if there is anything else.*$/i,
  /if there is anything else I can assist.*$/i,
  /Please note[\s\S]*$/i,
  /Please[\s\S]*$/i,
   /Direct Answer\s*/gi,
    /Direct_Answer\s*/gi,

  /FUNCTION RESULTS:.*$/is,
  /searchProducts:.*$/is,
  /"searchQuery".*$/is,
  /"results".*$/is,
  /imageUrl.*$/is,


  /I'm sorry, but there were no specific searches made by you[\s\S]*?Product List:/i,
  /I'm sorry, but there was an error[\s\S]*?Product List:/i,

  /(\n\s*\n\s*\n)[\s\S]*$/, 

  /\[END_OF_TEXT\].*$/i,
  /\[END_OF_RESPONSE\].*$/i,
  /END OF RESPONSE.*$/i,
  /---.*$/is,
  /\*\*\*.*$/is,
  /Customer:.*$/i,
  /Me \(Lin\):.*$/i,
  /\(Lin\):.*$/i,
  /Please note.*$/i,
  /based on actual shipping times.*$/i,
  /Thank you!.*$/i,
  /🛍️.*$/g,
  /🚚.*$/g,
  /📞.*$/g,
  /✨.*$/g,

];

  for (let i = 0; i < 5; i++) {  
    let changed = false;
    
    blacklist.forEach(pattern => {
      const before = cleaned;
      cleaned = cleaned.replace(pattern, '');
      if (before !== cleaned) changed = true;
    });
    
    if (!changed) break; 
  }

  console.log('🔍 APPLYING BLACKLIST...');
  blacklist.forEach(pattern => {
    const before = cleaned;
    cleaned = cleaned.replace(pattern, '');
    if (before !== cleaned) {
      console.log('✅ REMOVED PATTERN:', pattern.toString());
    }
  });
  
 
  cleaned = cleaned.replace(/^Response:\s*/i, '');
  cleaned = cleaned.replace(/^Answer:\s*/i, '');
  cleaned = cleaned.replace(/^Lin:\s*/i, '');
  
  
  cleaned = cleaned.trim();
  console.log('🛠️ FINAL CLEANED RESPONSE:', cleaned);
  return cleaned.length < 10 ? this.getFallbackResponse() : cleaned;
}

  cleanResponse(response, validPolicyIds) {
    let cleaned = response;

    const citationRegex = /\[([^\]]+)\]/g;
    const allCitations = [];
    let match;
    
    while ((match = citationRegex.exec(response)) !== null) {
      allCitations.push(match[1]);
    }

    cleaned = cleaned.replace(citationRegex, '');

    allCitations.forEach(citation => {
      if (validPolicyIds.includes(citation)) {
        const citationPos = response.indexOf(`[${citation}]`);
        if (citationPos !== -1) {
          cleaned = cleaned.slice(0, citationPos) + `[${citation}]` + cleaned.slice(citationPos);
        }
      }
    });

    const badPatterns = [
      /\[PolicyID\]/gi,
      /PolicyID:\s*\d+/gi,
      /Policy on [^\]]+/gi,
      /Section\s+\d+[\.\d]*/gi,
    ];
    
    badPatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });

    cleaned = this.cleanCitationFormatting(cleaned);
    
    return cleaned.trim();
  }

  cleanCitationFormatting(response) {

    let cleaned = response.replace(/(\[[^\]]+\])\s*\1+/g, '$1');

    cleaned = cleaned.replace(/([a-z])\[([^\]]+)\]([a-z])/gi, '$1 $2 $3');
    
    cleaned = cleaned.replace(/\.\s*\[([^\]]+)\]/g, ' [$1].');
    cleaned = cleaned.replace(/\?\s*\[([^\]]+)\]/g, ' [$1]?');
    cleaned = cleaned.replace(/(Policy\d+\.\d+:\s*)+/g, '');
    return cleaned;
  }

  classifyIntent(userInput) {
    const keywordResult = this.intentClassifier.classify(userInput);

    if (this.globalStats.intents[keywordResult.intent] !== undefined) {
      this.globalStats.intents[keywordResult.intent]++;
    }
    
    return {
      intent: keywordResult.intent,
      confidence: keywordResult.confidence,
      method: "keyword"
    };
  }

findRelevantPolicies(userQuery) {
  console.log('🔍 POLICY SEARCH DEBUG for:', userQuery);
  
  const query = userQuery.toLowerCase().trim();
  const scoredPolicies = [];
  
  this.knowledgeBase.forEach(policy => {
    let score = 0;
    const policyQuestion = policy.question.toLowerCase();
    
    console.log(`   Checking policy: ${policy.id} - "${policy.question}"`);
    
    // 🟢 USE YOUR HELPER FUNCTIONS (FINALLY!)
    
    // 1. Exact question match (highest priority)
    if (policyQuestion.includes(query) || query.includes(policyQuestion)) {
      score += 100;
      console.log(`   ✅ EXACT QUESTION MATCH: ${policy.id}`);
    }
    
    else if (this.isQuestionSimilar(query, policy.question)) {
      score += 80;
      console.log(`   ✅ SIMILAR QUESTION: ${policy.id}`);
    }
      
    else if (this.hasKeywordMatch(query, policy)) {
      score += 70;
      console.log(`   ✅ KEYWORD MATCH: ${policy.id}`);
    }
    
    else if (this.hasSemanticMatch(query, policy)) {
      score += 60;
      console.log(`   ✅ SEMANTIC MATCH: ${policy.id}`);
    }
    
    if (score >= 50) {
      scoredPolicies.push({ policy, score });
      console.log(`   📊 Final score for ${policy.id}: ${score}`);
    }
  });
  
  const bestPolicy = scoredPolicies
    .sort((a, b) => b.score - a.score)
    .slice(0, 1)
    .map(item => item.policy);
  
  console.log(`🔍 SINGLE BEST POLICY: ${bestPolicy.map(p => p.id).join(', ')}`);
  return bestPolicy;
}

isQuestionSimilar(userQuery, policyQuestion) {
  const userWords = userQuery.toLowerCase().split(/\s+/);
  const policyWords = policyQuestion.toLowerCase().split(/\s+/);

  // More comprehensive important words
  const importantWords = [
    'how', 'what', 'when', 'where', 'can', 'do', 'does', 
    'return', 'refund', 'exchange', 'ship', 'shipping', 'delivery',
    'pay', 'payment', 'discount', 'price', 'cost', 'warranty'
  ];
  
  const overlapping = userWords.filter(word => 
    importantWords.includes(word) && policyWords.includes(word)
  );
  
  console.log(`   🔍 Question similarity: ${overlapping.length} overlapping words`);
  return overlapping.length >= 2;
}

hasKeywordMatch(query, policy) {
  const keywordMap = {
    'returns': ['return', 'refund', 'exchange', 'send back'],
    'shipping': ['shipping', 'delivery', 'track', 'ship'],
    'payment': ['payment', 'credit', 'pay', 'billing', 'card'],
    'discounts': ['discount', 'promo', 'coupon', 'sale', 'offer'],
    'privacy': ['privacy', 'data', 'personal'],
    'security': ['security', 'secure', 'protection'],
    'support': ['support', 'contact', 'help', 'customer service']
  };
  
  const keywords = keywordMap[policy.category] || [];
  const hasMatch = keywords.some(keyword => query.includes(keyword));
  
  console.log(`   🔍 Keyword match for ${policy.category}: ${hasMatch}`);
  return hasMatch;
}

hasSemanticMatch(query, policy) {
  const semanticMap = {
    'returns': ['refund', 'exchange', 'send back', 'return item', 'send it back', 'take back'],
    'shipping': ['delivery', 'track', 'arrive', 'when will', 'shipping time', 'delivery date'],
    'payment': ['pay', 'credit card', 'debit', 'billing', 'payment method', 'how to pay'],
    'discounts': ['coupon', 'promo code', 'sale', 'reduction', 'cheaper', 'lower price'],
    'privacy': ['data', 'information', 'personal data', 'privacy policy'],
    'security': ['secure', 'safe', 'protection', 'hack', 'breach']
  };
  
  const category = policy.category?.toLowerCase();
  if (!category || !semanticMap[category]) return false;
  
  const hasMatch = semanticMap[category].some(keyword => 
    query.includes(keyword.toLowerCase())
  );
  
  console.log(`   🔍 Semantic match for ${category}: ${hasMatch}`);
  return hasMatch;
}
  validateCitations(response) {
    const citationRegex = /\[([^\]]+)\]/g;
    const citations = [];
    let match;

    while ((match = citationRegex.exec(response)) !== null) {
      citations.push(match[1]);
    }

    const validCitations = [];
    const invalidCitations = [];

    citations.forEach(citation => {
      const exists = this.knowledgeBase.some(policy => policy.id === citation);
      if (exists) {
        validCitations.push(citation);
      } else {
        invalidCitations.push(citation);
      }
    });

    return {
      isValid: invalidCitations.length === 0,
      validCitations,
      invalidCitations,
      totalCitations: citations.length
    };
  }

  async handleFunctionCall(functionName, args) {
    if (this.functionCallCount >= this.maxFunctionCalls) {
      throw new Error(`Maximum function calls (${this.maxFunctionCalls}) exceeded`);
    }

    const result = await this.functionRegistry.execute(functionName, args);
    this.functionCallCount++;
    
    if (result.success) {
      this.globalStats.successfulFunctionCalls++;
    } else {
      this.globalStats.failedFunctionCalls++;
    }
    
    return result;
  }

  updateConversationMemory(userId, userInput, assistantResponse) {
    if (!userId) return;
    
    if (!this.conversationMemory.has(userId)) {
      this.conversationMemory.set(userId, []);
    }
    
    const conversation = this.conversationMemory.get(userId);
    conversation.push({
      user: userInput,
      assistant: assistantResponse,
      timestamp: new Date().toISOString()
    });
    
    if (conversation.length > 10) {
      conversation.shift();
    }
  }

  getFallbackResponse(userInput) {
    const input = userInput ? userInput.toLowerCase() : '';
    
    if (input.includes('order') || input.includes('track')) {
      return "I'd be happy to help you track your order! Could you please provide your order ID or ensure you are logged in?";
    } else if (input.includes('search') || input.includes('find')) {
      return "I can help you find products in our clothing store! What specific items are you looking for?";
    } else if (input.includes('policy') || input.includes('return')) {
      return "No worries—I’m here to help. Let’s try that again";
    } else {
      return "Hello! I'm Lin, your clothing store support specialist. How can I assist you today?";
    }
  }

  getErrorResponse(error) {
    return {
      intent: 'error',
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
      citations: { isValid: true, validCitations: [], invalidCitations: [], totalCitations: 0 },
      relevantPolicies: [],
      functionsCalled: [],
      timestamp: new Date().toISOString(),
      metadata: {
        processingTime: 0,
        userIdentified: false,
        usedLLM: false
      }
    };
  }

  getGlobalStats() {
    const total = this.globalStats.totalQueries;
    const llmCalls = this.globalStats.responseMethods.llmCalls;
    const directResponses = this.globalStats.responseMethods.directResponses;
    
    return {
      ...this.globalStats,
      analytics: {
        totalQueries: total,
        llmUsage: {
          count: llmCalls,
          percentage: total > 0 ? ((llmCalls / total) * 100).toFixed(1) + '%' : '0%'
        },
        directResponseUsage: {
          count: directResponses,
          percentage: total > 0 ? ((directResponses / total) * 100).toFixed(1) + '%' : '0%'
        },
        costSavings: `Direct responses saved ${directResponses} LLM API calls`,
        performance: "Direct responses are typically 20x faster than LLM calls"
      },
      conversationMemorySize: this.conversationMemory.size
    };
  }
}

module.exports = AssistantEngine;