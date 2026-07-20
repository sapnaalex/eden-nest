# 🏡 Eden Nest Pets — Management & AI Care Advisory System

An integrated management platform designed for avian and small-animal retail tracking, cage boarding logistics, custom Data Structures & Algorithms (DSA) execution, and AI-driven care recommendations.

---

## 📌 Project Overview
Eden Nest Pets combines an e-commerce inventory management catalog with a boarding placement system. Built with a Node.js/Express backend, a Next.js frontend dashboard, a custom Java DSA engine for booking conflicts and task scheduling, and an AI integration using OpenRouter / Google Gemini endpoints to generate dynamic pet care plans.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Next.js (App Router), Tailwind CSS, `react-markdown`
* **Backend:** Node.js, Express.js, Sequelize ORM, SQLite Database
* **DSA Engine:** Java (Interval Tree for booking date overlap checks, Min-Heap Priority Queue for daily care task scheduling)
* **AI Integration:** OpenRouter API / Google Gemini Integration (`/api/ai/care-plan`)

---

## 🚀 API Endpoint Index (11 Endpoints)

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new user or administrator accounts.
* `POST /api/auth/login` — Authenticate users and return JWT access tokens.

### 🏷️ Inventory CRUD (`/api/inventory`)
* `POST /api/inventory/` — Add a new pet or item to retail stock.
* `GET /api/inventory/` — Retrieve all retail inventory records.
* `GET /api/inventory/:id` — Fetch details for a specific animal or item ID.
* `PUT /api/inventory/:id` — Update pricing, quantity, or availability status.
* `DELETE /api/inventory/:id` — Remove an item record from the inventory.

### 🗓️ Boarding Logistics (`/api/bookings`)
* `POST /api/bookings/` — Submit a cage placement request.
* `GET /api/bookings/` — List active and historical boarding reservations.
* `DELETE /api/bookings/:id` — Cancel an existing boarding placement.

### ✨ AI Smart Care Advisor (`/api/ai`)
* `POST /api/ai/care-plan` — Generate customized daily feeding and care routines via AI.

---

## ⚙️ Local Setup & Run Guide

### 1. Prerequisites
* **Node.js:** v18+
* **Java:** JDK 21+

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```
### 3. Backend Setup

# Install dependencies
```
npm install
```
# Start Express backend server
```
node server.js
```

### 4. Java DSA Core Module
```Bash
cd dsa-core
javac CageScheduler.java
java CageScheduler
```
### 5. Frontend Setup
```Bash
cd client
```

# Install frontend dependencies
```
npm install
```

# Run Next.js development server
```
npm run dev
```
