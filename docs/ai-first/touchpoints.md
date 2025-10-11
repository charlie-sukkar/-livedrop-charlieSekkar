## Typeahead

**Problem statement:**  
Users often abandon searches when they cannot quickly find the right product. This creates friction, lowers product discovery, and reduces conversion. A semantic-powered Typeahead can reduce friction by showing relevant suggestions instantly as the user types.

**Happy path:**
1. User types a query in the search bar.
2. Frontend sends partial query to backend Typeahead API.
3. Normalize/clean query (string cleaning, lowercasing, stripping diacritics).
4. Check cache for frequent/short queries:  
   - If hit, return results immediately to user.  
   - If miss, proceed to next step.
5. Encode normalized query into embedding using the model.
6. Compare query embedding to precomputed product embeddings in vector DB.
7. Retrieve top 5–10 results and return to user.
8. Store results in cache for future queries.

**Grounding & guardrails:**
- Source of truth: Product catalog (names, categories, synonyms).  
- Retrieval scope: only products available in the catalog.  
- Max context: 20 tokens per query (short queries only).  
- Refuse: no outside information.

**Human-in-the-Loop:**  
- No active human-in-the-loop is required under normal operation; minimal review is done only if users flag irrelevant suggestions.


**Latency budget:**
- Normalization < 10 ms  
- Embedding ~ 80 ms  
- Vector search ~ 100 ms  
- Ranking + Return ~ 50 ms   
- **Total p95: ≤ 300 ms**
- Cache hit (70%) ~ 20 ms 

**Error & fallback behavior:**
- Cache/DB error: Return "empty list" or "no results found".  
- Embedding/model error: Fall back to simple keyword/prefix search. Return results to the user without failing completely.  
- Timeout / latency exceeded: Return partial results or "please try again" message.

**PII handling:**
- Only query text is processed.  
- Queries are logged anonymously (no personal information is stored).

**Success Metrics:**

Product Metrics: 
1. Query success rate = (Queries with ≥1 result / Total queries) × 100  
2. Click-through rate = (Clicks on suggestions / Total queries) × 100  

Business Metric:
1. Conversion uplift = (Purchases with Typeahead / Total sessions) - baseline conversion rate

**Feasibility:**
For this AI touchpoint, we used the **LLaMA 3.1 8B Instruct via OpenRouter** model because it is low-cost, fast enough to meet the **p95 latency target of 300 ms**, and sufficient for short product queries. There is no need to use larger or more expensive models.  
Even though semantic search is slightly more costly and has higher latency than simple keyword search, it provides better results and a more meaningful experience for users.  
Since product names are consistent across languages, Typeahead does not require translation of queries. This ensures fast response times and low cost while still supporting Lebanese users.


## Support Assistant

**Problem statement:** Users often have questions about orders, policies, or other support topics. Waiting for human support can be slow and reduce satisfaction. A Support Assistant powered by AI can quickly provide accurate answers, lowering support contact rate and improving overall user experience.

**Happy path:**
1. User asks a question via the support chat, and Frontend sends the query to the backend Support Assistant API
2. Normalize/clean query (string cleaning, lowercasing, stripping diacritics)
3. Use redactor tool(regex) to detect and mask PII 
4. Check cache for recent similar queries 
   - If hit, return cached answer.
   - If miss, continue
5. Query classification (handled by planner): Determines if it’s an FAQ, order query, chitchat, or out-of-scope
  - if chitchat , return a friendly message directly to the user.
  - if out-of-scope , return “Sorry, I can’t answer that
  - Otherwise, route to the appropriate tool/API
6. Jailbreaker / guardrail ensures the query is safe and within allowed boundaries
7. Use RAG to fetch relevant documents from FAQ Markdown or order-status API if query is about an order.
  - **Edge case handling:** For very long policies or FAQ requests (e.g., “give me all policies”), the assistant provides a link to the full policy text. This prevents excessive tokens in and keeps latency manageable. <!-- this can handle long requests -->
8. Encode query and retrieved context, generate answer using the AI model
9. Validate the answer and return it to the user
10. Cache the answer for repeated queries  

**Note:** Query preprocessing uses regex for normalization and transliteration of Lebanese Arabic written in Latin letters. For queries containing French or English, a lightweight translation or embedding step may be applied before sending the query to the AI model, ensuring accurate understanding while keeping latency low.


**Grounding & guardrails:**
 - Source of truth: FAQ Markdown (policies, instructions) and order-status API (for live order info).
 - Retrieval scope: only content from FAQs and order database.
 - Max content: 450 tokens (user question + system prompt + retrieved content)
 - Refuse : any questions outside FAQ or order-related queries(or simple chichat with the assisstant to get to know it)

 **Human-in-the-loop:**
 - Escalation triggers: AI confidence < 80% or question outside FAQ/order API scope <!-- take him to human support -->
 - UI surface: Chat interface shows AI answer with "Escalate to agent" option
 - Reviewer: Support agent receives escalated queries

 **Latency budget:**
 - Normalization: < 40ms (includes regex-based preprocessing and transliteration for Lebanese Arabic)
 - Reduction and classification: ~50ms
 - Cache hit (30%): ~ 50 ms (if hit, skip embedding + retrieval + model gen)
 - Retrieval + embedding (RAG): ~ 400 ms
 - Model generation: ~ 600 ms
 - Ranking/formatting + return: ~ 80 ms
 - Total p95: ≤ 1200 ms  
 
  **note** Query classification and redaction steps are lightweight (≤50 ms combined) and can be executed in parallel with retrieval. Therefore, they do not significantly affect the overall latency, keeping the effective total within the ≤1200 ms p95 budget.

 **Error & fallback behavior:**
 - cache/DB/API error: return “Sorry, we are unable to retrieve an answer. Please try again later.”
 - Model error: return generic answer or suggest escalation to human support
 - Timeout/latency exceeded: return "try again later"

 **PII handling:**
 - Used a redactor tool to detect and mask any personal information (e.g., emails, phone numbers, order IDs) before processing the query
 - Only anonymized query text is sent to the model

**Success Metrics:**

 Product Metrics:
 1. First-response accuracy = (Correct answers / Total queries answered) × 100
 2. Escalation rate = (Queries escalated to human / Total queries) × 100

 Business Metric:
 1. Support contact reduction = (Baseline support contacts - Support contacts handled by AI) / Baseline support contacts × 100

 **Feasibility:**
 For this AI touchpoint, we used the **LLaMA 3.1 8B Instruct via OpenRouter** model because it is cost-effective, fast enough for 1,000 requests/day, and can reliably handle FAQ and order queries when properly grounded. The support assistant is feasible because ShopLite already has a structured FAQ markdown and an order-status API, providing the necessary data for accurate responses. All answers are grounded in the ShopLite FAQ and order data to minimize hallucinations and maintain user trust. Human-in-the-loop ensures that questions outside scope or with low-confidence AI answers are handled within the 1-hour SLA.

