# SmartServe AI — Quick Reference Guide & Cheat Sheet

**Project Title:** SmartServe AI – Intelligent Local Service Booking Platform with Real-Time Fraud Detection & AI Concierge  
**Student Name:** Prasuk Goyal | **Registration Number:** 2505286042  
**Degree & Batch:** Master of Computer Applications (MCA), Batch 2025–2027  
**Department & College:** Post Graduate Department of Computer Applications, Srusti Academy of Management and Technology (Autonomous), Bhubaneswar  
**University Affiliation:** Biju Patnaik University of Technology (BPUT), Rourkela, Odisha  
**Project GitHub Repository:** [https://github.com/subhrajitsamal910-happy/SmartServe.git](https://github.com/subhrajitsamal910-happy/SmartServe.git)  

---

## 1. Project At A Glance

| Field | Detail |
| :--- | :--- |
| **Confirmed Project Name** | **SmartServe AI** |
| **One-Sentence Description** | A cloud-native full-stack local service marketplace that enables instant conflict-free booking, automated multi-vector fraud detection, and personalized AI service recommendations. |
| **Primary Domain** | Hyper-local On-Demand Service Discovery & Scheduling (Home Cleaning, Electrical, Plumbing, Painting, Tutoring) |
| **Architecture Type** | Multi-Tier Client-Server Architecture (Next.js 14 SPA + Java Spring Boot 3.5 REST Backend + Serverless PostgreSQL) |
| **Development Period** | Industry-Based Summer Training (IBST) Project (September – October 2026) |
| **Automated Test Results** | **45 out of 45 Tests Passed (100% Pass Rate)** |

---

## 2. Problem & Solution Summary

### The Problem:
- **Scheduling Conflicts:** Traditional local booking involves phone calls and manual agreements that frequently lead to double-booked time slots.
- **Provider Uncertainty:** Customers struggle to find verified local technicians with transparent pricing and trustworthy ratings.
- **Vulnerability to Spam:** Digital booking portals without server-side validation are vulnerable to bot spam, high-velocity fake reservations, and off-hour abuse.

### The Solution:
- **Instant Conflict-Free Scheduling:** An automated booking engine checks provider calendar availability in real time, locking valid slots and rejecting overlaps.
- **Transparent Multi-Tier Pricing:** Base rates and duration-based pricing (1 to 8 hours) recalculate instantly in the interactive modal.
- **Multi-Vector AI Fraud Guard:** A heuristic risk engine calculates risk scores (0–100) on every booking; requests scoring $\ge 70$ are flagged and held for admin review.
- **Hybrid Recommendation Engine:** Ranks marketplace services based on user category affinity, star ratings, and overall booking popularity.

---

## 3. Target Users & Stakeholders

1. **Customers:** Local residents seeking convenient, on-demand home cleaning, repairs, painting, or tutoring with upfront pricing and verified reviews.
2. **Service Providers:** Certified local professionals who manage their service profiles, view confirmed appointments, and build reputation scores.
3. **Platform Administrators:** Operations managers who inspect system KPI telemetry, monitor flagged bookings, review fraud logs, and manage provider rosters.

---

## 4. Verified Technology Stack

| Layer | Technologies Used | Key Purpose & Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router)** with **React 18** | Fast client-side transitions, server-side rendering support, and modular page layouts. |
| **Language (Frontend)** | **TypeScript** | Static typing prevents runtime JavaScript errors and guarantees API contract alignment. |
| **Styling & UI** | **Tailwind CSS**, **Radix UI**, **Lucide Icons** | Utility-first responsive styling with accessible dialogs and modern design tokens. |
| **Backend Framework** | **Java 17** & **Spring Boot 3.5** | High-throughput, robust enterprise framework with automated dependency injection. |
| **Security & Auth** | **Spring Security 6** & **JWT (HMAC-SHA256)** | Stateless bearer token authentication with Role-Based Access Control (`CUSTOMER`, `PROVIDER`, `ADMIN`). |
| **Database** | **PostgreSQL** on **NeonDB Cloud Serverless** | Reliable relational ACID compliance, SSL channel binding, and serverless auto-scaling. |
| **ORM & Persistence** | **Spring Data JPA** / **Hibernate**, **HikariCP** | Object-Relational Mapping with connection pooling for optimal database concurrency. |
| **API Documentation** | **SpringDoc OpenAPI 3.0** / **Swagger UI** | Interactive browser documentation and testing console at `/swagger-ui/index.html`. |
| **Real-Time Updates** | **STOMP over WebSocket** | Bidirectional push notifications for booking confirmations and status changes. |

