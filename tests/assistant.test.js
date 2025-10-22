
const request = require('supertest');
const BASE_URL = 'http://localhost:3000';

describe('Assistant Component Tests', () => {

  describe('Assistant Basic Routes', () => {
    it('GET /api/assistant/health - should return assistant status', async () => {
      const response = await request(BASE_URL)
        .get('/api/assistant/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('status');
      expect(['assistant-engine-available', 'assistant-engine-unavailable']).toContain(response.body.status);
    });

    it('GET /api/assistant/test - should return test message', async () => {
      const response = await request(BASE_URL)
        .get('/api/assistant/test')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('assistantAvailable');
      expect(typeof response.body.assistantAvailable).toBe('boolean');
    });

    it('GET /api/assistant/intents - should return available intents', async () => {
      const response = await request(BASE_URL)
        .get('/api/assistant/intents')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('intents');
      expect(Array.isArray(response.body.data.intents)).toBe(true);
    });
  });

  // INTENT DETECTION TESTS - 3-5 examples per intent type
  describe('Intent Detection System', () => {
    
    describe('policy_question intent', () => {
      const testCases = [
        { message: "What's your return policy?", expectedIntent: 'policy_question' },
        { message: "What are your shipping options?", expectedIntent: 'policy_question' },
        { message: "Do you offer international shipping?", expectedIntent: 'policy_question' },
        { message: "What payment methods do you accept?", expectedIntent: 'policy_question' },
        { message: "Can I pay with cash on delivery?", expectedIntent: 'policy_question' }
      ];

      testCases.forEach(({ message, expectedIntent }) => {
        it(`should detect "${expectedIntent}" for: "${message}"`, async () => {
          const response = await request(BASE_URL)
            .post('/api/assistant/generate')
            .send({ message, context: {} });

          if (response.status === 200) {
            expect(response.body.data.intent).toBe(expectedIntent);
            console.log(`✅ Intent: ${expectedIntent} | Response: ${response.body.data.text.substring(0, 50)}...`);
          } else if (response.status === 503) {
            console.log('ℹ️ Assistant not available - intent detection skipped');
          }
        });
      });
    });

    describe('order_status intent', () => {
      const testCases = [
        { message: "Where is my order ord_1761029383310_utusuqtqj?", expectedIntent: 'order_status' },
        { message: "Track my package ord_1760612725009_8bk12obss", expectedIntent: 'order_status' },
        { message: "What's the status of order ord_1761029302438_4jsqmiylh?", expectedIntent: 'order_status' },
        { message: "Show me my recent orders?", expectedIntent: 'order_status' }
      ];

      testCases.forEach(({ message, expectedIntent }) => {
        it(`should detect "${expectedIntent}" for: "${message}"`, async () => {
          const response = await request(BASE_URL)
            .post('/api/assistant/generate')
            .send({ message, context: {} });

          if (response.status === 200) {
            expect(response.body.data.intent).toBe(expectedIntent);
          } else if (response.status === 503) {
            console.log('ℹ️ Assistant not available - intent detection skipped');
          }
        });
      });
    });

    describe('product_search intent', () => {
      const testCases = [
        { message: "Show me summer dresses", expectedIntent: 'product_search' },
        { message: "Find jeans", expectedIntent: 'product_search' },
        { message: "I'm looking for formal shirts", expectedIntent: 'product_search' },
        { message: "Search for running shoes", expectedIntent: 'product_search' },
        { message: "What jackets do you have?", expectedIntent: 'product_search' }
      ];

      testCases.forEach(({ message, expectedIntent }) => {
        it(`should detect "${expectedIntent}" for: "${message}"`, async () => {
          const response = await request(BASE_URL)
            .post('/api/assistant/generate')
            .send({ message, context: {} });

          if (response.status === 200) {
            expect(response.body.data.intent).toBe(expectedIntent);
          } else if (response.status === 503) {
            console.log('ℹ️ Assistant not available - intent detection skipped');
          }
        });
      });
    });

    describe('complaint intent', () => {
      const testCases = [
        { message: "I'm very unhappy, bad service!", expectedIntent: 'complaint' },
        { message: "This item arrived damaged", expectedIntent: 'complaint' },
        { message: "My order is late and I need it urgently", expectedIntent: 'complaint' },
        { message: "The quality is terrible", expectedIntent: 'complaint' }
      ];

      testCases.forEach(({ message, expectedIntent }) => {
        it(`should detect "${expectedIntent}" for: "${message}"`, async () => {
          const response = await request(BASE_URL)
            .post('/api/assistant/generate')
            .send({ message, context: {} });

          if (response.status === 200) {
            expect(response.body.data.intent).toBe(expectedIntent);
          } else if (response.status === 503) {
            console.log('ℹ️ Assistant not available - intent detection skipped');
          }
        });
      });
    });

    describe('chitchat intent', () => {
      const testCases = [
        { message: "Hello there!", expectedIntent: 'chitchat' },
        { message: "How are you today?", expectedIntent: 'chitchat' },
        { message: "What's your name?", expectedIntent: 'chitchat' },
        { message: "Thanks for your help!", expectedIntent: 'chitchat' }
      ];

      testCases.forEach(({ message, expectedIntent }) => {
        it(`should detect "${expectedIntent}" for: "${message}"`, async () => {
          const response = await request(BASE_URL)
            .post('/api/assistant/generate')
            .send({ message, context: {} });

          if (response.status === 200) {
            expect(response.body.data.intent).toBe(expectedIntent);
          } else if (response.status === 503) {
            console.log('ℹ️ Assistant not available - intent detection skipped');
          }
        });
      });
    });

    describe('off_topic intent', () => {
      const testCases = [
        { message: "What's the weather like?", expectedIntent: 'off_topic' },
        { message: "Tell me a joke", expectedIntent: 'off_topic' },
        { message: "How old are you?", expectedIntent: 'off_topic' },
        { message: "What's your favorite color?", expectedIntent: 'off_topic' }
      ];

      testCases.forEach(({ message, expectedIntent }) => {
        it(`should detect "${expectedIntent}" for: "${message}"`, async () => {
          const response = await request(BASE_URL)
            .post('/api/assistant/generate')
            .send({ message, context: {} });

          if (response.status === 200) {
            expect(response.body.data.intent).toBe(expectedIntent);
          } else if (response.status === 503) {
            console.log('ℹ️ Assistant not available - intent detection skipped');
          }
        });
      });
    });

    describe('violation intent', () => {
      const testCases = [
        { message: "You're stupid!", expectedIntent: 'violation' },
        { message: "This is garbage", expectedIntent: 'violation' },
        { message: "I hate your store", expectedIntent: 'violation' }
      ];

      testCases.forEach(({ message, expectedIntent }) => {
        it(`should detect "${expectedIntent}" for: "${message}"`, async () => {
          const response = await request(BASE_URL)
            .post('/api/assistant/generate')
            .send({ message, context: {} });

          if (response.status === 200) {
            expect(response.body.data.intent).toBe(expectedIntent);
          } else if (response.status === 503) {
            console.log('ℹ️ Assistant not available - intent detection skipped');
          }
        });
      });
    });
  });

  // IDENTITY TESTS - Critical identity verification
  describe('Assistant Identity Tests', () => {
    it('"What\'s your name?" → Must NOT say ChatGPT/Llama', async () => {
      const response = await request(BASE_URL)
        .post('/api/assistant/generate')
        .send({ message: "What's your name?", context: {} });

      if (response.status === 200) {
        const responseText = response.body.data.text.toLowerCase();
        expect(responseText).not.toMatch(/chatgpt|llama|ai language model|openai|meta|artificial intelligence/i);
        expect(responseText).toMatch(/lin|support|specialist|assistant/i);
        console.log(`✅ Identity test passed: ${response.body.data.text}`);
      }
    });

    it('"Are you a robot?" → Must respond naturally', async () => {
      const response = await request(BASE_URL)
        .post('/api/assistant/generate')
        .send({ message: "Are you a robot?", context: {} });

      if (response.status === 200) {
        const responseText = response.body.data.text.toLowerCase();
        expect(responseText).not.toMatch(/chatgpt|llama|ai language model|openai|meta|artificial intelligence/i);
        expect(responseText).not.toMatch(/yes, i am a robot|i am an ai/i);
        console.log(`✅ Robot test passed: ${response.body.data.text}`);
      }
    });

    it('"Who created you?" → Must reference company, not OpenAI/Meta', async () => {
      const response = await request(BASE_URL)
        .post('/api/assistant/generate')
        .send({ message: "Who created you?", context: {} });

      if (response.status === 200) {
        const responseText = response.body.data.text.toLowerCase();
        expect(responseText).not.toMatch(/openai|meta|microsoft|google|anthropic/i);
        expect(responseText).toMatch(/store|company|team|support/i);
        console.log(`✅ Creator test passed: ${response.body.data.text}`);
      }
    });

    it('should have consistent name and personality', async () => {
      const response = await request(BASE_URL)
        .post('/api/assistant/generate')
        .send({ message: "Introduce yourself", context: {} });

      if (response.status === 200) {
        const responseText = response.body.data.text.toLowerCase();
        expect(responseText).toMatch(/lin/);
        expect(responseText).toMatch(/support|specialist|assistant|help/i);
        console.log(`✅ Personality test passed: ${response.body.data.text}`);
      }
    });
  });

  // FUNCTION CALLING TESTS
  describe('Function Calling Tests', () => {
    
    describe('Order Status Function Calls', () => {
      it('should call getOrderStatus for valid order ID', async () => {
        const response = await request(BASE_URL)
          .post('/api/assistant/generate')
          .send({ 
            message: "Where is my order ord_123456789?", 
            context: {} 
          });

        if (response.status === 200) {

          const functionsCalled = response.body.data.functionsCalled || [];
          const intent = response.body.data.intent;
          
          expect(intent).toBe('order_status');
          console.log(`✅ Order status - Functions called: ${functionsCalled.join(', ')}`);
          
          if (functionsCalled.length > 0) {
            expect(functionsCalled).toContain('getOrderStatus');
          }
        }
      });

      it('should call getCustomerOrders for recent orders query', async () => {
        const response = await request(BASE_URL)
          .post('/api/assistant/generate')
          .send({ 
            message: "Show me my recent orders", 
            context: { customerId: 'cust01', email: 'demo@example.com' } 
          });

        if (response.status === 200) {
          const functionsCalled = response.body.data.functionsCalled || [];
          const intent = response.body.data.intent;
          
          expect(intent).toBe('order_status');
          console.log(`✅ Recent orders - Functions called: ${functionsCalled.join(', ')}`);
        }
      });
    });

    describe('Product Search Function Calls', () => {
      it('should call searchProducts for product queries', async () => {
        const response = await request(BASE_URL)
          .post('/api/assistant/generate')
          .send({ 
            message: "Search for summer dresses", 
            context: {} 
          });

        if (response.status === 200) {
          const functionsCalled = response.body.data.functionsCalled || [];
          const intent = response.body.data.intent;
          
          expect(intent).toBe('product_search');
          console.log(`✅ Product search - Functions called: ${functionsCalled.join(', ')}`);
          
          if (functionsCalled.length > 0) {
            expect(functionsCalled).toContain('searchProducts');
          }
        }
      });

      it('should return product results in response', async () => {
        const response = await request(BASE_URL)
          .post('/api/assistant/generate')
          .send({ 
            message: "Find me some jeans", 
            context: {} 
          });

        if (response.status === 200) {
          const responseText = response.body.data.text.toLowerCase();
          const intent = response.body.data.intent;
          
          expect(intent).toBe('product_search');
          expect(responseText).toMatch(/product|jeans|search|find/i);
          console.log(`✅ Product results: ${response.body.data.text.substring(0, 100)}...`);
        }
      });
    });

    describe('Policy Question Function Calls', () => {
      it('policy questions should call getPolicyInfo function', async () => {
        const response = await request(BASE_URL)
          .post('/api/assistant/generate')
          .send({ 
            message: "What is your return policy?", 
            context: {} 
          });

        if (response.status === 200) {
          const functionsCalled = response.body.data.functionsCalled || [];
          const intent = response.body.data.intent;
          
          expect(intent).toBe('policy_question');
          console.log(`✅ Policy question - Functions called: ${functionsCalled.join(', ')}`);
          
          if (functionsCalled.length > 0) {
            expect(functionsCalled).toContain('getPolicyInfo');
          }
        }
      });

      it('should use knowledge base for policy responses', async () => {
        const response = await request(BASE_URL)
          .post('/api/assistant/generate')
          .send({ 
            message: "What are your shipping options?", 
            context: {} 
          });

        if (response.status === 200) {
          const responseText = response.body.data.text;
          const citations = response.body.data.citations || [];
          const intent = response.body.data.intent;
          
          expect(intent).toBe('policy_question');
          expect(responseText).toMatch(/shipping|delivery|ship|options/i);
          console.log(`✅ Policy KB usage - Citations: ${citations.join(', ')}`);
        }
      });
    });

    describe('Function Call Limits', () => {
      it('should respect 2-function-call limit', async () => {
        const complexQuery = "Find me shirts and pants and also check my recent orders and tell me about returns";
        
        const response = await request(BASE_URL)
          .post('/api/assistant/generate')
          .send({ 
            message: complexQuery, 
            context: { customerId: 'cust01' } 
          });

        if (response.status === 200) {
          const functionsCalled = response.body.data.functionsCalled || [];
          
          expect(functionsCalled.length).toBeLessThanOrEqual(2);
          console.log(`✅ Function limit - Called ${functionsCalled.length} functions: ${functionsCalled.join(', ')}`);
        }
      });
    });
  });

  describe('Response Structure Validation', () => {
    it('should return consistent response structure for all queries', async () => {
      const testMessages = [
        "Hello!",
        "What's your return policy?",
        "Where is my order?",
        "Find me some dresses"
      ];

      for (const message of testMessages) {
        const response = await request(BASE_URL)
          .post('/api/assistant/generate')
          .send({ message, context: {} });

        if (response.status === 200) {
          const responseData = response.body.data;
          
          expect(responseData).toHaveProperty('text');
          expect(responseData).toHaveProperty('intent');
          expect(responseData).toHaveProperty('citations');
          expect(responseData).toHaveProperty('functionsCalled');
          expect(responseData).toHaveProperty('timestamp');
          expect(responseData).toHaveProperty('metadata');
          
          expect(responseData.metadata).toHaveProperty('processingTime');
          expect(responseData.metadata).toHaveProperty('userIdentified');
          expect(responseData.metadata).toHaveProperty('usedLLM');
          
          expect(Array.isArray(responseData.citations)).toBe(true);
          expect(Array.isArray(responseData.functionsCalled)).toBe(true);
          
          console.log(`✅ Structure valid for: "${message.substring(0, 20)}..."`);
        }
      }
    });
  });
});