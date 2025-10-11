# AI Touchpoints Cost Model

 ## Assumptions
  **Touchpoint 1: typeahead**
 - Model: Llama 3.1 8B Instruct via OpenRouter at $0.05/1K prompt tokens, $0.2/1K completion tokens
 - Avg tokens in: 15    Avg tokens out: 30
 - Requests/day: 50,000 requests/day
 - Cache hit rate: 70%  
 
  **Touchpoint 2: Support assistant**
 - Model: Llama 3.1 8B Instruct via OpenRouter at $0.05/1K prompt tokens, $0.2/1K completion tokens
 - Avg tokens in: 150    Avg tokens out: 50
 - Requests/day: 1,000 requests/day
 - Cache hit rate: 30%

 ## Calculation
 Cost/action = (tokens_in/1000 * prompt_price) + (tokens_out/1000 * completion_price)
 Daily cost = Cost/action * Requests/day * (1- cache_hit_rate)
    
 ## Results
- Typeahead: Cost/action = $0.00675 USD per uncached request, Daily = $101.25 
- Support assistant: Cost/action = $0.0175 per uncached request, Daily =$12.25

 ## Cost lever if over budget
 - Limit context length: shorten the number of input tokens sent to the model during retrieval to reduce cost.
 - Downgrade model: switch to a smaller LLM on low-risk paths.
 - Improve cache hit: more caching reduces charged requests, especially for Typeahead.

 