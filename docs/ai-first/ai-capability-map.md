## AI Capabilities

1. **Typeahead / Search Suggestions:** Help users find products faster while typing in the search bar. Improves product discovery and conversion.
2. **Support Assistant:** Answer user questions about policies, FAQs, and order status. Reduces support contacts and improves user experience.
3. **Personalized Product Recommendations:** Suggest products a user might like based on browsing history or previous orders. Boosts average order value and engagement.
4. **Review / Sentiment Analysis:** Summarize product reviews or detect positive/negative sentiment. Helps users make informed purchase decisions and increases trust.


## AI Capability Map

| Capability | Intent (user) | Inputs (this sprint) | Risk 1–5 (tag) | p95 ms | Est. cost/action |
|------------|---------------|--------------------|----------------|--------|----------------|
| Typeahead (selected) | help user find products faster | search query, product catalog | 2 (simple integration, low user impact) | 300ms | 0.006 |
| Support Assistant (selected) | Answer FAQs/policies and order status queries | User question, FAQ markdown (internal doc), Order-status API (backend tool) | 3 (moderate integration, needs RAG + API + classification, higher user impact) | 1200ms | 0.01 |
| Personalized Recommendations | Suggests products the user might like | User browsing history, product catalog | 4 (depends on data quality, relevance) | 500ms(small model) | 0.012|
| Review / Sentiment Analysis | Summarize product reviews | Product reviews | 2 (mostly safe, limited impact if slightly wrong) | 700ms | 0.015 |


## why these 2

 We selected **Typeahead** and **Support Assistant** because they directly improve key user experiences at critical touchpoints. By using **semantic search**, Typeahead interprets the meaning behind user queries, returning smarter suggestions that help users find products faster and **increase conversion** by reducing search friction. Support Assistant reduces friction in support interactions, **lowering the support contact rate** by providing accurate answers using existing FAQ markdown (via a RAG tool) and the order-status API. Both touchpoints are feasible with current resources and carry **low integration risk** because data sources already exist (FAQs, API, product catalog), making them ideal for **near-term** implementation.  
 Additionally, both capabilities can be adapted to support Lebanese Arabic, ensuring accessibility and relevance for local users.




 