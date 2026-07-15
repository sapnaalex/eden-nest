# Eden Nest 🐦🐰

An integrated, production-ready management application designed for **Eden Nest Pets**—a boutique pet sales and specialized boarding business. 

This project is built as the Integrated Software Engineering Capstone Project for the Product Engineering Proficiency & DSA Mastery Bootcamp. It leverages modern full-stack engineering, custom data structures for resource scheduling, and AI-driven care recommendations.

---

## 🚀 Project Overview

**Eden Nest Manager** streamlines day-to-day operations for bird, rabbit, and fish sales and boarding. The system addresses the unique real-world workflows of the business:
* **Hybrid Boarding Logistics:** Handles boarding for pets where owners either bring their own cages ("Owner Cage") or utilize limited shop resources ("Shop Cage").
* **Active Inventory Tracking:** Manages the live catalog of birds and rabbits available for sale.
* **Intelligent Care Engine:** Uses AI to generate custom diet and care schedules based on customer inputs.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), Tailwind CSS, TypeScript
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL / SQLite (via Prisma ORM)
* **AI Integration:** Gemini API (for automated care-sheet and diet-plan generation)

---

## 📐 Core Engineering Pillars

### 1. Data Structures & Algorithms (DSA)
* **The Problem:** While boarding capacity is flexible for clients bringing their own cages, "Shop Cages" are a strictly limited resource. Overbooking shop cages leads to operational friction.
* **The Solution:** We implement an **Interval Tree** in TypeScript. 
  * Each node in the tree represents a confirmed boarding interval `[start_date, end_date]` requiring a shop cage.
  * When a new booking is requested, the system queries the Interval Tree in $O(\log n)$ time to check for overlaps and verify if a shop cage is available.
  * *Fallback:* If no shop cages are free, the system prompts the booking flow to require an "Owner Cage."

### 2. Product Engineering
* **Dashboard Interface:** A clean, responsive dashboard displaying currently boarded pets, feeding instructions, and active sales listings.
* **Operational Workflows:** Seamless transition from booking request to active boarding status, tracking food and supplies brought by owners.

### 3. AI Integration
* **Eden Care AI:** An LLM-powered helper that parses custom food details and pet details submitted by the owner to generate optimized feeding alarms, care sheets, and transition schedules for the boarding staff.

### 4. Open Source Collaboration
* Fully modularized component structure.
* Adherence to clean coding practices with strict ESLint and Prettier configurations.
* Contributions managed via documented feature branches and Pull Requests.

---

## 📅 Development Roadmap (Sprint: July 16 - July 22)

* **July 16 (Day 1):** Project Initialization, Database Schema Setup (Users, Pets, Bookings, Inventory).
* **July 17 (Day 2):** Backend API Development (CRUD operations for bookings and pet sales).
* **July 18 (Day 3):** Implementation & Unit Testing of the **Interval Tree** scheduling algorithm.
* **July 19 (Day 4):** Frontend Dashboard & Booking Form Development.
* **July 20 (Day 5):** AI Care Assistant Integration (Gemini API pipeline setup).
* **July 21 (Day 6):** Integration, End-to-End Testing, and Open-Source documentation (`CONTRIBUTING.md`).
* **July 22 (Day 7):** Deployment, Final Polish, and Demonstration.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
