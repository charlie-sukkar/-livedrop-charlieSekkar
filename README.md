# Live Drops Flash-Sale Platform

Excalidraw diagram: 
https://excalidraw.com/#json=l44R37i053-46TjZJzWpl,LhliHXnIN0HYJ3chZHOG4Q

**note** In this system design, each drop is limited to a single product if we change the design so that a drop can include multiple products we then need an inventory service with it's own database to handle stock updates and locking when an order is placed 

## overview
This system allows creators to run limited-inventory live product drops. Users can follow creators, receive real-time notifications, browse products, and place orders without overselling.

## Architecture
- Clients: web & mobile
- API Gateway: Single entry point (single public API)
- Services: Authentication, Authorization, Follows, Drop, Notification, Product, Order, Audit trail, Monitoring service
- Queues: Order queue, Notification Queue
- Cache: Follower Cache, Drop Cache, Product Cache
- CDN 
- Blob storage (Amazon S3)

## Database Tables
   Indexes on frequently accessed data to ensure faster queries and lower latency
| Table | Columns | Indexes |
|-------|---------|--------|
| Users | userId (PK), name, email, password | email (unique) | |
| Creators | creatorId (PK), name, email, password, bio, birthday| creatorId |
| Follows | creatorId, userId | creatorId, userId, (creatorId,userId) unique |
| Products | prodId (PK), name, desc, price | prodId |
| Drops | dropId (PK), creatorId, prodId, currentStock, initStock, lowStock, startTime, endTime, status | creatorId, status, startTime, (creatorId,status) |
| Orders | orderId (PK), userId, dropId, status, amount, idempotencyKey | |
| Notifications | Id (PK), userId, Message, CreatedAt | 


## services
The system is designed using a microservices architecture to handle high traffic loads and efficiently manage a large-scale database

- API Gateway 
  - Flexible queries for browsing data
  - Allow efficient data fetching for mobile/web clients with limited network 
  - Centralized entry point for all client requests
  - Handles authentication and authorization

  **note** The API Gateway enforces authorization, ensuring that users can only access their own orders and follow relationships. This is done based on tokens issued by the Authentication service

- Authentication 
  - Validates user credentials
  - verify passwords (hashing)
  - Issues tokens (e.g JWT token) for session management

- follow service 
  - Allows user to follow/unfollow a creator
  - Lists all followers for a creator
  - Lists all creators that a user follows
  - checks wether user A follows user B
  
- Drop service 
  - updates product stock
  - 1 drop = 1 product
  - allows creators to start a drop with a specified finish time 
  - prevents overselling by using locks on the stocks
  - emit events -> lowStock, soldOut, dropStart

- Product service
  - Manages products (create, update and delete)

- Order service
  - Validates orders
  - Rejects invalid or bad order requests
  - Tracks idempotency to prevent duplicates orders
  - Communicates with drop service to update stock level
  - Finalises transactions once the order is confirmed   <!-- so no payment service -->
  - Emit order confirmed events

- Notification service
  - Recieves events from Drop Service and Order Service
  - Allows users to see updates instantly, like when a drop starts, stock changes, or an order is confirmed
  - Sends real time updates to specific consumers via WebSockets

- Audit trail service 
  - Stores important events such as placing an order and following or unfollowing a creator, updatimg a product etc..
  - Records who performed the action and when it happened
  - Ensures traceability and accountability for user actions

- Monitoring service 
  - Collects metrics to monitor system performance (request volume, latency, cache hit ratio, lock contention, follower-list performance)

##  public API

 - API Post/follow
 {
   creatorId,
   userId
 }

 - API Delete/follow
 {
    creatorId
   userId
 }

 - Api Get/followers/:creatorId

 - API Get/following/:userId

 - API Get/isFollowing?creatorId=..&userId=..

 - API Post/createProd
 {
   prodId
   name
   desc
   price
 }

 - API Post/createDrop
 {
   dropId,
   creatorId
   startTime
   endTime
   currentStock
   lowStock   <!-- low stock threshold -->
 }

 - API Get/products?status=..&creatorId=..&page=..&limit=.. <!-- the browsing of the products is page_based explained in the obseravation part -->

 - API Post/order
 {
   dropId,
   userId,
   productId,
   quantity,
   idempotencyKey,
 }


## Internal APIs 
Internal APIs between services are implemented using **RPC (Remote Procedure Call)**, which allows one service to directly invoke functions or methods on another service over the network. This approach provides low-latency communication for critical operations, such as reserving stock or sending notifications, while keeping these endpoints private from external clients.

  - order service -> drop service
  - all core services -> monitoring service
  - all core services -> audit trail service
 



## observations

- this design requires strong consistency to ensure accurate stock count, reliable transactions so we are using an sql database such as PostgreSQL
- Monitoring service collects metrics (request volume, latency, cache hit ratio, lock contention, follower-list performance) from all core services to track system health and performance
- Browsing products will use page-based pagination, since the data doesn't frequently   change (because it's mostly static, users won't miss rapid updates) and the number of products is relatively small
- Browsing followers will use cursor-based pagination because some creators have a very large number of followers, and the data changes frequently due to follow/unfollow actions
- The Notification service delivers real-time updates to users via WebSockets (delivered within 2s)
- To avoid overselling , drop service lock the stocks 
- Redis cache + queues(kafka) + DB Sharding(followers DB) handle 500 rps sustained and 150 order attempts/s
- Read queries served via cache/CDN ensure (p95) <= 200ms


## Tradeoffs

-  Some creators have a very large number of followers, which can cause bottlenecks and high latency when retrieving follower data. To mitigate this, we use sharding/hashing for horizontal scaling and cache frequently accessed follower lists in Redis to improve performance.
- Since read queries (product browsing, follower lists, stock status) can overwhelm the system, we introduce caches(redis) for frequently accessed data
- To handle high traffic, the Notification service uses a message queue(kafka) to buffer and process events efficiently.
- During live drop, a Large number of orders could overwhelm the system , so we used an order queue to ensure the drop service update stocks and prevent overselling
- To ensure high availability we use horizontal scaling so that the load balancer automatically routes traffic away from failed instance 
- The API uses graceful degradation to provide essential data when network conditions are poor ensuring the client still functions properly
- Without rate limiting at the API Gateway, the system is vulnerable to abuse, traffic spikes, and resource exhaustion, which can degrade performance and lead to outages during high-demand events.
 

## caching strategy with invalidation

cached data :
 - frequently read (product details)
 - relatively static 
 - Expensive to compute or fetch from DB (follower lists -> expensive to query millions of rows)

Invalidation strategies
 - TTL : each cached object automatically expires after a set of time (good for product info)
 - Write-back: When DB is updated update or invalidate the cashe immediately(good for critical data like stocks)
 


