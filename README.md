# 🍳 RecipeHub – Premium Recipe Sharing & Culinary Platform

RecipeHub is a modern, high-performance web application designed for food enthusiasts to create, share, discover, and manage recipes. Engineered with a decoupled modern full-stack architecture, it features secure enterprise-grade authentication, Stripe-powered premium tiers, multi-layered dashboards, and an ultra-responsive user experience.

🔗 **Live Deployment:** [https://recipe-5uujpf5b6-nishitasarkers-projects.vercel.app](https://recipe-5uujpf5b6-nishitasarkers-projects.vercel.app)  
💻 **Backend API:** [https://recipehub-server-side.vercel.app](https://recipehub-server-side.vercel.app)

---

## 🛠️ Technology Stack & Frameworks

This platform is built with cutting-edge tools to ensure blazing-fast performance, type-safe operations, and seamless user interaction:

* **Frontend Framework:** Next.js (v16.2.6) leveraged with Turbopack for instant hot-module replacements and optimized production builds.
* **UI & State Library:** React.js utilizing asynchronous state lifting, reactive hooks (`useEffect`, `useState`), and advanced context managers.
* **Animation Engine:** Framer Motion / Motion for smooth, interactive transitions and premium UI micro-interactions.
* **Styling Engine:** Tailwind CSS providing a utility-first, fully fluid, dual-theme (Dark/Light) accessible layout ecosystem.
* **Authentication & Security:** Better Auth / Custom JWT Client implementing secure HTTP-Only cookie contexts, dynamic token rotation, and Google OAuth integration.
* **Payment Gateway:** Stripe API managing seamless micro-transactions for recipes and premium tier memberships.
* **Image Hosting:** ImgBB API for secure, on-the-fly multi-part image uploads.
* **Backend Support:** Node.js / Express.js REST API handling high-throughput MongoDB interactions.

---

## 🔒 Critical Engineering Problems Solved

* **Fatal JSON Parsing Overrides:** Engineered a custom network interceptor that explicitly inspects headers (`content-type`) before running `.json()`. If an internal server error or gateway timeout returns HTML text instead of JSON, the client cleanly catches the exception, preventing application-wide crashes.
* **Double-Click Transaction Guard:** Integrated strict local state tracking (`bookingLoading`/`paymentLoading`) that instantly mutates action buttons into a disabled state upon press. This completely eliminates race conditions and duplicate database writes during Stripe checkout or recipe creation.
* **Route Hydration & Auth Persistence:** Implemented custom loading middleware to guarantee that private dashboards remain fully authenticated upon manual page refreshes, resolving asynchronous session state mismatches.

---

## 🎯 Application Features & Core Actions

### 👥 User Dashboard & Experience
* **Dual Member Tier:** Standard users can publish up to **2 recipes max**. Upgrading to Premium via Stripe unlocks unlimited posting and adds a verified premium profile badge.
* **Recipe Showroom & Interactivity:** Fully filterable dynamic search engine utilizing MongoDB `$in` operators. Users can like, favorite, and purchase premium recipes.
* **Reporting Gateways:** Community-driven moderation allowing users to flag content for Spam, Offensive Content, or Copyright Issues.

### 🛡️ Admin Management Cluster
* **Platform Overview:** Live metrics tracking Total Users, Recipes, Premium Members, and Active Reports.
* **Content Moderation:** Full CRUD access over recipes, including a **Featured Recipe** toggle that hooks directly into the homepage global slider.
* **User Control:** Instant Block/Unblock actions to maintain platform integrity.

---

## 📊 Database Architecture

The system utilizes highly optimized MongoDB collections structured as follows:

### 👤 `users`
```json
{
  "name": "String",
  "email": "String",
  "image": "String",
  "role": "String (User/Admin)",
  "isBlocked": "Boolean",
  "isPremium": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}

🍲 recipes
{
  "recipeName": "String",
  "recipeImage": "String",
  "category": "String",
  "cuisineType": "String",
  "difficultyLevel": "String",
  "preparationTime": "Number",
  "ingredients": "Array",
  "instructions": "String",
  "authorId": "ObjectId",
  "authorName": "String",
  "authorEmail": "String",
  "likesCount": "Number",
  "isFeatured": "Boolean",
  "status": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
💡 Note: Additional fully-mapped schemas exist for favorites, reports, and payments to track real-time transactional logs.

📦 Local Installation & Setup Guide
Get a local copy of RecipeHub running in under 2 minutes:

1. Clone the Asset Cluster

git clone git clone https://github.com/Nishitasarker/RecipeHub.git
cd RecipeHub

2. Deploy Local Dependencies

npm install
# or
yarn install

3. Configure Environment Matrix
Create a .env.local file inside the root directory:

NEXT_PUBLIC_SERVER_URL=https://recipehub-server-side.vercel.app
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
NEXT_PUBLIC_IMGBBB_API_KEY=your_imgbb_key
BETTER_AUTH_SECRET=your_auth_secret

4. Launch Application Context (Turbopack Engine)

npm run dev

Open http://localhost:3000 inside your browser to view the client instance locally.

⚠️ Copyright & Intellectual Property
All rights reserved. This repository and its full source code are the exclusive intellectual property of the author. No part of this application may be copied, reproduced, modified, or distributed without explicit written permission from the owner.

Maintained and created with absolute care by Nishita Sarker Jui