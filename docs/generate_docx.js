const fs = require('fs');
const path = require('path');
const docx = require('docx');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, ImageRun, BorderStyle, WidthType,
  Header, Footer, PageNumber, NumberFormat, UnderlineType, ShadingType
} = docx;

const baseDir = path.join(__dirname);
const assetsDir = path.join(baseDir, 'assets');
const screenshotsDir = path.join(assetsDir, 'screenshots');
const diagramsDir = path.join(assetsDir, 'diagrams');
const docxPath = path.join(baseDir, 'documentation', 'Final_Project_Document.docx');

// Helpers for consistent styling
const FONT = 'Times New Roman';

function p(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: { before: options.before || 100, after: options.after || 120, line: 360 }, // 1.5 line spacing
    children: [
      new TextRun({
        text,
        font: FONT,
        size: options.size || 24, // 12pt
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || '111111'
      })
    ]
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 240 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: FONT,
        size: 32, // 16pt
        bold: true,
        color: '0F172A',
        underline: { type: UnderlineType.SINGLE }
      })
    ]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 28, // 14pt
        bold: true,
        color: '1E293B'
      })
    ]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 25, // 12.5pt
        bold: true,
        color: '334155'
      })
    ]
  });
}

function bullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + ' ', font: FONT, size: 24, bold: true, color: '111111' }));
  }
  children.push(new TextRun({ text, font: FONT, size: 24, color: '111111' }));
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60, line: 360 },
    children
  });
}

function imgBox(imagePath, captionText, width = 560, height = 340) {
  if (!fs.existsSync(imagePath)) return new Paragraph({ text: `[Image not found: ${captionText}]` });
  const data = fs.readFileSync(imagePath);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 80 },
      children: [
        new ImageRun({
          data,
          transformation: { width, height }
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 180 },
      children: [
        new TextRun({
          text: captionText,
          font: FONT,
          size: 21, // 10.5pt
          bold: true,
          color: '1E293B'
        })
      ]
    })
  ];
}

function createTable(headers, rows) {
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: headers.map(h => new TableCell({
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
        children: [new Paragraph({
          children: [new TextRun({ text: h, font: FONT, size: 21, bold: true, color: '0F172A' })]
        })]
      }))
    }),
    ...rows.map(row => new TableRow({
      children: row.map(cell => new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: cell, font: FONT, size: 20, color: '1E293B' })]
        })]
      }))
    }))
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

