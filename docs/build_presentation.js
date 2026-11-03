const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

const baseDir = path.resolve(__dirname, '..'); // smartserve-ai-booking-platform
const rootDir = path.resolve(baseDir, '..');   // SmartServe
const assetsDir = path.join(__dirname, 'assets');
const screenshotsDir = path.join(assetsDir, 'screenshots');
const diagramsDir = path.join(assetsDir, 'diagrams');

const targetPaths = [
  path.join(rootDir, 'Project_Presentation.pptx'),
  path.join(baseDir, 'Project_Presentation.pptx')
];

async function generatePresentation() {
  console.log('Initializing Presentation Generator...');
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9'; // 13.333 x 7.5 inches
  pptx.author = 'Prasuk Goyal';
  pptx.company = 'Srusti Academy of Management and Technology';
  pptx.subject = 'SmartServe AI - IBST Mini Project Presentation';
  pptx.title = 'SmartServe AI Presentation';

  const FONT_HEADING = 'Calibri';
  const FONT_BODY = 'Calibri';

  // ==========================================
  // SLIDE 1: PROJECT IDENTITY (Cover Slide)
  // ==========================================
  console.log('Creating Slide 1: Project Identity...');
  const s1 = pptx.addSlide();
  s1.background = { color: '0F172A' }; // Dark Navy

  // Top Accent Strip
  s1.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.1,
    fill: { color: '2563EB' }, line: { type: 'none' }
  });

  // Category Tag Badge
  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.6, w: 4.8, h: 0.38,
    fill: { color: '1E293B' },
    line: { color: '38BDF8', width: 1 },
    rectRadius: 0.1
  });
  s1.addText('MCA IBST MINI PROJECT  •  BATCH 2025–2027', {
    x: 0.8, y: 0.6, w: 4.8, h: 0.38,
    fontFace: FONT_HEADING, fontSize: 10.5, bold: true, color: '38BDF8',
    align: 'center', valign: 'middle'
  });

  // Project Title
  s1.addText('SmartServe AI', {
    x: 0.8, y: 1.15, w: 5.8, h: 1.1,
    fontFace: FONT_HEADING, fontSize: 42, bold: true, color: 'FFFFFF'
  });

  // Tagline
  s1.addText('Intelligent Cloud-Native Local Service Marketplace with Multi-Vector Fraud Detection & AI Concierge', {
    x: 0.8, y: 2.25, w: 5.6, h: 0.9,
    fontFace: FONT_BODY, fontSize: 15, color: '94A3B8', lineSpacingMultiple: 1.2
  });

  // Academic Credentials Card
  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 3.35, w: 5.6, h: 3.45,
    fill: { color: '1E293B' },
    line: { color: '334155', width: 1 },
    rectRadius: 0.15
  });

  const s1Details = [
    { text: 'PRESENTER DETAILS & AFFILIATION\n', options: { fontSize: 11, bold: true, color: '38BDF8' } },
    { text: 'Candidate Name: ', options: { fontSize: 12.5, bold: true, color: 'FFFFFF' } },
    { text: 'Prasuk Goyal\n', options: { fontSize: 12.5, bold: true, color: 'FFFFFF' } },
    { text: 'Registration No: ', options: { fontSize: 12, bold: true, color: 'CBD5E1' } },
    { text: '2505286042\n', options: { fontSize: 12, bold: false, color: 'FFFFFF' } },
    { text: 'Academic Degree: ', options: { fontSize: 12, bold: true, color: 'CBD5E1' } },
    { text: 'Master of Computer Applications (MCA)\n', options: { fontSize: 12, bold: false, color: 'FFFFFF' } },
    { text: 'Institution: ', options: { fontSize: 12, bold: true, color: 'CBD5E1' } },
    { text: 'Srusti Academy of Management & Technology (Autonomous)\n', options: { fontSize: 11.5, bold: false, color: 'FFFFFF' } },
    { text: 'Affiliated To: ', options: { fontSize: 11.5, bold: true, color: 'CBD5E1' } },
    { text: 'Biju Patnaik University of Technology (BPUT), Odisha\n', options: { fontSize: 11.5, bold: false, color: 'FFFFFF' } },
    { text: 'Repository: ', options: { fontSize: 11.5, bold: true, color: 'CBD5E1' } },
    { text: 'github.com/subhrajitsamal910-happy/SmartServe', options: { fontSize: 11, bold: false, color: '38BDF8' } }
  ];
  s1.addText(s1Details, {
    x: 1.05, y: 3.5, w: 5.1, h: 3.15,
    fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });

  // Right Side: Framed Screenshot of Customer Dashboard
  const dashImgPath = path.join(screenshotsDir, '04-customer-dashboard.png');
  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.75, y: 0.85, w: 5.8, h: 5.95,
    fill: { color: '1E293B' },
    line: { color: '3B82F6', width: 2 },
    rectRadius: 0.15
  });
  s1.addImage({
    path: dashImgPath,
    x: 6.85, y: 0.95, w: 5.6, h: 5.75
  });

  // ==========================================
  // SLIDE 2: PROBLEM, SOLUTION & OVERVIEW
  // ==========================================
  console.log('Creating Slide 2: Problem, Solution & Overview...');
  const s2 = pptx.addSlide();
  s2.background = { color: 'F8FAFC' }; // Clean Light

  // Header Bar
  s2.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.08,
    fill: { color: '2563EB' }, line: { type: 'none' }
  });

  s2.addText('EXECUTIVE SUMMARY & SYSTEM SCOPE', {
    x: 0.8, y: 0.45, w: 11.7, h: 0.25,
    fontFace: FONT_HEADING, fontSize: 11, bold: true, color: '2563EB'
  });
  s2.addText('Problem Statement, Proposed Solution & Core Features', {
    x: 0.8, y: 0.72, w: 11.7, h: 0.5,
    fontFace: FONT_HEADING, fontSize: 24, bold: true, color: '0F172A'
  });

  // Left Column - Problem Card
  s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.35, w: 5.5, h: 2.1,
    fill: { color: 'FFF1F2' },
    line: { color: 'FDA4AF', width: 1.5 },
    rectRadius: 0.12
  });
  s2.addText('THE PROBLEM IN LOCAL SERVICE DISCOVERY', {
    x: 1.0, y: 1.45, w: 5.1, h: 0.3,
    fontFace: FONT_HEADING, fontSize: 12, bold: true, color: 'BE123C'
  });
  const s2ProblemText = [
    { text: '• High Booking Friction: ', options: { bold: true, color: '0F172A' } },
    { text: 'Manual scheduling causes frequent double-booking conflicts.\n', options: { color: '334155' } },
    { text: '• Lack of Trust: ', options: { bold: true, color: '0F172A' } },
    { text: 'Unverified local providers and opaque pricing structures.\n', options: { color: '334155' } },
    { text: '• Booking Spam & Fraud: ', options: { bold: true, color: '0F172A' } },
    { text: 'Platforms lack automated risk scoring to block bot attacks.', options: { color: '334155' } }
  ];
  s2.addText(s2ProblemText, {
    x: 1.0, y: 1.78, w: 5.1, h: 1.55,
    fontFace: FONT_BODY, fontSize: 11, lineSpacingMultiple: 1.2
  });

  // Left Column - Solution Card
  s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 3.6, w: 5.5, h: 2.1,
    fill: { color: 'F0FDF4' },
    line: { color: '86EFAC', width: 1.5 },
    rectRadius: 0.12
  });
  s2.addText('THE SMARTSERVE AI SOLUTION', {
    x: 1.0, y: 3.7, w: 5.1, h: 0.3,
    fontFace: FONT_HEADING, fontSize: 12, bold: true, color: '15803D'
  });
  const s2SolutionText = [
    { text: '• Automated Conflict Checking: ', options: { bold: true, color: '0F172A' } },
    { text: 'Rejects overlapping provider slots in real-time.\n', options: { color: '334155' } },
    { text: '• AI Fraud Risk Engine: ', options: { bold: true, color: '0F172A' } },
    { text: 'Dynamic 0-100 heuristic scoring flags suspicious velocity.\n', options: { color: '334155' } },
    { text: '• 6-Signal Personalization: ', options: { bold: true, color: '0F172A' } },
    { text: 'Hybrid collaborative & popularity recommendation engine.', options: { color: '334155' } }
  ];
  s2.addText(s2SolutionText, {
    x: 1.0, y: 4.02, w: 5.1, h: 1.55,
    fontFace: FONT_BODY, fontSize: 11, lineSpacingMultiple: 1.2
  });

  // Left Column - 4 Key Feature Pills
  const features = [
    { title: 'Real-Time Booking', desc: 'Conflict-free' },
    { title: 'Fraud Guard', desc: 'Risk Score >= 70' },
    { title: 'AI Concierge', desc: 'NLP Assistant' },
    { title: 'Admin Telemetry', desc: 'Live Analytics' }
  ];
  features.forEach((f, i) => {
    const fx = 0.8 + i * 1.4;
    s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: fx, y: 5.85, w: 1.3, h: 0.8,
      fill: { color: 'EFF6FF' },
      line: { color: 'BFDBFE', width: 1 },
      rectRadius: 0.08
    });
    s2.addText(`${f.title}\n${f.desc}`, {
      x: fx, y: 5.88, w: 1.3, h: 0.74,
      fontFace: FONT_BODY, fontSize: 9.5, bold: true, color: '1D4ED8',
      align: 'center', valign: 'middle'
    });
  });

  // Right Column - Annotated Screenshot (Booking Flow)
  const bookingImgPath = path.join(screenshotsDir, '05-booking-modal.png');
  s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.6, y: 1.35, w: 5.9, h: 5.3,
    fill: { color: 'FFFFFF' },
    line: { color: 'CBD5E1', width: 1.5 },
    rectRadius: 0.12
  });
  s2.addImage({
    path: bookingImgPath,
    x: 6.7, y: 1.45, w: 5.7, h: 5.1
  });

  // ==========================================
  // SLIDE 3: TECH STACK & SYSTEM ARCHITECTURE
  // ==========================================
  console.log('Creating Slide 3: Tech Stack & System Architecture...');
  const s3 = pptx.addSlide();
  s3.background = { color: 'F8FAFC' };

  s3.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.08,
    fill: { color: '2563EB' }, line: { type: 'none' }
  });

  s3.addText('TECHNICAL BLUEPRINT & ARCHITECTURE', {
    x: 0.8, y: 0.45, w: 11.7, h: 0.25,
    fontFace: FONT_HEADING, fontSize: 11, bold: true, color: '2563EB'
  });
  s3.addText('Technology Stack & Multi-Tier Architecture', {
    x: 0.8, y: 0.72, w: 11.7, h: 0.5,
    fontFace: FONT_HEADING, fontSize: 24, bold: true, color: '0F172A'
  });

  // Left: System Architecture Blueprint Image
  const archImgPath = path.join(diagramsDir, 'system-architecture.png');
  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.35, w: 6.6, h: 5.3,
    fill: { color: 'FFFFFF' },
    line: { color: 'CBD5E1', width: 1.5 },
    rectRadius: 0.12
  });
  s3.addImage({
    path: archImgPath,
    x: 0.9, y: 1.45, w: 6.4, h: 5.1
  });

  // Right: 4 Layered Tech Stack Cards
  const techCards = [
    {
      title: '1. PRESENTATION TIER (FRONTEND)',
      color: '2563EB', bg: 'EFF6FF', border: 'BFDBFE',
      items: '• Next.js 14 App Router, React 18, TypeScript\n• Tailwind CSS for responsive dark/light UI\n• Lucide Icons, Radix UI Modals, STOMP WebSocket'
    },
    {
      title: '2. SECURITY & GATEWAY TIER',
      color: '7C3AED', bg: 'F5F3FF', border: 'DDD6FE',
      items: '• Spring Security 6 with stateless JWT Bearer filter\n• Role-Based Access Control (CUSTOMER, PROVIDER, ADMIN)\n• SpringDoc OpenAPI 3.0 / Swagger UI at /swagger-ui'
    },
    {
      title: '3. BUSINESS & AI ENGINES TIER',
      color: '059669', bg: 'ECFDF5', border: 'A7F3D0',
      items: '• Java 17 & Spring Boot 3.5 Core Services\n• Multi-Vector Fraud Scorer (Velocity + Patterns + Slot Risk)\n• 6-Signal Hybrid Personalized Recommendation Engine'
    },
    {
      title: '4. PERSISTENCE & CLOUD TIER',
      color: 'D97706', bg: 'FFFBEB', border: 'FDE68A',
      items: '• NeonDB Cloud PostgreSQL (Serverless, SSL Channel)\n• Spring Data JPA & Hibernate ORM, HikariCP Pool\n• 8 Normalized Relational Tables with Foreign Keys & Indexes'
    }
  ];

  techCards.forEach((c, i) => {
    const cy = 1.35 + i * 1.35;
    s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.6, y: cy, w: 4.9, h: 1.25,
      fill: { color: c.bg },
      line: { color: c.border, width: 1.5 },
      rectRadius: 0.1
    });
    s3.addText(c.title, {
      x: 7.75, y: cy + 0.08, w: 4.6, h: 0.28,
      fontFace: FONT_HEADING, fontSize: 10.5, bold: true, color: c.color
    });
    s3.addText(c.items, {
      x: 7.75, y: cy + 0.36, w: 4.6, h: 0.82,
      fontFace: FONT_BODY, fontSize: 10, color: '1E293B', lineSpacingMultiple: 1.15
    });
  });

  // ==========================================
  // SLIDE 4: DEVELOPMENT PROCESS & VERIFICATION
  // ==========================================
  console.log('Creating Slide 4: Development Process & Verification...');
  const s4 = pptx.addSlide();
  s4.background = { color: 'F8FAFC' };

  s4.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.08,
    fill: { color: '2563EB' }, line: { type: 'none' }
  });

  s4.addText('DEVELOPMENT LIFECYCLE & QUALITY ASSURANCE', {
    x: 0.8, y: 0.45, w: 11.7, h: 0.25,
    fontFace: FONT_HEADING, fontSize: 11, bold: true, color: '2563EB'
  });
  s4.addText('Engineering Process, Prompts & 100% Test Verification', {
    x: 0.8, y: 0.72, w: 11.7, h: 0.5,
    fontFace: FONT_HEADING, fontSize: 24, bold: true, color: '0F172A'
  });

  // Left Column - Development Stages & Prompts (width: 5.8)
  s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.35, w: 5.7, h: 5.3,
    fill: { color: 'FFFFFF' },
    line: { color: 'CBD5E1', width: 1.5 },
    rectRadius: 0.12
  });

  const devWorkflow = [
    { text: '5-STAGE ENGINEERING WORKFLOW\n', options: { fontSize: 12, bold: true, color: '2563EB' } },
    { text: '1. Inception & PRD: ', options: { fontSize: 11, bold: true, color: '0F172A' } },
    { text: 'Requirements gathering, user stories, role boundaries.\n', options: { fontSize: 10.5, color: '475569' } },
    { text: '2. DB Schema & Security: ', options: { fontSize: 11, bold: true, color: '0F172A' } },
    { text: '8-table 3NF schema, Spring Security JWT Bearer filter.\n', options: { fontSize: 10.5, color: '475569' } },
    { text: '3. AI Intelligence Engines: ', options: { fontSize: 11, bold: true, color: '0F172A' } },
    { text: 'Rule-based fraud detector & hybrid multi-signal ranking.\n', options: { fontSize: 10.5, color: '475569' } },
    { text: '4. Next.js 14 Frontend: ', options: { fontSize: 11, bold: true, color: '0F172A' } },
    { text: 'Component hierarchy, booking modal & AI chatbot concierge.\n', options: { fontSize: 10.5, color: '475569' } },
    { text: '5. Automated Testing: ', options: { fontSize: 11, bold: true, color: '0F172A' } },
    { text: '45 automated test scripts with 100% pass rate.\n\n', options: { fontSize: 10.5, color: '475569' } },

    { text: 'SAMPLE ANTIGRAVITY PROMPTS (PROMPT-DRIVEN BUILD)\n', options: { fontSize: 11.5, bold: true, color: '7C3AED' } },
    { text: '• AI Fraud Scoring Prompt:\n', options: { fontSize: 10.5, bold: true, color: '1E293B' } },
    { text: '  "Implement a heuristic booking fraud engine in Spring Boot evaluating velocity, off-hour slots, and previous flags with a 70-point threshold."\n', options: { fontSize: 10, italic: true, color: '475569' } },
    { text: '• Interactive Chatbot Prompt:\n', options: { fontSize: 10.5, bold: true, color: '1E293B' } },
    { text: '  "Build a floating Next.js AI assistant widget with suggestion chips, intent matching, and real-time service recommendation fallback."', options: { fontSize: 10, italic: true, color: '475569' } }
  ];

  s4.addText(devWorkflow, {
    x: 1.0, y: 1.48, w: 5.3, h: 5.05,
    fontFace: FONT_BODY, lineSpacingMultiple: 1.15
  });

  // Right Column - Visual Evidence & Test Matrix
  const adminImgPath = path.join(screenshotsDir, '07-admin-analytics.png');
  s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.35, w: 5.7, h: 3.5,
    fill: { color: 'FFFFFF' },
    line: { color: 'CBD5E1', width: 1.5 },
    rectRadius: 0.12
  });
  s4.addImage({
    path: adminImgPath,
    x: 6.9, y: 1.45, w: 5.5, h: 3.3
  });

  // Bottom Callout Box (45 Tests Passed)
  s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 5.0, w: 5.7, h: 1.65,
    fill: { color: 'ECFDF5' },
    line: { color: '10B981', width: 2 },
    rectRadius: 0.12
  });

  const testMatrixText = [
    { text: '100% AUTOMATED TEST SUITE EXECUTION RESULTS\n', options: { fontSize: 12, bold: true, color: '065F46' } },
    { text: '✓ 45 Total Test Cases Executed  |  ✓ 45 Passed (100% Pass Rate)\n', options: { fontSize: 11, bold: true, color: '047857' } },
    { text: '• Auth & Security Suite (7/7)  • Service Catalog Suite (8/8)\n', options: { fontSize: 10, color: '065F46' } },
    { text: '• Booking Workflow Suite (8/8)  • AI Fraud Engine Suite (8/8)\n', options: { fontSize: 10, color: '065F46' } },
    { text: '• AI Recommender Suite (7/7)   • Admin Analytics Suite (7/7)', options: { fontSize: 10, color: '065F46' } }
  ];
  s4.addText(testMatrixText, {
    x: 7.0, y: 5.12, w: 5.3, h: 1.45,
    fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  // ==========================================
  // SLIDE 5: REPOSITORY, CONCLUSION & THANK YOU
  // ==========================================
  console.log('Creating Slide 5: Repository, Conclusion & Thank You...');
  const s5 = pptx.addSlide();
  s5.background = { color: '0F172A' }; // Dark Navy

  s5.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.1,
    fill: { color: '2563EB' }, line: { type: 'none' }
  });

  // Category Tag Badge
  s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.6, w: 4.8, h: 0.38,
    fill: { color: '1E293B' },
    line: { color: '38BDF8', width: 1 },
    rectRadius: 0.1
  });
  s5.addText('PROJECT CONCLUSION & REPOSITORY ACCESS', {
    x: 0.8, y: 0.6, w: 4.8, h: 0.38,
    fontFace: FONT_HEADING, fontSize: 10.5, bold: true, color: '38BDF8',
    align: 'center', valign: 'middle'
  });

  s5.addText('Conclusion, GitHub Repository & Acknowledgement', {
    x: 0.8, y: 1.15, w: 11.7, h: 0.5,
    fontFace: FONT_HEADING, fontSize: 24, bold: true, color: 'FFFFFF'
  });

  // Left Side: Conclusion & Achievements Card
  s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.85, w: 6.6, h: 4.95,
    fill: { color: '1E293B' },
    line: { color: '334155', width: 1 },
    rectRadius: 0.15
  });

  const conclusionText = [
    { text: 'KEY PROJECT CONTRIBUTIONS & IMPACT\n', options: { fontSize: 13, bold: true, color: '38BDF8' } },
    { text: '• Production-Ready Cloud Architecture: ', options: { fontSize: 11.5, bold: true, color: 'FFFFFF' } },
    { text: 'Full-stack integration of Java Spring Boot 3.5, Next.js 14, and serverless NeonDB PostgreSQL.\n', options: { fontSize: 11, color: 'CBD5E1' } },
    { text: '• Multi-Vector Fraud Defense: ', options: { fontSize: 11.5, bold: true, color: 'FFFFFF' } },
    { text: 'Proactive detection mechanism safeguarding against booking spam, off-hour abuse, and velocity spikes.\n', options: { fontSize: 11, color: 'CBD5E1' } },
    { text: '• Personalized Recommendations: ', options: { fontSize: 11.5, bold: true, color: 'FFFFFF' } },
    { text: '6-signal scoring formula ranking services based on collaborative affinity, popularity, and ratings.\n', options: { fontSize: 11, color: 'CBD5E1' } },
    { text: '• Empirical Quality Assurance: ', options: { fontSize: 11.5, bold: true, color: 'FFFFFF' } },
    { text: 'Validated by 45 automated end-to-end tests with 100% pass rate.\n\n', options: { fontSize: 11, color: 'CBD5E1' } },

    { text: 'FUTURE ENHANCEMENTS ROADMAP\n', options: { fontSize: 12, bold: true, color: '38BDF8' } },
    { text: '• Mobile Application: ', options: { fontSize: 11, bold: true, color: 'FFFFFF' } },
    { text: 'Cross-platform mobile client in React Native or Flutter.\n', options: { fontSize: 11, color: 'CBD5E1' } },
    { text: '• Production Payment Gateway: ', options: { fontSize: 11, bold: true, color: 'FFFFFF' } },
    { text: 'Integration with live Stripe / Razorpay webhooks.\n', options: { fontSize: 11, color: 'CBD5E1' } },
    { text: '• Deep Learning Recommender: ', options: { fontSize: 11, bold: true, color: 'FFFFFF' } },
    { text: 'Embedding-based neural collaborative filtering.', options: { fontSize: 11, color: 'CBD5E1' } }
  ];

  s5.addText(conclusionText, {
    x: 1.05, y: 2.0, w: 6.1, h: 4.65,
    fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  // Right Side: GitHub Repository & QR Code Card
  s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.7, y: 1.85, w: 4.8, h: 3.1,
    fill: { color: '1E293B' },
    line: { color: '3B82F6', width: 1.5 },
    rectRadius: 0.15
  });

  s5.addText('SCAN OR ACCESS CODEBASE', {
    x: 7.9, y: 2.0, w: 4.4, h: 0.28,
    fontFace: FONT_HEADING, fontSize: 11.5, bold: true, color: '38BDF8', align: 'center'
  });

  // Real QR Code Image
  const qrImgPath = path.join(assetsDir, 'repo-qr.png');
  s5.addImage({
    path: qrImgPath,
    x: 9.05, y: 2.35, w: 2.1, h: 2.1
  });

  s5.addText('github.com/subhrajitsamal910-happy/SmartServe', {
    x: 7.8, y: 4.5, w: 4.6, h: 0.35,
    fontFace: FONT_BODY, fontSize: 10, bold: true, color: '60A5FA', align: 'center',
    hyperlink: { url: 'https://github.com/subhrajitsamal910-happy/SmartServe' }
  });

  // Right Side Bottom: Thank You Card
  s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.7, y: 5.15, w: 4.8, h: 1.65,
    fill: { color: '1E293B' },
    line: { color: '10B981', width: 1.5 },
    rectRadius: 0.15
  });

  s5.addText('THANK YOU!', {
    x: 7.9, y: 5.3, w: 4.4, h: 0.5,
    fontFace: FONT_HEADING, fontSize: 26, bold: true, color: '38BDF8', align: 'center'
  });
  s5.addText('Questions, Feedback & Discussion Welcome\n\nPrasuk Goyal | MCA Batch 2025–2027', {
    x: 7.9, y: 5.85, w: 4.4, h: 0.85,
    fontFace: FONT_BODY, fontSize: 11, color: 'CBD5E1', align: 'center'
  });

  // Save to all target paths
  for (const p of targetPaths) {
    console.log(`Writing PPTX to ${p}...`);
    await pptx.writeFile({ fileName: p });
    console.log(`Successfully created ${p} (${fs.statSync(p).size} bytes)`);
  }

  console.log('Presentation generation complete!');
}

generatePresentation().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
