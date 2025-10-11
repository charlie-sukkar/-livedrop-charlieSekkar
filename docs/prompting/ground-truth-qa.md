# ShopLite Knowledge Base Retrieval Evaluation (20 Q&A)

 ## Simple factual questions

  ### Q01: How do I create a seller account on Shoplite? 
**Expected retrieval context:** Document 8: Seller Account Setup and Management. 
**Authoritative answer:** To create a seller account, users must go through the seller registration process by submitting business verification documents, tax information, and then waiting for approval. Once verified, sellers gain access to dashboards, inventory tools, and order tracking features.  
**Required keywords in LLM response:** ["seller registration", "business verification", "tax information"]  
**Forbidden content:** ["instant approval", "no verification required", "personal accounts"]

  ### Q02: How does ShopLite secure user passwords during account registration?
**Expected retrieval context:** Document 1: ShopLite User Registration Process
**Authoritative answer:** ShopLite secures user accounts by hashing all passwords and encouraging two-factor authentication, ensuring that sensitive login data is never stored in plain text.
**Required keywords in LLM response:** ["password hashing", "two-factor authentication"]
**Forbidden content:** ["unencrypted storage", "plain text passwords"]

  ### Q03: What payment options are available for Lebanese users? 
**Expected retrieval context:** Document 4: Payment Methods and Security
**Authoritative answer:** Lebanese users can pay via Bank Audi, BLOM Bank, Fransabank credit and debit cards (Visa/MasterCard), direct bank transfers, and OwlPay mobile wallets, or using wish
**Required keywords in LLM response:** ["Bank Audi", "BLOM Bank", "Fransabank", "OwlPay", "wish"]
**Forbidden content:** ["PayPal(any other app not available in lebanon)", "cryptocurrency payments"]

 ### Q04: What features are included in ShopLite’s shopping cart? 
**Expected retrieval context:** Document 2: ShopLite Shopping Cart Features
**Authoritative answer:** The shopping cart allows users to add products, adjust quantities, remove items, calculate totals with Lebanese tax and shipping zones, save items for later, and use wish lists.
**Required keywords in LLM response:** ["quantities", "Lebanese zones", "wish lists"]
**Forbidden content:** ["international tax support", "guest checkout only"]

 ### Q05: What AI features are built into ShopLite’s product search? 
**Expected retrieval context:** Document 3: Product Search and Filtering
**Authoritative answer:** ShopLite integrates AI-powered typeahead for faster searches and FAISS-based vector search for natural language queries, helping users quickly find relevant products. 
**Required keywords in LLM response:** ["AI-powered typeahead", "FAISS-based vector search"] 
**Forbidden content:** ["no AI support", "manual-only search"]

 ### Q06: What is the return period and refund timeline on ShopLite? 
**Expected retrieval context:** Document 6: Return and Refund Policies
**Authoritative answer:** ShopLite allows returns within 14–30 days depending on product category, with refunds issued to the original payment method within 3–7 business days after approval.
**Required keywords in LLM response:** ["14–30 days", "3–7 business days", "refund approval"] 
**Forbidden content:** ["no returns", "lifetime returns"]

 ### Q07: Which couriers handle ShopLite deliveries?
**Expected retrieval context:** Document 5: Order Tracking and Delivery
**Authoritative answer:** ShopLite partners with trusted local couriers such as Aramex Lebanon, TNT Lebanon, and Fetchr Lebanon for deliveries.
**Required keywords in LLM response:** ["Aramex Lebanon", "TNT Lebanon", "Fetchr Lebanon"]
**Forbidden content:** ["DHL Global", "FedEx International only", "any courier not mentioned"]

 ### Q08: How are reviews on ShopLite moderated?
**Expected retrieval context:** Document 7: Product Reviews and Ratings
**Authoritative answer:** Reviews undergo AI-based moderation and manual review to remove offensive or spammy content, ensuring authenticity and reliability.
**Required keywords in LLM response:** ["AI-based moderation", "manual review", "authenticity"] 
**Forbidden content:** ["no moderation", "anonymous spam allowed"]

## Multi-document (complex) questions

 ### Q09: What steps are involved in registering and securing a user account on ShopLite? 
**Expected retrieval context:** Document 1: ShopLite User Registration Process + Document 14: Security and Privacy Policies
**Authoritative answer:** Users must provide an email, password, and verification, after which ShopLite secures accounts using password hashing, optional two-factor authentication, encryption, and role-based access controls.
**Required keywords in LLM response:** ["account verification", "password hashing", "two-factor authentication", "encryption"]  
**Forbidden content:** ["no verification", "plain text storage"]

 ### Q10: How does ShopLite combine shopping cart and promotional code features?
**Expected retrieval context:** Document 2: Shopping Cart Features + Document 15: Promotional Codes and Discounts
**Authoritative answer:** During checkout, ShopLite validates stock and payment methods, while also applying promotional codes for eligible discounts such as percentage, fixed, or BOGO offers. The system ensures accurate totals and prevents coupon misuse.
**Required keywords in LLM response:** ["checkout validation", "promotional codes", "discount application"]
**Forbidden content:** ["no coupon support", "random discounts"]


 ### Q11: How are payments processed securely and linked to refund policies?