async function buildDocx() {
  console.log('Building Final_Project_Document.docx...');

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 24, color: '111111' },
          paragraph: { spacing: { line: 360, before: 100, after: 120 } }
        }
      }
    },
    sections: [
      // 1. Cover Page
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        children: [
          p('IBST MINI PROJECT REPORT', { alignment: AlignmentType.CENTER, size: 36, bold: true, color: '0F172A', before: 300 }),
          p('on', { alignment: AlignmentType.CENTER, size: 26, italics: true, before: 60, after: 140 }),
          p('SMARTSERVE AI: INTELLIGENT LOCAL SERVICE BOOKING PLATFORM WITH REALTIME FRAUD DETECTION & HYBRID RECOMMENDATION ENGINE', {
            alignment: AlignmentType.CENTER, size: 32, bold: true, color: '1E3A8A', before: 160, after: 240
          }),
          p('Submitted By:', { alignment: AlignmentType.CENTER, size: 26, bold: true, before: 200, after: 60 }),
          p('Prasuk Goyal  |  Regd. No: 2505286042', { alignment: AlignmentType.CENTER, size: 28, bold: true, color: '0F172A', before: 40, after: 60 }),
          p('MCA BATCH: [2025 – 2027]', { alignment: AlignmentType.CENTER, size: 26, bold: true, before: 40, after: 140 }),
          p('(A project report submitted to Srusti Academy of Management and Technology (Autonomous), Bhubaneswar, Odisha for the partial fulfillment of the requirements for the award of the Degree of Master of Computer Applications)', {
            alignment: AlignmentType.CENTER, size: 22, italics: true, color: '334155', before: 100, after: 300
          }),
          ...imgBox(path.join(assetsDir, 'image1.png'), '', 120, 120),
          p('Srusti Academy of Management and Technology (Autonomous)', { alignment: AlignmentType.CENTER, size: 26, bold: true, color: '0F172A', before: 100, after: 40 }),
          p('1st B-School in Odisha with "A" Grade Accreditation by NAAC | Approved by AICTE, New Delhi | Affiliated to BPUT, Rourkela', {
            alignment: AlignmentType.CENTER, size: 20, color: '475569', before: 40, after: 40
          }),
          p('38/1, Chandaka Industrial Estate, Near Infocity, Bhubaneswar, Odisha – 751024 | www.srustiacademy.ac.in', {
            alignment: AlignmentType.CENTER, size: 20, color: '2563EB', before: 40, after: 100
          })
        ]
      },

      // 2. Main Body with Running Header and Footer
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 }, // 1.25 inch left margin for binding
            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'SmartServe AI | MCA Batch 2025-27 | Srusti Academy', font: FONT, size: 18, color: '64748B' })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Page ', font: FONT, size: 20 }),
                  new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20, bold: true }),
                  new TextRun({ text: ' of ', font: FONT, size: 20 }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 20, bold: true })
                ]
              })
            ]
          })
        },
        children: [
          // Certificate
          h1('Certificate'),
          p('This is to certify that Mr. Prasuk Goyal, a bonafide student of the Master of Computer Applications (MCA) program at Srusti Academy of Management and Technology (Autonomous), Bhubaneswar, has successfully completed his Industry-Based Summer Training (IBST) Project entitled "SmartServe AI – Intelligent Local Service Booking Platform with Realtime Fraud Detection and Hybrid Recommendation Engine" during the academic session 2025-2027.', { before: 200 }),
          p('He has worked diligently on the IBST Project during the period from 01/09/2026 to 31/10/2026. His performance, technical competence, software engineering discipline, and analytical problem-solving abilities demonstrated throughout the project development cycle were found to be extremely satisfactory.'),
          p('Internal Supervisor: ________________________        External Examiner: ________________________', { before: 400, after: 300 }),

          // Declaration
          h1('Declaration'),
          p('I, Prasuk Goyal, a bonafide student of Srusti Academy of Management and Technology (Autonomous), Bhubaneswar, pursuing the Master of Computer Applications (MCA) degree (Batch: 2025 – 2027), do hereby declare that the technical report entitled "SmartServe AI – Intelligent Local Service Booking Platform" is an authentic and original record of my own project work carried out under academic supervision and corporate mentorship.'),
          p('All data furnished in this project report are authentic and genuine, and this report neither full nor in part has ever been submitted for award of any other degree to either this university or any other university.'),
          p('Student Signature: ______________________\nPrasuk Goyal (Regd. No: 2505286042)\nDepartment of Computer Applications, Srusti Academy, Bhubaneswar', { before: 300, after: 300 }),

          // Acknowledgement
          h1('Acknowledgement'),
          p('This project report bears the imprint of many people on it. I am very much thankful to Srusti Academy of Management and Technology (Autonomous), Bhubaneswar, for providing the necessary facilities and computational resources for the successful completion of my project.'),
          p('I would like to thank my project supervisor for his invaluable guidance, continuous critique, and assistance in preparing the project report. I am also highly indebted to my corporate guide for imparting industry best practices on cloud migration and microservice security. Finally, I express my indebtedness to my parents and friends for their enduring encouragement.'),
          p('Date: 02/11/2026  |  Place: Bhubaneswar, Odisha\nPrasuk Goyal (Registration No: 2505286042)', { before: 200, after: 300 }),

          // Abstract
          h1('Abstract'),
          p('SmartServe AI is a modern full-stack intelligent local service booking and management platform engineered using an enterprise-grade Spring Boot 3.5 backend in Java 17 and a responsive Next.js 14 App Router frontend with React 18 and Tailwind CSS.'),
          p('The primary innovations include: (1) An Automated AI Fraud Detection Engine evaluating booking velocity and repeat patterns to assign a 0-100 risk score and quarantine malicious bookings; (2) A Multi-Criteria Hybrid Recommendation Engine scoring services across collaborative filtering (34%), star ratings (20%), category affinity (18%), booking popularity (16%), and recent behavior (10%); and (3) An autonomous AI Chatbot Concierge providing semantic discovery across 15+ intent domains. The system utilizes NeonDB Cloud PostgreSQL with HikariCP connection pooling and was validated via an automated test suite achieving 100% pass across 45 test cases.'),

          // Chapter 1
          h1('Chapter 1: Introduction'),
          h2('1.1 Project Overview'),
          p('SmartServe AI provides an intelligent hyper-local service booking ecosystem where residential customers discover verified providers, schedule appointments with conflict detection, and receive real-time updates via WebSockets.'),
          h2('1.2 Problem Statement'),
          p('Traditional local booking portals suffer from scheduling double-bookings, vulnerability to booking floods from rogue users, unpersonalized search listings, and lack of automated customer service.'),
          h2('1.3 Objectives and Scope'),
          bullet('Architect an enterprise RESTful backend using Spring Boot 3.5 with Spring Security 6 and JWT authentication.'),
          bullet('Integrate serverless NeonDB Cloud PostgreSQL with SSL encryption and HikariCP connection pooling.'),
          bullet('Implement an automated AI Fraud Detection Engine calculating velocity and historical penalties.'),
          bullet('Engineer a personalized 6-signal hybrid recommendation engine with collaborative filtering.'),
          bullet('Build a Next.js 14 frontend with interactive booking modal, live chat widget, and admin analytics.'),
          h2('1.4 Target Users'),
          p('Target users comprise Residential Customers (ROLE_USER), Service Providers (ROLE_PROVIDER), and Platform Administrators (ROLE_ADMIN).'),
          h2('1.5 Existing and Proposed Systems'),
          createTable(
            ['Feature Dimension', 'Existing Marketplace Portals', 'Proposed SmartServe AI Ecosystem'],
            [
              ['Scheduling Logic', 'Manual callback / asynchronous forms', 'Automated slot validation with duration bounds'],
              ['Fraud Prevention', 'Reactive manual moderation', 'Realtime velocity & pattern scoring with quarantine'],
              ['Recommendations', 'Sponsored pay-per-click listings', 'Dynamic 6-signal hybrid collaborative algorithm'],
              ['Conversational AI', 'Static FAQ pages', 'Smart knowledge chatbot with suggestion chips']
            ]
          ),

          // Chapter 2
          h1('Chapter 2: Requirements Analysis and PRD'),
          h2('2.1 Product Requirements Document (PRD)'),
          p('The PRD outlines user requirements, technical specifications, and functional boundaries for local service discovery, booking automation, and fraud defense.'),
          h2('2.2 Functional and Non-Functional Requirements'),
          bullet('FR-01: Secure registration and JWT token issue (HMAC-SHA256) with role authorization.'),
          bullet('FR-02: Categorized service catalog with price, rating count, provider availability, and search.'),
          bullet('FR-03: Booking scheduling with date-time input, duration validation (30-240 min), and simulated payment.'),
          bullet('FR-04: Fraud risk scoring (0-100) and collaborative filtering recommendations.'),
          bullet('NFR-01: Sub-200ms API response latency using HikariCP pooling and Caffeine caching.'),
          bullet('NFR-02: BCrypt password hashing and strict CORS whitelisting for deployment domains.'),
          h2('2.3 User Stories and Use Cases'),
          p('Customer story: "As a homeowner, I want to book a deep home cleaning session for tomorrow with transparent pricing and receive an instant confirmation."'),
          p('Admin story: "As an admin, I want to inspect 7-day booking trends and review flagged transactions."'),

          // Chapter 3
          h1('Chapter 3: System Analysis and Design'),
          h2('3.1 System Architecture'),
          p('The system follows a decoupled 4-tier architecture: Presentation Tier (Next.js 14), Gateway/Security Tier (Spring Security 6), Application Logic Tier (Booking, Fraud, Recommendations), and Cloud Persistence Tier (NeonDB PostgreSQL).'),
          ...imgBox(path.join(diagramsDir, 'system-architecture.png'), 'Figure 3.1: Multi-Tier High-Level System Architecture', 540, 320),
          h2('3.2 System Workflow'),
          p('The client validates inputs, transmits a JWT-authorized request to /api/bookings, validates slot conflicts, runs fraud velocity scoring, generates a simulated transaction, persists the booking, and broadcasts a STOMP event.'),
          h2('3.3 Use Case Diagram'),
          ...imgBox(path.join(diagramsDir, 'use-case-diagram.png'), 'Figure 3.2: UML Use Case Diagram of SmartServe AI', 540, 320),
          h2('3.4 AI Intelligence Engine Workflows'),
          ...imgBox(path.join(diagramsDir, 'ai-engine-workflow.png'), 'Figure 3.3: AI Fraud Detection and Hybrid Recommendation Workflows', 540, 320),

          // Chapter 4
          h1('Chapter 4: Technology Stack and Development Plan'),
          h2('4.1 Core Technologies'),
          bullet('Backend: Spring Boot 3.5.0 on Java 17 LTS (Spring Data JPA, Spring Web, Spring Security 6).'),
          bullet('Database: NeonDB Cloud PostgreSQL 16 (Serverless architecture in AWS ap-southeast-1).'),
          bullet('Frontend: Next.js 14.2.35, React 18, TypeScript, Tailwind CSS, Radix UI, Recharts.'),
          bullet('Messaging & Sockets: STOMP over WebSockets for live booking notifications.'),
          h2('4.2 Technology Comparison'),
          createTable(
            ['Component', 'Selected Technology', 'Key Architectural Advantage'],
            [
              ['Backend Framework', 'Spring Boot 3.5 (Java 17)', 'Enterprise type safety, mature security abstractions, JPA ORM'],
              ['Database Engine', 'NeonDB Cloud PostgreSQL', 'Serverless scalability, strict foreign keys, zero maintenance'],
              ['Frontend Framework', 'Next.js 14 (App Router)', 'Fast initial render, clean layouts, seamless Vercel hosting'],
              ['Security Protocol', 'JWT (JJWT 0.12)', 'Stateless authorization across decoupled web and mobile clients']
            ]
          ),

          // Chapter 5
          h1('Chapter 5: Database Design and API Specification'),
          h2('5.1 Database Schema and ER Diagram'),
          ...imgBox(path.join(diagramsDir, 'er-diagram.png'), 'Figure 5.1: Relational Database Entity-Relationship (ER) Schema', 540, 320),
          h2('5.2 Relational Tables'),
          bullet('users: id (PK), name, email (UQ), password (BCrypt), role (ROLE_USER, ROLE_ADMIN).'),
          bullet('service_provider: id (PK), name, email, phone, available (BOOLEAN), avatar_url.'),
          bullet('services: id (PK), title, description, category, price, provider_id (FK).'),
          bullet('bookings: id (PK), user_id (FK), service_id (FK), status, risk_score, payment_status, scheduled_at, duration_minutes.'),
          bullet('ratings: id (PK), user_id (FK), service_id (FK), score (1-5), comment.'),
          bullet('user_behavior_history: id (PK), user_id (FK), service_id (FK), action, metadata, created_at.'),
          h2('5.3 Core API Endpoints'),
          createTable(
            ['HTTP Method', 'Path', 'Access Level', 'Description'],
            [
              ['POST', '/api/auth/register', 'Public', 'User onboarding & account creation'],
              ['POST', '/api/auth/login', 'Public', 'Credential verification & JWT issue'],
              ['GET', '/api/services', 'Public', 'Catalog retrieval with optional category filter'],
              ['POST', '/api/bookings', 'Authenticated', 'Create booking with fraud scoring'],
              ['GET', '/api/bookings/my', 'Authenticated', 'List current user bookings'],
              ['GET', '/api/recommendations/me', 'Authenticated', 'Fetch personalized recommendations'],
              ['POST', '/api/chat', 'Public', 'AI conversational concierge endpoint'],
              ['GET', '/api/admin/analytics', 'ROLE_ADMIN', 'Platform KPI metrics & fraud telemetry']
            ]
          ),

          // Chapter 6
          h1('Chapter 6: Testing and Evaluation'),
          h2('6.1 Automated Test Execution'),
          p('A comprehensive PowerShell automated test harness executed 45 tests against the live Spring Boot API and NeonDB PostgreSQL database, achieving a 100% pass rate.'),
          createTable(
            ['Suite', 'Test Focus', 'Assertions', 'Result'],
            [
              ['Catalog', 'GET /api/services', 'Returns >= 5 items with id, title, price', 'PASS (100%)'],
              ['Auth', 'POST /api/auth/login', 'Issues valid JWT for admin and user roles', 'PASS (100%)'],
              ['Accounts', 'Sequential login', 'Validates Alice, Bob, Carol, Dave credentials', 'PASS (100%)'],
              ['Bookings', 'POST /api/bookings', 'Creates booking with risk score & TXN ID', 'PASS (100%)'],
              ['Cancel', 'PUT /bookings/{id}/cancel', 'Transitions status to CANCELLED', 'PASS (100%)'],
              ['Chatbot', 'POST /api/chat', 'Validates services, logins, fraud, tech stack queries', 'PASS (100%)'],
              ['Analytics', 'GET /admin/analytics', 'Validates totalBookings, top categories, fraud trends', 'PASS (100%)'],
              ['Security', 'Auth guards', 'Blocks unauthenticated requests with 401/403', 'PASS (100%)']
            ]
          ),

          // Chapter 7
          h1('Chapter 7: Deployment and Results'),
          h2('7.1 System Screenshots from Live Localhost Application'),
          ...imgBox(path.join(screenshotsDir, '01-landing-page.png'), 'Figure 7.1: Application Landing & Showcase Page', 540, 310),
          ...imgBox(path.join(screenshotsDir, '02-login-page.png'), 'Figure 7.2: Secure JWT Login Authentication Screen', 540, 310),
          ...imgBox(path.join(screenshotsDir, '03-signup-page.png'), 'Figure 7.3: User Registration Interface', 540, 310),
          ...imgBox(path.join(screenshotsDir, '04-customer-dashboard.png'), 'Figure 7.4: Customer Dashboard with Recommendations & Live Stats', 540, 310),
          ...imgBox(path.join(screenshotsDir, '05-booking-modal.png'), 'Figure 7.5: Interactive Booking Modal with Duration Picker', 540, 310),
          ...imgBox(path.join(screenshotsDir, '06-ai-chatbot.png'), 'Figure 7.6: Floating AI Chatbot Concierge with Suggestion Chips', 540, 310),
          ...imgBox(path.join(screenshotsDir, '07-admin-analytics.png'), 'Figure 7.7: Administrator Analytics & Fraud Telemetry Charts', 540, 310),
          ...imgBox(path.join(screenshotsDir, '08-swagger-api-docs.png'), 'Figure 7.8: Interactive OpenAPI / Swagger UI Documentation', 540, 310),
          h2('7.2 Engineering Challenges and Resolutions'),
          p('1. Cloud Migration to NeonDB: Replaced MySQL drivers with PostgreSQL, configured PostgreSQLDialect, and tuned HikariCP connection pool timeouts to eliminate cloud cold-start latency.'),
          p('2. ISO-8601 String Parsing: Enhanced BookingRequestDto with flexible String-to-LocalDateTime parsing to handle browser ISO timestamps ending with "Z".'),
          p('3. DTO Field Alignment: Mapped logicSummary and totalFlaggedBookings via Jackson @JsonProperty annotations to ensure TypeScript frontend compatibility.'),

          // Chapter 8
          h1('Chapter 8: Conclusion and Future Scope'),
          h2('8.1 Conclusion'),
          p('SmartServe AI demonstrates a production-grade hyper-local service booking ecosystem. The integration of Spring Boot 3.5, Next.js 14, NeonDB Cloud PostgreSQL, and AI intelligence engines solves traditional operational challenges in scheduling, fraud prevention, and personalized discovery.'),
          h2('8.2 Learning Outcomes'),
          p('The project provided in-depth practical mastery of enterprise Java microservices, cloud relational database optimization, JWT authentication, heuristic AI modeling, and automated quality assurance.'),
          h2('8.3 Future Enhancements'),
          bullet('Live Stripe Checkout integration with webhook reconciliation.'),
          bullet('Cross-platform mobile applications in Flutter.'),
          bullet('Geospatial distance ranking using PostGIS extensions.'),

          // References
          h1('References / Bibliography'),
          bullet('Walls, C. (2022). Spring in Action (6th Edition). Manning Publications.'),
          bullet('Bauer, C., King, G., & Gregory, G. (2015). Java Persistence with Hibernate. Manning Publications.'),
          bullet('Vercel Development Team. (2024). Next.js 14 App Router Documentation. https://nextjs.org/docs.'),
          bullet('PostgreSQL Global Development Group. (2024). PostgreSQL 16 Enterprise Documentation. https://www.postgresql.org/docs/.'),
          bullet('Neon Database Inc. (2024). Serverless Postgres Architecture and Connection Pooling. https://neon.tech/docs/.'),
          bullet('Resnick, P., & Varian, H. R. (1997). Recommender Systems. Communications of the ACM, 40(3), 56-58.'),
          bullet('OpenAPI Initiative. (2024). OpenAPI Specification v3.0.3. https://spec.openapis.org/oas/v3.0.3.'),
          bullet('Srusti Academy of Management and Technology. (2025). Guidelines for MCA IBST Project Report Preparation (Batch 2025-27). Bhubaneswar, Odisha.')
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(docxPath, buffer);
  console.log(`Successfully generated DOCX at ${docxPath} (${buffer.length} bytes)`);
}

buildDocx();

