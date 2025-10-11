 # RAG System Evaluation 

  
## Retrieval Quality Tests (10 tests) 
| Test ID | Question | Expected Documents | Pass Criteria | 
|---------|----------|--------------------|---------------| 
| R01 | How do I create a seller account | Seller Account Setup and Management | source is document 8 |
| R02 | What payment options are available | Payment Methods and Security | Retrieved doc contain the list of payment method |
| R03 | How does ShopLite secure user passwords | ShopLite User Registration Process   | Expected document titles are present in the retrieved results |
| R04 | What AI features are built into ShopLite | Customer Support Procedures,Product Search and Filtering | All relevant documents for the query are retrieved |
| R05 | What is the return period and refund timeline | Return and Refund Policies | Document "Return and Refund Policies" in results |
| R06 |  Which couriers handle ShopLite deliveries |  Order Tracking and Delivery | Retrieved doc contain the list of couriers |
| R07 | How are reviews on ShopLite moderated | Product Reviews and Ratings | Document "Product Reviews and Ratings" in results  |
| R08 | What steps are involved in registering and securing a user account | ShopLite User Registration Process, Security and Privacy Policies | All relevant documents for the query are retrieved |
| R09 | How are payments processed securely and linked to refund policies | Payment Methods and Security, Return and Refund Policies| doc "Payment Methods and Security and  doc "Return and Refund Policies" are included |
| R10 |  What security features are available in both the web and mobile app | Mobile App Features, Security and Privacy Policies | All relevant documents for the query are retrieved |


 ## Response Quality Tests (15 tests)   
| Test ID | Question | Required Keywords | Forbidden Terms | Expected Behavior | 
|---------|----------|-------------------|-----------------|-------------------| 
| Q01 | How do I create a ShopLite account? | ["registration", "email", "password"] | ["no need for acc", "external"] | Direct answer citing "ShopLite User Registration Process" | 
| Q02 | What is ShopLite’s return policy for electronics? | ["return", "electronics", "14 days"] | ["speculation", "unverified"] | Direct answer citing "Return and Refund Policies" | 
| Q03 | Which payment methods are available for Lebanese users? | ["Bank Audi", "BLOM", "OwlPay"] | ["anyther payment method not suported"] | Direct answer citing "Payment Methods and Security" | 
| Q04 | How can I track my order? | ["tracking", "dashboard", "courier"] | ["can't track"] | Direct answer citing "Order Tracking and Delivery" | 
| Q05 | Can I request a refund for a returned item? | ["refund", "return", "3-7 business days"] | ["can't refund", "30 days"] | Direct answer citing "Return and Refund Policies" |
| Q06  | How do I submit a product review? | ["ratings", "reviews", "purchase verification"] | ["don't need a purchase certification"] | Direct answer citing "Product Reviews and Ratings" |  
| Q07  | How do sellers create product listings? | ["register", "approval", "dashboard"] | ["i'm not sure", "varies"] | Direct answer citing "Seller Account Setup and Management" | 
| Q08 | How is inventory managed for sellers? | ["stock", "SKU", "update"] | ["assume", "no access"] | Direct answer citing "Inventory Management for Sellers" |
| Q09  | How does ShopLite calculate fees and commissions? | ["commission", "fee", "transaction"] | ["no fees", "randomly"] | Direct answer citing "Commission and Fee Structure" | 
| Q10 | What support channels are available for order inquiries? | ["chat", "email", "phone"] | ["unverified"] | Direct answer citing "Customer Support Procedures" |  
| Q11 | What features are available in the ShopLite mobile app? | ["scan", "notifications", "offline"] | ["no features", "only online"] | Direct answer citing "Mobile App Features" | 
| Q12 | How can developers use ShopLite APIs? | ["RESTful", "endpoints", "JSON"] | ["out of my scop" , "speculate"] | Direct answer citing "API Documentation for Developers" |
| Q13 | How is user data protected on ShopLite? | ["encryption", "privacy", "GDPR"] | ["no security", "clear text"] | Direct answer citing "Security and Privacy Policies" | 
| Q14 | How can sellers create promotional codes? | ["discount", "BOGO", "expiration"] | ["guess"] | Direct answer citing "Promotional Codes and Discounts" | 
| Q15 | What happens if a payment fails? | ["declined", "insufficient funds", "feedback"] | ["i'm not sure", "it depends"] | Direct answer citing "Payment Methods and Security" | 

## Edge Case Tests (5 tests) 
| Test ID | Scenario | Expected Response Type | 
|---------|----------|----------------------| 
| E01 | Question not in KB | Refusal with explanation (use refusal_when_no_context) |
| E02 | Ambiguous question | Clarifying question |
| E03 | Conflicting doc snippets | State conflict, provide conservative guidance |
| E04 | High-risk fraud question | Escalate to support; do not provide PII |
| E05 | ask for all policies | return link to doc |
