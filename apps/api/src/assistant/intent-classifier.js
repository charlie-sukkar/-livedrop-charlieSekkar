class IntentClassifier {
  constructor() {
    this.keywordPatterns = {
      policy_question: [
        'return', 'refund', 'exchange', 'purchase', 'warranty', 'policy', 'policies',
        'shipping', 'delivery', 'ship', 'international', 
        'return policy', 'money back', 'guarantee', 'discount', 'student', 
        'promo', 'coupon', 'payment', 'credit card', 'pay', 'billing', 
        'methods', 'accept', 'privacy', 'data', 'personal', 'security', 
        'secure', 'protection', 'cash on delivery', 'cash', 'cod',
        'how long', 'how much', 'what if', 'can i', 'do you', 'international', 'used items', 'excahnge'
      ],
      order_status: [
        'order status', 'where is my order', 'when will it arrive', 
        'delivery date', 'my orders', 'order history', 'past orders', 
        'previous orders', 'order #', 'order number', 'order id', 
        'order confirmation', 'status', 'track', 'package', 'my recent orders', 
        'can you check', 'show me my recent orders', 'show me my orders',
        'check my orders', 'where is order', 'track order', 'track my order',
        'check order', 'order tracking', 'my order status', 'when will my order'  
      ],
      product_search: [
        'search', 'find', 'looking for', 'products', 'items', 'catalog',
        'what do you have', 'browse', 'available', 'summer', 'show me', 'dresses', 'shirts', 'pants', 'shoes', 'clothing', 'apparel', 'dress', 'summer dresses', 'summer dress', 
        'available', 'sell', 'do you have',  'have you got'
      ],
      complaint: [
        'complaint', 'issue', 'problem', 'not happy', 'frustrated',
        'bad experience', 'terrible', 'awful', 'disappointed', 'upset',
        'not working', 'broken', 'damaged', 'wrong item', 'missing', 
        'problem with', 'issue with', 'late', 'poor quality', 'unacceptable', 'unhappy'
      ],
      chitchat: [
        'hello', 'hi', 'hey', 'how are you', 'good morning', 'good afternoon',
        'good evening', "what's up", 'howdy', 'greetings', "what's your name", 
        'your name', 'who are you', 'help me with', 'what can you',
        'can you help', 'about your', 'about the store',
        'thanks', 'thank you', 'thank', 'appreciate'
      ],
      off_topic: [
        'weather', 'tell me about', 'sports', 'politics', 'movies', 'music', 'news',
        'joke', 'tell me a story', 'random', 'off topic', 'capital of',
        '2+2', 'favorite color', 'stock market'
      ],
      violation: [
        'fuck', 'shit', 'asshole', 'bitch', 'damn', 'stupid', 'idiot',
        'hate', 'kill', 'violence', 'abusive', 'inappropriate', 'terrible service', 
        'awful service', 'horrible service', 'worst service', 'pissed off',
        'bullshit', 'fucking', 'you guys are', "you're all", 'garbage', 'garbage', 'trash', 'rubbish', 'worthless', 'useless'
      ]
    };

    this.intentOrder = [
      'violation',
      'order_status', 
      'product_search',
      'policy_question', 
      'complaint',
      'chitchat',
      'off_topic'
    ];
  }

  classify(userInput = '') {
    const input = userInput.toLowerCase().trim();
    if (this.isPolicyQuestionWithOrderContext(input)) {
      return { intent: 'policy_question', confidence: 0.9 };
    }

    if (this.hasKeywords(input, this.keywordPatterns.violation)) {
      return { intent: 'violation', confidence: 1.0 };
    }

    for (const intent of this.intentOrder) {
      if (intent !== 'violation' && this.hasKeywords(input, this.keywordPatterns[intent])) {
        return { intent, confidence: 0.8 };
      }
    }

    return { intent: 'off_topic', confidence: 0.4 };
  }

  isPolicyQuestionWithOrderContext(input) {
    const policyKeywords = ['policy', 'return', 'refund', 'exchange', 'shipping', 'payment', 'privacy'];
    const hasOrderContext = /\border\s*#?\d*\b|\border\s+number|\bmy\s+order\b/i.test(input);
    const hasPolicyQuestion = policyKeywords.some(keyword => input.includes(keyword));
    
    return hasOrderContext && hasPolicyQuestion;
  }

  hasKeywords(input, keywords = []) {
    return keywords.some(keyword => {
      if (keyword.includes(' ')) {
 
        return input.includes(keyword.toLowerCase());
      } else {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        return regex.test(input);
      }
    });
  }
}

module.exports = IntentClassifier;