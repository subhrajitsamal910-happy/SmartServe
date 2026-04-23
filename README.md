# SmartServe AI - Intelligent Local Service Booking Platform

SmartServe AI is a production-style split-stack project with a Spring Boot 3.5 API backend and a Next.js frontend for discovering, booking, rating, recommending, and monitoring local services. It includes JWT authentication, role-based REST APIs, Swagger documentation, H2/PostgreSQL-ready persistence, AI-style recommendation logic, fraud risk scoring, simulated payments, WebSocket notifications, admin analytics, and a modern dashboard UI.

## Highlights

- JWT authentication with `USER` and `ADMIN` roles.
- Service catalogue with ratings, provider data, categories, and popularity metrics.
- Booking flow with simulated payment and fraud risk scoring.
- Hybrid recommendation engine using collaborative filtering, category affinity, ratings, and popularity.
- User behavior history stored in `user_behavior_history` for personalization signals.
- AI chatbot endpoint that maps natural-language queries to service discovery.
- WebSocket/STOMP live booking notifications at `/ws` and `/topic/bookings`.
- Admin graph-ready analytics for bookings per day, top categories, and fraud trends.
- Next.js frontend with landing, auth, dashboard, and marketplace UI.
- Swagger/OpenAPI coverage for REST endpoints.
- Async email notification hooks and local recommendation caching.

## Tech Stack

- Java 21
- Spring Boot 3.5.0
- Spring Web, Spring Security, Spring Data JPA
- Spring WebSocket + STOMP
- Spring Cache
- Springdoc OpenAPI / Swagger UI
- JWT with JJWT
- H2 local database, PostgreSQL-ready configuration
- Maven Wrapper
- Next.js 14, React 18, TypeScript, Tailwind CSS
- Gemini API support for the chatbot assistant

## Run Locally

Use Java 21 before running Maven:

```bash
export JAVA_HOME=/Users/prasukgoyal/.jdk/jdk-21.0.8/jdk-21.0.8+9/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
```

Run the backend:

```bash
./mvnw clean compile
./mvnw spring-boot:run
```

Run the frontend from the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Open:

- Frontend app: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- Status: `http://localhost:8080/status`
- H2 console: `http://localhost:8080/h2-console`

H2 console settings:

- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## Demo Credentials

User account:

```text
email: user@smartserve.ai
password: password123
```

Admin account:

```text
email: admin@smartserve.ai
password: admin123
```

## Architecture

```text
Controller layer
  REST APIs and Swagger metadata

Service layer
  Booking orchestration, fraud scoring, recommendation scoring, payments, chatbot, analytics

Repository layer
  Spring Data JPA queries over users, services, providers, bookings, ratings, behavior history

Infrastructure
  JWT security, global exception handling, WebSocket/STOMP, async email, cache, startup data
```

Key packages:

```text
src/main/java/com/smartbooking
├── config        # Security, JWT, OpenAPI, WebSocket, async/cache enablement, seed data
├── controller    # REST controllers and Thymeleaf page routes
├── dto           # Request/response DTOs
├── entity        # JPA entities including UserBehaviorHistory
├── exception     # Custom exceptions and global handler
├── model         # Enums for roles, booking, payment, behavior, categories
├── repository    # Spring Data JPA repositories
└── service       # Business logic and AI-style scoring

frontend/
  Next.js app, auth pages, dashboard, reusable UI components
```

## AI Recommendation Logic

`GET /api/recommendations/me` returns personalized recommendations for the authenticated user.

The upgraded recommendation engine combines:

- Collaborative filtering: users who booked services you used also booked other services.
- Category affinity: services in the user's most-booked category get a boost.
- Rating score: higher average ratings increase rank.
- Popularity score: high booking count increases rank.
- Freshness boost: newer marketplace services receive a small boost.
- Behavior history: booking and recommendation interactions are persisted for personalization.

The endpoint returns the scoring explanation and recommended service DTOs.

## Fraud Detection Logic

Booking creation now returns a fraud risk score instead of breaking the flow with a simple exception. The booking is persisted with either `CONFIRMED` or `FLAGGED`.

Signals include:

- Bookings per minute.
- Bookings per hour.
- Repeated same-service booking attempts.
- High 24-hour volume.
- Repeated category pattern.
- Prior flagged booking history.

Example response shape:

```json
{
  "bookingId": 8,
  "serviceId": 1,
  "serviceTitle": "Deep Home Cleaning",
  "status": "FLAGGED",
  "riskScore": 82,
  "fraudMessage": "High fraud risk detected",
  "fraudSignals": ["High booking velocity in the last hour"],
  "paymentStatus": "SUCCESS"
}
```

## Payment Flow

`PaymentService` simulates payment processing during booking creation.

- Normal and moderate-risk bookings receive `SUCCESS` with a simulated transaction id.
- Extremely high-risk bookings can receive `FAILED` to model a payment hold.
- Payment status is included in booking responses and the UI booking table.

## API Usage

Login and copy the JWT token:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@smartserve.ai","password":"password123"}'
```

List services:

```bash
curl http://localhost:8080/api/services
```

Create a booking:

```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"serviceId":1}'
```

Get personalized recommendations:

```bash
curl http://localhost:8080/api/recommendations/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Ask the chatbot:

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"book electrician"}'
```

Gemini chatbot config:

```bash
export GEMINI_API_KEY=your-gemini-api-key
export GEMINI_MODEL=gemini-2.0-flash
```

If the Gemini API returns a quota or billing error, the chatbot automatically falls back to the built-in service search flow. To use live Gemini responses, the Google AI project must have an active quota or billing-enabled plan.

Admin analytics:

```bash
curl http://localhost:8080/api/admin/analytics \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

Graph-ready admin endpoints:

```text
GET /api/admin/analytics/bookings-per-day?days=7
GET /api/admin/analytics/top-categories
GET /api/admin/analytics/fraud-trends?days=7
```

## WebSocket

The app exposes a STOMP endpoint:

```text
/ws
```

Booking updates are published to:

```text
/topic/bookings
```

The `/ui/dashboard` page subscribes to that topic and displays live booking events when the browser can load the STOMP/SockJS client scripts.

## Frontend Pages

- `/` - landing page and product overview.
- `/login` - user sign-in.
- `/signup` - account creation.
- `/dashboard` - service discovery, bookings, analytics, assistant, and admin views.

## Screenshots

Add screenshots after running locally:

- Frontend app: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- Swagger: `http://localhost:8080/swagger-ui/index.html`

## Production Notes

- Replace the demo JWT secret before deployment.
- Use PostgreSQL for persistent production data.
- Configure SMTP for real email delivery.
- Replace simulated payments with a gateway integration such as Razorpay or Stripe.
- Replace local cache with Redis if horizontal scaling is required.
- Add integration tests for auth, booking fraud scoring, recommendations, chat, WebSocket events, and admin analytics.
