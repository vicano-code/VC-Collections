# VC-Collections - Final Project for ALX Software Engineering Course

This repository contains the code for a full-featured e-commerce website developed using the MERN stack. The website offers a seamless shopping experience with a range of functionalities like product browsing, cart management, and secure checkout, along with an admin dashboard for product and user management.

## Tech Stack
### Frontend
- HTML, CSS, JavaScript
- React for building the user interface
- Redux for state management
- Bootstrap for responsive styling

### Backend
- Node.js and Express for server and API management
- MongoDB for the database

## API Integrations
- Stripe payment gateway for secure transactions
- Redis (hosted on Render) for optimized data handling and caching
- Ngrok for testing Stripe webhooks in a local environment

## Version Control
- Git/GitHub for version control and collaboration

## Hosting
Frontend hosted on Vercel
Backend hosted on Render

## Features
- Product Page: Browse products with the ability to filter by category.
- User Authentication: Users can sign up, log in, and log out securely.
- Cart Functionality: Add and manage products in a shopping cart.
- Checkout Process: Complete orders using the Stripe payment gateway.
- Admin Page: Manage products and users with advanced admin functionality.

## Installation
To run this project locally, ensure you have Node.js installed on your machine and a MongoDB Atlas account.
1. Clone the repository:
```bash
git clone https://github.com/vicano-code/vc-collections.git
cd vc-collections
```
2. Install dependencies:
- Frontend:
```bash
cd client
npm install
```
- Backend:
```bash
cd ../server
npm install
```
3. Environment Variables: Create a .env file in the server directory and add your environment variables for MongoDB, Stripe, and Redis configuration.
4. Run the application:
- Backend:
```bash
cd server
npm run dev
```
- Frontend (on another terminal and in the project directory)(
```bash
cd client
npm start
```
5. Testing Stripe Webhooks (Optional): Use [ngrok](https://ngrok.com/) to expose your local server and configure Stripe to send webhook events.

## Usage
- Product Browsing: Users can view available products and filter them by categories.
- Authentication: Secure login, signup, and logout.
- Shopping Cart: Add products to the cart, review items, and adjust quantities.
- Checkout: Proceed with the checkout process using the integrated Stripe payment gateway.
- Admin Dashboard: Manage product inventory and user information.

## Deployment
- Frontend: Hosted on [Vercel](https://vercel.com/)
- Backend: Hosted on [Render](https://render.com/)

## Contributing
Contributions are welcome! Please create a pull request or open an issue to discuss improvements, fixes, or suggestions.

## Author
** Victor Chukwudi Anokwuru **
- [GitHub Profile](https://github.com/vicano-code)
- [Linkedin](https://www.linkedin.com/in/victor-anokwuru-19091a81)