**Expected retrieval context:** Document 4: Payment Methods and Security + Document 6: Return and Refund Policies
**Authoritative answer:** ShopLite secures payments with SSL/TLS encryption, tokenization, and fraud detection. Refunds are issued back to the original payment method within 3–7 business days after return approval
**Required keywords in LLM response:** ["SSL/TLS encryption", "tokenization", "refund to original payment method"]
**Forbidden content:** ["refunds to cash only", "no encryption"]

 ### Q12: How can users track their orders and request returns if needed?
**Expected retrieval context:** Document 5: Order Tracking and Delivery + Document 6: Return and Refund Policies
**Authoritative answer:** Users can monitor orders in real time via dashboards, emails, and courier integrations, and if necessary, request returns within 14–30 days through the platform’s return automation system.
**Required keywords in LLM response:** ["real-time order tracking", "14–30 days", "return automation"]
**Forbidden content:** ["no tracking", "no returns allowed"]

 ### Q13: What security features are available in both the web and mobile app?
**Expected retrieval context:** Document 12: Mobile App Features + Document 14: Security and Privacy Policies
**Authoritative answer:** ShopLite implements device authentication, biometric login, encryption in transit and at rest, and GDPR/CCPA-compliant privacy controls across both web and mobile platforms
**Required keywords in LLM response:** ["biometric login", "device authentication", "encryption in transit and at rest", "privacy compliance"]
**Forbidden content:** ["no mobile security", "unencrypted"]

 ### Q14: How does ShopLite ensure inventory accuracy for sellers and buyers? 
**Expected retrieval context:** Document 9: Inventory Management + Document 2: Shopping Cart Features
**Authoritative answer:** ShopLite synchronizes stock levels in real time across dashboards and carts, prevents overselling, and issues low-stock alerts to sellers, ensuring buyers always see accurate availability
**Required keywords in LLM response:** ["real-time synchronization", "low-stock alerts", "overselling prevention"]
**Forbidden content:** ["manual-only updates", "no stock validation"]

 ### Q15: How do reviews influence search results on ShopLite? 
**Expected retrieval context:** Document 3: Product Search and Filtering + Document 7: Product Reviews and Ratings
**Authoritative answer:** Reviews and ratings impact product visibility in search by influencing AI ranking algorithms, making highly rated items appear more prominently in results.
**Required keywords in LLM response:** ["AI ranking algorithms", "reviews influence visibility", "product ratings"] 
**Forbidden content:** ["reviews have no effect", "all products ranked equally"]

 ### Q16: How do ShopLite’s APIs support seller operations? 
**Expected retrieval context:** Document 8: Seller Account Setup + Document 13: API Documentation + Document 9: Inventory Management
**Authoritative answer:** ShopLite APIs let sellers automate product listings, inventory updates, order retrieval, and payment processing, with authentication and rate limits ensuring secure integrations.
**Required keywords in LLM response:** ["API authentication", "inventory updates", "order retrieval"]
**Forbidden content:** ["unlimited access", "no authentication required"]

 ### Q17: How are commissions applied and adjusted when refunds occur?
**Expected retrieval context:** Document 10: Commission and Fee Structure + Document 6: Return and Refund Policies
**Authoritative answer:** Commissions are calculated automatically per sale, but adjusted if a return or cancellation occurs, ensuring sellers are charged only for completed transactions.
**Required keywords in LLM response:** ["automatic commission calculation", "adjustments for returns", "accurate seller charges"]
**Forbidden content:** ["flat fees only", "no adjustments"]

 ### Q18: What support options are available for order-related issues?
**Expected retrieval context:** Document 11: Customer Support Procedures + Document 5: Order Tracking and Delivery
**Authoritative answer:** Users can access support via chat, email, or phone. The AI assistant handles order status and delivery tracking, while complex cases like disputes are escalated to human agents.
**Required keywords in LLM response:** ["AI assistant", "order tracking", "human escalation"]
**Forbidden content:** ["no support available", "AI handles everything without escalation"]

 ### Q19: How are promotional campaigns connected to seller analytics?
**Expected retrieval context:** Document 15: Promotional Codes + Document 8: Seller Account Management
**Authoritative answer:** Sellers can run campaigns with promotional codes, while dashboards and analytics provide insights into redemption rates, sales impact, and engagement, allowing for data-driven improvements.
**Required keywords in LLM response:** ["promotional codes", "analytics", "seller dashboards"]
**Forbidden content:** ["no tracking", "random discounts only"]

 ### Q20: How does ShopLite ensure transparency across orders, payments, and returns?
**Expected retrieval context:** Document 4: Payment Methods + Document 5: Order Tracking + Document 6: Returns + Document 10: Fees + Document 14: Security
**Authoritative answer:** ShopLite provides transparency by logging all payment actions, synchronizing order and delivery updates, enforcing clear return/refund policies, and giving sellers fee breakdowns while securing all data with encryption and compliance measures.
**Required keywords in LLM response:** ["logging", "synchronization", "refund policies", "fee breakdowns", "encryption"] 
**Forbidden content:** ["no transparency", "hidden charges"]


