# Setting up the AI  

**Role**: Expert Frontend Developer

**Objective**: Build a responsive, accessible and minimal frontend UI for an e-commerce shop.

## Design System

- Follow Atomic Design:
  - Structure components as Atoms, Molecules, Organisms, Templates, and Pages
- Use PascalCase naming for all components
- Ensure reusability:
  - If a component can be reused, refactor it and apply it across relevant contexts

## Technical Requirements

- Use Tailwind CSS exclusively
  - Apply a consistent spacing scale throughout
- Code must be: Clean and high quality Also Avoid unnecessary logic or markup  
- Atomize when it helps and don't use custom hooks if the logic is not repeated  
- Include accessibility features:
  - Use `aria-label` and semantic roles for form controls
  - Implement focus trapping in modals and dialogs
- Handle **errors and edge cases** gracefully when needed
- include tests and storybook where is necessary

## Developer Experience

- Provide clear inline comments explaining complex logic or design decisions
- Ensure the layout is fully responsive across breakpoints

## Prompts

**notes:** These prompts were used to scaffold components, pages, and logic using AI. Some were clarified further after testing and refining the output. In between, discussions helped determine structure and best practices. Some designs were fine-tuned manually or with AI — including navigation buttons, refactoring, and reusable atoms.
  
### Mock Data and APi

- Create mock data for 20 products in JSON format, and implement a mock API with the following functions: listProducts(), getProduct(id), getOrderStatus(id), and placeOrder(cart)
- Implement currency formatting for price tags
- Set up store.ts with Zustand or React Context to manage cart state

### Assistant Setup & Store logic

- Create a ground-truth file in JSON format containing 20 Q&A pairs  
- Implement engine.ts that:
  - Matches questions against ground-truth.json by keyword overlap
  - Detects order IDs (`[A-Z0-9]{10,}`) and fetches status via getOrderStatus(id)
  - Returns best answer with citation [Qxx], or refuses if confidence is low or out of scope
- Set up store.ts to persist the cart and support panel state, including cart items and whether each panel is open or closed

### Support Panel

Create a global SupportPanel component, create a button to access this support panel know that this panel should be gloabel and accessible on any page  

### Cart Drawer Setup

Create a global CartDrawer component that displays line items with quantity controls (+/-), a remove button, and a total price using currency formatting.  

### Header Component

Create a Header with a store logo and title. Include a SupportButton and an optional CartButton (not used in all pages).  

### Catalog Setup

Create a catalog.tsx page that displays a responsive product grid using mock data. Each product card should show the title, price, image, and an “Add to Cart” button. Include client-side search, price sorting (asc/desc), and tag filtering. Use React Router so that clicking on a product navigates to its product details page.

### Product Page

Create a ProductPage that displays product details based on the route param :id. Include title, image, description, price (formatted), and an “Add to Cart” button.Render 3 related items by shared tag. Don't forgrt to follow atomic design.

### Cart Page

Create a CartPage that displays all cart items with quantity controls (+/-), a remove button, and a total price using currency formatting. Use global state from useCartStore() to manage items and updates. Refactor the CartDrawer by identifying and extracting repeated UI patterns

### Checkout Page

Create a CheckoutPage that displays a payement summary no real payement.

### OrderStatusPage

Creat an OrderStatusPage that displays order details based on the route param :id. Include order ID, date, status, carrier, and ETA. Use mock data or global state. Do not include the Header component. Add a global SupportButton.
