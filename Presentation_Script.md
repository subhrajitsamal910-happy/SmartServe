# SmartServe AI — Slide-by-Slide Presentation Speaking Script

**Project Title:** SmartServe AI – Intelligent Local Service Booking Platform with Real-Time Fraud Detection & AI Concierge  
**Student Name:** Prasuk Goyal | **Registration No.:** 2505286042  
**Degree:** Master of Computer Applications (MCA) – Batch 2025–2027  
**Institution:** Srusti Academy of Management and Technology (Autonomous), Bhubaneswar  
**Affiliation:** Biju Patnaik University of Technology (BPUT), Odisha  
**Speaking Style:** Natural, calm, student-first English (Approx. 35–45 seconds per slide)  

---

## Slide 1: Project Identity & Welcome

### 🎙️ Speaking Script (Time: ~40 seconds)
> "Good morning, respected external examiner, faculty members, and dear friends.  
> 
> My name is **Prasuk Goyal**, a student of the MCA program, batch 2025 to 2027, at Srusti Academy of Management and Technology. Today, I am excited to present my IBST Mini Project titled **SmartServe AI**.  
> 
> SmartServe AI is a modern, cloud-native web platform that solves the everyday problems people face when discovering and booking local household services—such as home cleaning, electrical repairs, plumbing, painting, and academic tutoring. It combines real-time scheduling with an automated fraud detection engine and an AI concierge assistant to make booking local services safe, simple, and reliable."

### 👉 What to Point to on the Slide:
- **Point to the Title:** Emphasize the name **SmartServe AI**.
- **Point to the Right-Hand Screenshot:** Show the live **Customer Dashboard**, pointing out the service category cards and the live statistics at the top.

### 🔄 Transition to Next Slide:
> *"Let us look at why this project was needed and how it solves real-world booking challenges."*

---

## Slide 2: Problem Statement, Solution & Core Features

### 🎙️ Speaking Script (Time: ~45 seconds)
> "In our daily lives, booking a local plumber or electrician is often frustrating. There are three main problems:
> 1. **High booking friction:** People face scheduling conflicts and double-bookings.
> 2. **Lack of trust:** It is hard to know whether a provider is verified, and prices are often unclear.
> 3. **Spam and fake bookings:** Without automated checks, platforms get overwhelmed by automated bots and malicious bookings.
> 
> **SmartServe AI solves this through four key features:**
> - First, **Automated Conflict Prevention:** The system checks provider availability in real time so two customers never get the same slot.
> - Second, **Multi-Vector AI Fraud Detection:** It scores every booking from 0 to 100 based on velocity and timing. If a booking hits a risk score of 70 or higher, it is immediately flagged for admin review.
> - Third, **Personalized Recommendations:** It suggests top services using a 6-signal formula based on ratings and user preferences.
> - And fourth, an **NLP Chatbot Concierge:** Customers get instant help through dynamic suggestion chips."

### 👉 What to Point to on the Slide:
- **Point to the Red Problem Box:** Mention double-bookings and unverified providers.
- **Point to the Green Solution Box:** Highlight automated conflict checking and fraud scoring.
- **Point to the Right-Hand Screenshot (Booking Modal):** Point to the duration selector and show how the price recalculates automatically without refreshing the page.

### 🔄 Transition to Next Slide:
> *"Now, let me explain the technology stack and architecture that powers these capabilities."*

---

## Slide 3: Technology Stack & System Architecture

### 🎙️ Speaking Script (Time: ~45 seconds)
> "SmartServe AI is built on an enterprise-grade multi-tier architecture, designed for speed, security, and scalability.
> 
> - **At the Presentation Tier (Frontend):** We used **Next.js 14** with the App Router, **React 18**, and **TypeScript**. For the interface, we used **Tailwind CSS** for responsive design, Radix UI for accessible modal dialogs, and Lucide icons.
> - **At the Security and Gateway Tier:** We used **Spring Security 6** with stateless **JWT tokens**. Every API call is verified using HMAC-SHA256, enforcing strict role-based access control for Customers, Providers, and Admins.
> - **At the Business Logic and AI Tier:** Our backend runs on **Java 17** with **Spring Boot 3.5**. This layer hosts our booking engine, our heuristic fraud risk evaluator, and our 6-signal hybrid recommendation engine.
> - **At the Persistence Tier:** We use **PostgreSQL** hosted on **NeonDB Cloud Serverless**, connected through a HikariCP connection pool with SSL security. The database follows a normalized 8-table schema in Third Normal Form."

### 👉 What to Point to on the Slide:
- **Point to the Architecture Diagram on the Left:** Move your hand from Top (Next.js Client) down to Security (JWT Filter), then Business Logic (Spring Boot), down to NeonDB Cloud PostgreSQL.
- **Point to the Security Tier:** Highlight that authentication is completely stateless with JWT.

### 🔄 Transition to Next Slide:
> *"Next, I would like to walk you through our development workflow and our automated verification results."*

---

## Slide 4: Development Process, Prompts & Test Verification