---

## 5. Main Verified Features

1. **Categorized Service Discovery:** Filterable catalog (Home Cleaning, Electrical, Plumbing, Tutoring, Painting) with star ratings and real-time provider availability tags.
2. **Interactive Dynamic Booking Modal:** Real-time date-time picker, duration slider (1–8 hours), automatic price recalculation, and address input.
3. **Multi-Vector Fraud Detection Engine:** Computes risk scores based on:
   - *Velocity Spikes:* $+30$ points if user creates $>2$ bookings in 1 minute.
   - *Repetitive Orders:* $+25$ points if identical service ordered $>2$ times rapidly.
   - *Off-Hour Scheduling:* $+15$ points for anomalous midnight slot requests.
   - *Historical Flags:* $+25$ points if the account has previous flagged bookings.
   - *Gate Action:* Risk Score $\ge 70 \rightarrow$ **FLAGGED** (payment hold); $< 70 \rightarrow$ **CONFIRMED**.
4. **Hybrid 6-Signal Recommendation Engine:** Weights collaborative filtering ($34\%$), average star ratings ($20\%$), category preference ($18\%$), popularity ($16\%$), recent activity ($10\%$), and freshness ($2\%$).
5. **Interactive AI Concierge Chatbot:** Floating widget with NLP intent classification, suggestion chips (*"Top services"*, *"How do I book?"*, *"Fraud scoring"*), and fallback responses.
6. **Administrator Telemetry Cockpit:** Real-time counters showing confirmed bookings, flagged bookings, available providers, and simulated payment volume.

---

## 6. Key Technical Terms (Simple Explanations)

- **JWT (JSON Web Token):** A secure, encrypted digital badge that proves the user is logged in. The frontend sends it in the HTTP header with every request so the backend knows who is asking without checking a session table.
- **Stateless Authentication:** The server does not store user sessions in memory. Every request contains all the information needed to authenticate, making the server faster and easier to scale.
- **ORM (Object-Relational Mapping):** A library (Hibernate) that translates Java objects into database table rows and vice versa, so we do not have to write raw SQL strings for everyday operations.
- **NeonDB:** A modern cloud database service that runs PostgreSQL serverless in the cloud, allowing our application to connect securely from anywhere using SSL.
- **Heuristic Engine:** A rule-based decision algorithm that evaluates multiple real-world factors (velocity, timing, history) to produce an immediate risk score, without needing months of training data like a neural network.
- **3NF (Third Normal Form):** A database design standard that eliminates redundant data and prevents anomalies when inserting, updating, or deleting records.

---

## 7. Known Limitations & Future Roadmap

### Current Limitations (To Acknowledge Honestly):
1. **Simulated Payments:** The payment workflow simulates successful transaction IDs and risk holds; it is not yet connected to live banking APIs.
2. **Web-First Client:** The frontend is a responsive web application (works on desktop and mobile browsers), but native Android/iOS mobile apps are not yet built.
3. **Rule-Based Fraud Scoring:** While fast and transparent, the fraud engine uses fixed heuristic weights rather than self-learning neural networks.

### Future Roadmap:
- **Mobile Apps:** Build native cross-platform mobile apps using React Native or Flutter.
- **Production Payment Gateways:** Integrate live Stripe / Razorpay webhooks for automated refunds and payouts.
- **Advanced Machine Learning:** Train deep neural collaborative filtering models using PyTorch/TensorFlow as user interaction datasets grow.

