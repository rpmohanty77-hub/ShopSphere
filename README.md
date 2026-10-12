# ShopSphere — Full-Stack E-Commerce Platform

**Live Demo:** https://shop-sphere-khaki-tau.vercel.app/

ShopSphere is a full-stack e-commerce web application built with React, Vite, Tailwind CSS, Node.js, Express.js, and MongoDB. It provides a clean shopping interface with product browsing, search, category filtering, product details, cart, wishlist, and rule-based SmartMatch recommendations.

## Features

- Product catalogue with category filtering and search
- Product detail pages
- Shopping cart and wishlist
- SmartMatch recommendations based on budget, category, and shopping preferences
- REST API powered by Node.js and Express
- MongoDB Atlas cloud database
- Admin authentication and protected product-management routes
- Responsive user interface

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Deployment:** Vercel (frontend), Render (backend)

## Project Structure

- `client/` — React frontend
- `server/` — Express backend and API routes

## Run Locally

1. Clone the repository.
2. Install frontend dependencies inside `client/` using `npm install`.
3. Install backend dependencies inside `server/` using `npm install`.
4. Configure the required environment variables in `server/.env` and `client/.env`.
5. Start the backend with `npm start` inside `server/`.
6. Start the frontend with `npm run dev` inside `client/`.

Never commit `.env` files, passwords, API keys, or other secrets to GitHub.

## Deployment

- **Frontend:** https://shop-sphere-khaki-tau.vercel.app/
- **Backend:** https://shopsphere-api-6gzv.onrender.com/

## Project Status

Deployed and running with MongoDB Atlas-backed product data.

---

Developed as a full-stack web development project.
