const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const outDir = path.join(__dirname, 'assets', 'diagrams');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const diagrams = {
  'system-architecture.html': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff; width: 1200px; }
  .diagram-container { border: 2px solid #0f172a; border-radius: 16px; padding: 24px; background: #f8fafc; }
  .title { text-align: center; font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 24px; letter-spacing: -0.5px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .tier { border-radius: 12px; padding: 16px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
  .tier-header { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid; }
  .tier-1 .tier-header { color: #2563eb; border-color: #93c5fd; }
  .tier-2 .tier-header { color: #7c3aed; border-color: #c4b5fd; }
  .tier-3 .tier-header { color: #059669; border-color: #6ee7b7; }
  .tier-4 .tier-header { color: #d97706; border-color: #fcd34d; }
  .box { background: #f1f5f9; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; font-size: 13px; color: #1e293b; border-left: 4px solid #64748b; }
  .box strong { display: block; font-size: 13.5px; margin-bottom: 3px; color: #0f172a; }
  .tier-1 .box { border-left-color: #2563eb; background: #eff6ff; }
  .tier-2 .box { border-left-color: #7c3aed; background: #f5f3ff; }
  .tier-3 .box { border-left-color: #059669; background: #ecfdf5; }
  .tier-4 .box { border-left-color: #d97706; background: #fffbeb; }
  .flow-arrow { text-align: center; font-size: 18px; color: #64748b; margin: 6px 0; }
</style>
</head>
<body>
<div class="diagram-container">
  <div class="title">Figure 3.1: SmartServe AI – Multi-Tier High-Level System Architecture</div>
  <div class="grid">
    <div class="tier tier-1">
      <div class="tier-header">1. Presentation Tier</div>
      <div class="box"><strong>Next.js 14 App Router</strong>React 18 Server & Client Components, Dynamic Routing</div>
      <div class="box"><strong>Tailwind CSS & Radix UI</strong>Responsive UI, Theme Shell, Accessible Modals & Forms</div>
      <div class="box"><strong>Recharts & Lucide Icons</strong>Interactive Trend Visualizations, Intuitive Iconography</div>
      <div class="box"><strong>STOMP WebSocket Client</strong>Live bidirectional booking notifications & updates</div>
      <div class="box"><strong>Smart Chat Widget</strong>Conversational Assistant with Quick Suggestion Chips</div>
    </div>
    <div class="tier tier-2">
      <div class="tier-header">2. Security & Gateway Tier</div>
      <div class="box"><strong>Spring Security 6</strong>Stateless session management, RBAC (ROLE_USER, ROLE_ADMIN)</div>
      <div class="box"><strong>JWT Token Filter</strong>HMAC-SHA256 bearer token validation on protected endpoints</div>
      <div class="box"><strong>CORS Configuration</strong>Pattern-based origins: localhost & Vercel deployment domains</div>
      <div class="box"><strong>Global Exception Handler</strong>Unified ErrorResponseDto with field validation tracking</div>
      <div class="box"><strong>OpenAPI / Swagger 3</strong>Auto-generated interactive API documentation at /swagger-ui</div>
    </div>
    <div class="tier tier-3">
      <div class="tier-header">3. Application Business Tier</div>
      <div class="box"><strong>Booking Orchestration</strong>Slot conflict validation, duration management, auto-scheduling</div>
      <div class="box"><strong>AI Fraud Detection Engine</strong>Velocity & pattern checks, dynamic risk score (0-100 threshold)</div>
      <div class="box"><strong>Hybrid Recommendation</strong>6-signal ranking: collaborative, category, ratings, popularity</div>
      <div class="box"><strong>Smart Knowledge Chatbot</strong>15+ domain intent mapping, offline fallback, LLM connector</div>
      <div class="box"><strong>Payment Simulation Engine</strong>Realtime transaction ID generation & failure risk holding</div>
    </div>
    <div class="tier tier-4">
      <div class="tier-header">4. Persistence & Cloud Tier</div>
      <div class="box"><strong>NeonDB Cloud PostgreSQL</strong>Serverless PostgreSQL with SSL & channel binding</div>
      <div class="box"><strong>Spring Data JPA & Hibernate</strong>ORM mapping, automated schema evolution (ddl-auto)</div>
      <div class="box"><strong>HikariCP Connection Pool</strong>Low-latency connection pooling with auto-recovery</div>
      <div class="box"><strong>External AI / Payment APIs</strong>Google Gemini API, OpenAI GPT-4o-mini, Stripe Gateway</div>
      <div class="box"><strong>Local/S3 File Storage</strong>Abstracted provider avatar & document asset management</div>
    </div>
  </div>
</div>
</body>
</html>`,

  'use-case-diagram.html': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff; width: 1200px; }
  .diagram-container { border: 2px solid #0f172a; border-radius: 16px; padding: 24px; background: #ffffff; }
  .title { text-align: center; font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 24px; }
  .layout { display: flex; justify-content: space-between; align-items: stretch; }
  .actor-col { width: 180px; display: flex; flex-direction: column; justify-content: space-around; align-items: center; }
  .actor-card { background: #f8fafc; border: 2px solid #3b82f6; border-radius: 12px; padding: 16px; text-align: center; width: 140px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .actor-icon { font-size: 32px; margin-bottom: 8px; }
  .actor-title { font-weight: 800; font-size: 14px; color: #1e3a8a; }
  .actor-role { font-size: 12px; color: #64748b; margin-top: 4px; }
  .system-box { flex: 1; margin: 0 24px; border: 2px dashed #94a3b8; border-radius: 16px; padding: 20px; background: #fafafa; }
  .system-title { text-align: center; font-weight: 700; color: #475569; font-size: 16px; margin-bottom: 16px; }
  .uc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .uc-pill { background: #ffffff; border: 1.5px solid #2563eb; border-radius: 30px; padding: 10px 16px; text-align: center; font-size: 13px; font-weight: 600; color: #1e293b; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; }
  .uc-admin { border-color: #dc2626; color: #991b1b; }
  .uc-ai { border-color: #7c3aed; color: #5b21b6; }
</style>
</head>
<body>
<div class="diagram-container">
  <div class="title">Figure 3.2: SmartServe AI – UML Use Case Diagram</div>
  <div class="layout">
    <div class="actor-col">
      <div class="actor-card">
        <div class="actor-icon">👤</div>
        <div class="actor-title">Customer User</div>
        <div class="actor-role">ROLE_USER</div>
      </div>
      <div class="actor-card" style="margin-top: 24px; border-color: #059669;">
        <div class="actor-icon">🛠️</div>
        <div class="actor-title">Service Provider</div>
        <div class="actor-role">ROLE_PROVIDER</div>
      </div>
    </div>
    <div class="system-box">
      <div class="system-title">SmartServe AI System Boundary</div>
      <div class="uc-grid">
        <div class="uc-pill">UC1: Register & Authenticate (JWT)</div>
        <div class="uc-pill">UC2: Discover Services & Categories</div>
        <div class="uc-pill">UC3: Semantic Natural Search</div>
        <div class="uc-pill">UC4: Schedule & Book Service Slot</div>
        <div class="uc-pill uc-ai">UC5: AI Fraud Risk Assessment</div>
        <div class="uc-pill">UC6: Simulated / Stripe Payment</div>
        <div class="uc-pill uc-ai">UC7: Personalized Recommendations</div>
        <div class="uc-pill uc-ai">UC8: Interactive AI Chatbot Concierge</div>
        <div class="uc-pill">UC9: Cancel & Reschedule Booking</div>
        <div class="uc-pill">UC10: Rate & Review Completed Service</div>
        <div class="uc-pill uc-admin">UC11: Admin Analytics & Trends</div>
        <div class="uc-pill uc-admin">UC12: Manage Provider Availability</div>
        <div class="uc-pill">UC13: Realtime WebSocket Notifications</div>
        <div class="uc-pill uc-admin">UC14: Review Flagged Bookings</div>
      </div>
    </div>
    <div class="actor-col">
      <div class="actor-card" style="border-color: #dc2626;">
        <div class="actor-icon">🛡️</div>
        <div class="actor-title">Administrator</div>
        <div class="actor-role">ROLE_ADMIN</div>
      </div>
      <div class="actor-card" style="margin-top: 24px; border-color: #7c3aed;">
        <div class="actor-icon">🤖</div>
        <div class="actor-title">AI Engine</div>
        <div class="actor-role">Fraud & Recommender</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`,

  'er-diagram.html': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff; width: 1200px; }
  .diagram-container { border: 2px solid #0f172a; border-radius: 16px; padding: 24px; background: #f8fafc; }
  .title { text-align: center; font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 24px; }
  .tables-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .entity { background: #ffffff; border-radius: 10px; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; }
  .entity-header { background: #1e293b; color: #ffffff; padding: 8px 12px; font-weight: 700; font-size: 14px; display: flex; justify-content: space-between; }
  .entity-header.user { background: #1e3a8a; }
  .entity-header.service { background: #065f46; }
  .entity-header.booking { background: #7c2d12; }
  .entity-header.provider { background: #581c87; }
  .entity-header.rating { background: #831843; }
  .entity-header.history { background: #134e4a; }
  .field-list { padding: 8px 12px; font-size: 12px; line-height: 1.7; font-family: Consolas, monospace; }
  .pk { color: #dc2626; font-weight: 700; }
  .fk { color: #2563eb; font-weight: 700; }
  .type { color: #64748b; font-size: 11px; }
  .rel-box { margin-top: 20px; padding: 14px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; color: #334155; }
  .rel-title { font-weight: 700; color: #0f172a; margin-bottom: 6px; }
</style>
</head>
<body>
<div class="diagram-container">
  <div class="title">Figure 5.1: SmartServe AI – Relational Database Entity-Relationship (ER) Diagram</div>
  <div class="tables-grid">
    <div class="entity">
      <div class="entity-header user"><span>users</span><span>Entity</span></div>
      <div class="field-list">
        <span class="pk">PK</span> id <span class="type">BIGSERIAL</span><br>
        name <span class="type">VARCHAR(255) NOT NULL</span><br>
        email <span class="type">VARCHAR(255) UNIQUE</span><br>
        password <span class="type">VARCHAR(255) (Bcrypt)</span><br>
        role <span class="type">VARCHAR(50) (ROLE_*)</span><br>
        created_at <span class="type">TIMESTAMP</span>
      </div>
    </div>
    <div class="entity">
      <div class="entity-header provider"><span>service_provider</span><span>Entity</span></div>
      <div class="field-list">
        <span class="pk">PK</span> id <span class="type">BIGSERIAL</span><br>
        name <span class="type">VARCHAR(255) NOT NULL</span><br>
        email <span class="type">VARCHAR(255)</span><br>
        phone <span class="type">VARCHAR(50)</span><br>
        available <span class="type">BOOLEAN DEFAULT TRUE</span><br>
        avatar_url <span class="type">VARCHAR(500)</span>
      </div>
    </div>
    <div class="entity">
      <div class="entity-header service"><span>services</span><span>Entity</span></div>
      <div class="field-list">
        <span class="pk">PK</span> id <span class="type">BIGSERIAL</span><br>
        title <span class="type">VARCHAR(255) NOT NULL</span><br>
        description <span class="type">TEXT</span><br>
        category <span class="type">VARCHAR(50) (ENUM)</span><br>
        price <span class="type">DOUBLE PRECISION</span><br>
        <span class="fk">FK</span> provider_id <span class="type">BIGINT &rarr; provider</span>
      </div>
    </div>
    <div class="entity">
      <div class="entity-header booking"><span>bookings</span><span>Entity</span></div>
      <div class="field-list">
        <span class="pk">PK</span> id <span class="type">BIGSERIAL</span><br>
        <span class="fk">FK</span> user_id <span class="type">BIGINT &rarr; users.id</span><br>
        <span class="fk">FK</span> service_id <span class="type">BIGINT &rarr; services.id</span><br>
        status <span class="type">VARCHAR(50) (CONFIRMED/FLAGGED)</span><br>
        risk_score <span class="type">INT (0 - 100)</span><br>
        fraud_message <span class="type">VARCHAR(255)</span><br>
        payment_status <span class="type">VARCHAR(50) (SUCCESS/FAILED)</span><br>
        payment_tx_id <span class="type">VARCHAR(100)</span><br>
        scheduled_at <span class="type">TIMESTAMP</span><br>
        duration_minutes <span class="type">INT (30 - 240)</span><br>
        created_at <span class="type">TIMESTAMP</span>
      </div>
    </div>
    <div class="entity">
      <div class="entity-header rating"><span>ratings</span><span>Entity</span></div>
      <div class="field-list">
        <span class="pk">PK</span> id <span class="type">BIGSERIAL</span><br>
        <span class="fk">FK</span> user_id <span class="type">BIGINT &rarr; users.id</span><br>
        <span class="fk">FK</span> service_id <span class="type">BIGINT &rarr; services.id</span><br>
        score <span class="type">INT CHECK (score 1-5)</span><br>
        comment <span class="type">TEXT</span><br>
        created_at <span class="type">TIMESTAMP</span>
      </div>
    </div>
    <div class="entity">
      <div class="entity-header history"><span>user_behavior_history</span><span>Entity</span></div>
      <div class="field-list">
        <span class="pk">PK</span> id <span class="type">BIGSERIAL</span><br>
        <span class="fk">FK</span> user_id <span class="type">BIGINT &rarr; users.id</span><br>
        <span class="fk">FK</span> service_id <span class="type">BIGINT &rarr; services.id</span><br>
        action <span class="type">VARCHAR(50) (BOOKING/VIEW)</span><br>
        metadata <span class="type">VARCHAR(500)</span><br>
        created_at <span class="type">TIMESTAMP</span>
      </div>
    </div>
  </div>
  <div class="rel-box">
    <div class="rel-title">Key Relationships & Cardinality:</div>
    &bull; <strong>users (1) &mdash; (&infin;) bookings:</strong> A user can initiate many bookings.<br>
    &bull; <strong>services (1) &mdash; (&infin;) bookings:</strong> A local service can be booked multiple times.<br>
    &bull; <strong>service_provider (1) &mdash; (&infin;) services:</strong> A verified provider registers and offers multiple services.<br>
    &bull; <strong>users (1) &mdash; (&infin;) ratings:</strong> Customers evaluate services with 1 to 5 star scores and textual reviews.<br>
    &bull; <strong>users (1) &mdash; (&infin;) user_behavior_history:</strong> Real-time personalization tracking actions for collaborative filtering.
  </div>
</div>
</body>
</html>`,

  'ai-engine-workflow.html': `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff; width: 1200px; }
  .diagram-container { border: 2px solid #0f172a; border-radius: 16px; padding: 24px; background: #f8fafc; }
  .title { text-align: center; font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 24px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .panel { background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .panel-header { font-weight: 800; font-size: 16px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid; }
  .panel-fraud .panel-header { color: #dc2626; border-color: #fca5a5; }
  .panel-rec .panel-header { color: #2563eb; border-color: #93c5fd; }
  .step { background: #f1f5f9; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; font-size: 13px; border-left: 4px solid #64748b; }
  .panel-fraud .step { border-left-color: #dc2626; background: #fef2f2; }
  .panel-rec .step { border-left-color: #2563eb; background: #eff6ff; }
  .step strong { display: block; font-size: 13.5px; color: #0f172a; margin-bottom: 2px; }
  .arrow { text-align: center; font-size: 16px; color: #94a3b8; margin: -6px 0 6px 0; font-weight: bold; }
  .weight-bar { background: #e2e8f0; border-radius: 6px; height: 18px; margin-top: 6px; overflow: hidden; position: relative; }
  .weight-fill { height: 100%; border-radius: 6px; color: #ffffff; font-size: 11px; font-weight: bold; line-height: 18px; text-align: right; padding-right: 6px; }
</style>
</head>
<body>
<div class="diagram-container">
  <div class="title">Figure 3.3: AI Intelligence Engines – Fraud Detection &amp; Hybrid Recommendation Workflow</div>
  <div class="cols">
    <div class="panel panel-fraud">
      <div class="panel-header">🛡️ Automated AI Fraud Detection Pipeline</div>
      <div class="step">
        <strong>1. Booking Request Interception</strong>
        Captures User ID, Service ID, Timestamp, and Provider state at POST /api/bookings.
      </div>
      <div class="arrow">&darr;</div>
      <div class="step">
        <strong>2. Velocity Engine Check</strong>
        Calculates bookings per minute (&gt;2) and bookings in past 1 hr (&gt;4). Adds velocity penalty +30.
      </div>
      <div class="arrow">&darr;</div>
      <div class="step">
        <strong>3. Pattern &amp; Repetition Analyzer</strong>
        Evaluates repeat service orders (&gt;2 same service) & category concentration. Adds pattern penalty +25.
      </div>
      <div class="arrow">&darr;</div>
      <div class="step">
        <strong>4. Historical Risk Assessment</strong>
        Scans previous user flagged booking ratio in database. Adds past misconduct penalty +25.
      </div>
      <div class="arrow">&darr;</div>
      <div class="step">
        <strong>5. Dynamic Threshold Gate (&gt;= 70 Risk Score)</strong>
        Score &ge; 70: Mark booking <strong>FLAGGED</strong>, trigger payment hold, alert Admin.<br>
        Score &lt; 70: Mark booking <strong>CONFIRMED</strong>, execute payment, notify WebSocket.
      </div>
    </div>

    <div class="panel panel-rec">
      <div class="panel-header">🤖 Hybrid Personalized Recommendation Engine</div>
      <div class="step">
        <strong>1. User Context &amp; History Ingestion</strong>
        Fetches user's past 50 behavior actions, category preferences &amp; completed bookings.
      </div>
      <div class="arrow">&darr;</div>
      <div class="step">
        <strong>2. 6-Signal Multi-Criteria Scoring Formula:</strong>
        <div style="margin-top: 8px;">
          Collaborative Filtering (34%):
          <div class="weight-bar"><div class="weight-fill" style="width: 34%; background: #2563eb;">34%</div></div>
        </div>
        <div style="margin-top: 6px;">
          Customer Star Rating (20%):
          <div class="weight-bar"><div class="weight-fill" style="width: 20%; background: #059669;">20%</div></div>
        </div>
        <div style="margin-top: 6px;">
          Category Affinity (18%):
          <div class="weight-bar"><div class="weight-fill" style="width: 18%; background: #7c3aed;">18%</div></div>
        </div>
        <div style="margin-top: 6px;">
          Booking Popularity (16%):
          <div class="weight-bar"><div class="weight-fill" style="width: 16%; background: #d97706;">16%</div></div>
        </div>
        <div style="margin-top: 6px;">
          Recent User Behavior (10%):
          <div class="weight-bar"><div class="weight-fill" style="width: 10%; background: #0891b2;">10%</div></div>
        </div>
        <div style="margin-top: 6px;">
          Service Freshness (2%):
          <div class="weight-bar"><div class="weight-fill" style="width: 10%; background: #475569;">2%</div></div>
        </div>
      </div>
      <div class="arrow">&darr;</div>
      <div class="step">
        <strong>3. Ranked Output &amp; Cache Invalidation</strong>
        Returns ranked DTOs to dashboard, records recommendation_viewed action, caches in Redis/Caffeine.
      </div>
    </div>
  </div>
</div>
</body>
</html>`
};

async function render() {
  const profileDir = path.join(__dirname, 'profile-' + Date.now());
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1240, height: 800, deviceScaleFactor: 2 });

  for (const [filename, html] of Object.entries(diagrams)) {
    const htmlPath = path.join(outDir, filename);
    fs.writeFileSync(htmlPath, html, 'utf8');
    const pngName = filename.replace('.html', '.png');
    const pngPath = path.join(outDir, pngName);

    console.log(`Rendering ${pngName}...`);
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle2' });
    const el = await page.$('.diagram-container');
    if (el) {
      await el.screenshot({ path: pngPath });
    } else {
      await page.screenshot({ path: pngPath });
    }
  }

  await browser.close();
  console.log('All diagrams rendered successfully!');
}

render();