### 🎙️ Speaking Script (Time: ~45 seconds)
> "We followed an agile 5-stage engineering lifecycle:
> 1. We started with the **Product Requirements Document (PRD)** and user stories.
> 2. We designed the **8-table normalized database schema** and secured it with Spring Security.
> 3. We implemented the **AI fraud scoring** and **recommendation algorithms**.
> 4. We built the responsive **Next.js 14 frontend** with the booking modal and interactive chatbot.
> 5. Finally, we conducted rigorous **automated testing**.
> 
> During development, we used prompt-driven engineering with Google Antigravity to scaffold the core services—for example, designing the heuristic fraud engine and building the intent-matched chat concierge.
> 
> Most importantly, to guarantee reliability, we executed a complete **automated test suite of 45 test cases** across authentication, booking flows, fraud scoring, recommendations, and admin telemetry. **All 45 tests passed successfully, achieving a 100% pass rate.**"

### 👉 What to Point to on the Slide:
- **Point to the Prompts Box:** Show how prompts were used to accelerate the development of the fraud engine and chat assistant.
- **Point to the Green Test Results Box:** Emphasize **45 / 45 Tests Passed (100% Pass Rate)**.
- **Point to the Admin Analytics Screenshot:** Point to the real-time counters showing confirmed vs. flagged bookings.

### 🔄 Transition to Next Slide:
> *"To conclude our presentation, let us look at the repository deliverables and future roadmap."*

---

## Slide 5: Project Conclusion, Repository & Thank You

### 🎙️ Speaking Script (Time: ~35 seconds)
> "In conclusion, SmartServe AI demonstrates that a college project can be built to industry standards:
> - It is a fully functional full-stack platform with real-time scheduling.
> - It includes built-in protection against fraudulent and abusive bookings.
> - It is backed by verified cloud persistence and 100% test coverage.
> 
> The entire project source code, database migrations, and documentation are publicly available on GitHub at the repository shown on screen. You can scan the QR code right now with your phone to open the live repository.
> 
> In the future, we plan to extend this platform with a mobile application built in React Native or Flutter, and integrate live Stripe or Razorpay payment webhooks.
> 
> Thank you very much for your time and kind attention. I am now happy to answer any questions."

### 👉 What to Point to on the Slide:
- **Point to the QR Code:** Encourage the examiner to scan the QR code with their phone camera to view the GitHub repository.
- **Point to the Conclusion Points:** Briefly reinforce cloud persistence and automated testing.
- **Conclude with a warm smile and open stance for questions.**

---

# 🎓 Common Examiner / Teacher Questions & Simple Answers

Here are the questions teachers most frequently ask during MCA project vivas, along with simple, confident answers you can use:

### Q1: What makes your project different from existing platforms like Urban Company or Justdial?
> **Answer:**  
> "Urban Company uses manual customer-support dispatching, and Justdial is primarily a search directory where providers must be called manually. SmartServe AI provides instant, direct booking with automated real-time slot conflict checks, an intelligent fraud scoring engine that stops spam bookings before they confirm, and a built-in AI concierge for customer guidance."

### Q2: How does your AI Fraud Detection Engine actually work? Is it a machine learning model?
> **Answer:**  
> "In this version, it is a multi-vector heuristic algorithm rather than a black-box neural network. It calculates a dynamic risk score between 0 and 100 based on four practical factors: booking velocity (more than 2 bookings per minute), repetitive identical orders, off-hour slot scheduling (such as late midnight), and previous flagged booking history. If the combined score exceeds 70 points, the booking is automatically flagged for administrative review."

### Q3: Why did you choose Next.js 14 for the frontend instead of plain React or HTML/CSS?
> **Answer:**  
> "Next.js 14 gives us server-side rendering and client-side transitions using the App Router. It is type-safe with TypeScript, offers faster initial page loads, and integrates seamlessly with Tailwind CSS for a modern, responsive layout that works on both mobile devices and desktops."

### Q4: How is security handled in your backend?
> **Answer:**  
> "We implemented Spring Security 6 with stateless JSON Web Tokens (JWT). When a user logs in, passwords are encrypted using BCrypt, and a signed HMAC-SHA256 bearer token is returned. All subsequent API calls must pass through our `JwtAuthenticationFilter`, which verifies the token and enforces Role-Based Access Control for Customers, Providers, and Admins."

### Q5: How did you test your application?
> **Answer:**  
> "We wrote and executed an automated end-to-end test suite containing 45 test cases across six test suites: Authentication, Service Catalog, Booking Workflow, AI Fraud Engine, AI Recommender, and Admin Analytics. Every single test passed with 100% accuracy, verifying both normal operations and edge cases like double-bookings and fraud triggers."

### Q6: What are the current limitations of this project?
> **Answer:**  
> "Currently, payments are simulated with transactional status tracking rather than connected to live bank accounts, and the application runs as a responsive web app rather than a native mobile application. In our future scope, we have planned React Native mobile apps and live Stripe/Razorpay payment webhooks."
