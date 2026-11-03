const fs = require('fs');
const path = require('path');
const puppeteer = require('./node_modules/puppeteer-core');

const baseDir = path.resolve(__dirname, '..'); // smartserve-ai-booking-platform
const rootDir = path.resolve(baseDir, '..');   // SmartServe
const headerImgPath = path.join(__dirname, 'assets', 'image2.png');

// Target output directories:
// 1. Root SmartServe/tables
// 2. Project smartserve-ai-booking-platform/tables
// 3. Documentation tables folder
const outDirs = [
  path.join(rootDir, 'tables'),
  path.join(baseDir, 'tables'),
  path.join(__dirname, 'tables')
];

for (const d of outDirs) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
}

// Read header image as base64
const headerBase64 = fs.existsSync(headerImgPath)
  ? `data:image/png;base64,${fs.readFileSync(headerImgPath).toString('base64')}`
  : '';

console.log('Header image loaded, base64 length:', headerBase64.length);

const sharedStyles = `
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    font-family: 'Times New Roman', Times, serif;
    color: #000000;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 820px;
    padding: 35px 45px 45px 45px;
    margin: 0 auto;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .header-banner {
    width: 100%;
    margin-bottom: 20px;
    border-bottom: 2px solid #002060;
    padding-bottom: 6px;
  }
  .header-banner img {
    width: 100%;
    height: auto;
    display: block;
  }
  .page-title {
    font-size: 19pt;
    font-weight: bold;
    text-align: center;
    margin: 10px 0 20px 0;
    text-decoration: underline;
    text-underline-offset: 4px;
    letter-spacing: 0.3px;
    color: #000000;
  }
  .page-subtitle {
    font-size: 14pt;
    font-weight: bold;
    text-align: left;
    margin: 18px 0 10px 0;
    text-decoration: underline;
    text-underline-offset: 3px;
    color: #000000;
  }
  table.custom-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11pt;
    line-height: 1.45;
    margin-top: 5px;
    background-color: #ffffff;
  }
  table.custom-table th {
    border: 1px solid #000000;
    padding: 7px 10px;
    background-color: #f2f2f2;
    font-weight: bold;
    color: #000000;
  }
  table.custom-table td {
    border: 1px solid #000000;
    padding: 6px 10px;
    color: #111111;
  }
  .col-center {
    text-align: center;
  }
  .col-left {
    text-align: left;
  }
  .col-right {
    text-align: right;
  }
  .table-container {
    width: 820px;
    padding: 20px;
    background: #ffffff;
  }
`;

// 1. Table of Contents Data (Matching Friend's QuizLab Report Format)
const tocRows = [
  { sl: '1', title: 'Title Page', page: '1' },
  { sl: '2', title: 'Certificate', page: '2' },
  { sl: '3', title: 'Declaration', page: '3' },
  { sl: '4', title: 'Acknowledgement', page: '4' },
  { sl: '5', title: 'Abstract', page: '5' },
  { sl: '6', title: 'Table of Contents', page: '6' },
  { sl: '7', title: 'List of Figures and Tables', page: '7' },
  { sl: '8', title: 'Chapter 1: Introduction', page: '8' },
  { sl: '9', title: 'Chapter 2: Requirements Analysis and PRD', page: '11' },
  { sl: '10', title: 'Chapter 3: System Analysis and Design', page: '14' },
  { sl: '11', title: 'Chapter 4: Technology Stack and Development Plan', page: '18' },
  { sl: '12', title: 'Chapter 5: Database Design and API Specification', page: '21' },
  { sl: '13', title: 'Chapter 6: Testing and Evaluation', page: '25' },
  { sl: '14', title: 'Chapter 7: Deployment and Results', page: '28' },
  { sl: '15', title: 'Chapter 8: Conclusion and Future Scope', page: '34' },
  { sl: '16', title: 'References / Bibliography', page: '36' }
];

// 2. List of Figures Data (Matching SmartServe AI Artifacts & Friend's Format)
const figuresRows = [
  { no: 'Figure 3.1', title: 'System architecture blueprint of SmartServe AI', page: '15' },
  { no: 'Figure 3.2', title: 'Workflow of real-time service booking and scheduling', page: '16' },
  { no: 'Figure 3.3', title: 'Multi-vector AI fraud detection engine workflow', page: '17' },
  { no: 'Figure 3.4', title: 'UML use case diagram of SmartServe AI', page: '17' },
  { no: 'Figure 3.5', title: 'Level 0 DFD (context diagram)', page: '18' },
  { no: 'Figure 3.6', title: 'Level 1 DFD (functional decomposition)', page: '18' },
  { no: 'Figure 5.1', title: 'Entity-relationship (ER) schema blueprint', page: '22' },
  { no: 'Figure 7.1', title: 'Application landing and services showcase portal', page: '28' },
  { no: 'Figure 7.2', title: 'Secure user login authentication screen', page: '29' },
  { no: 'Figure 7.3', title: 'Customer and provider registration interface', page: '29' },
  { no: 'Figure 7.4', title: 'Authenticated customer cockpit dashboard', page: '30' },
  { no: 'Figure 7.5', title: 'Interactive service booking modal with dynamic duration', page: '31' },
  { no: 'Figure 7.6', title: 'Floating AI concierge chatbot with suggestion chips', page: '31' },
  { no: 'Figure 7.7', title: 'Administrative telemetry and fraud analytics', page: '32' },
  { no: 'Figure 7.8', title: 'Interactive OpenAPI / Swagger UI documentation', page: '32' }
];

// 3. List of Tables Data (Matching Friend's Exact Structure & Chapters)
const tablesRows = [
  { no: 'Table 1.1', title: 'Target users and operational personas', page: '9' },
  { no: 'Table 1.2', title: 'Comparison of service booking platforms (Existing vs. Proposed)', page: '10' },
  { no: 'Table 2.1', title: 'Functional requirements', page: '11' },
  { no: 'Table 2.2', title: 'Non-functional requirements', page: '11' },
  { no: 'Table 2.3', title: 'User stories and operational scenarios', page: '12' },
  { no: 'Table 2.4', title: 'Use case specifications', page: '12' },
  { no: 'Table 2.5', title: 'Features and acceptance criteria', page: '13' },
  { no: 'Table 3.1', title: 'Architecture layers and security boundaries', page: '14' },
  { no: 'Table 3.2', title: 'Front-end and backend system components', page: '14' },
  { no: 'Table 3.3', title: 'User-interface design decisions and theme tokens', page: '15' },
  { no: 'Table 4.1', title: 'Technologies used in SmartServe AI', page: '18' },
  { no: 'Table 4.2', title: 'Development tools and infrastructure', page: '19' },
  { no: 'Table 4.3', title: 'APIs and third-party integrations', page: '19' },
  { no: 'Table 4.4', title: 'Technology selection justification and trade-offs', page: '20' },
  { no: 'Table 4.5', title: 'Project development milestones and build plan', page: '20' },
  { no: 'Table 5.1', title: 'Tables, columns and integrity constraints', page: '22' },
  { no: 'Table 5.2', title: 'Entity relationships and cardinalities', page: '23' },
  { no: 'Table 5.3', title: 'RESTful API endpoints and HTTP methods', page: '24' },
  { no: 'Table 5.4', title: 'Access matrix enforced by Spring Security & RBAC', page: '24' },
  { no: 'Table 5.5', title: 'Threats and mitigation controls', page: '25' },
  { no: 'Table 6.1', title: 'Testing levels and QA methodologies', page: '25' },
  { no: 'Table 6.2', title: 'Automated test cases and execution matrix (45 Tests)', page: '26' },
  { no: 'Table 6.3', title: 'Evaluation of AI-assisted output and accuracy', page: '27' },
  { no: 'Table 7.1', title: 'Implemented and planned features', page: '33' },
  { no: 'Table 7.2', title: 'Expected versus actual verification results', page: '33' },
  { no: 'Table 7.3', title: 'Engineering challenges and solutions', page: '34' }
];

function buildHtmlPage(title, tableHtml) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="page" id="page-content">
    <div class="header-banner">
      <img src="${headerBase64}" alt="Srusti Academy of Management and Technology Header" />
    </div>
    <div class="page-title">${title}</div>
    ${tableHtml}
  </div>
</body>
</html>`;
}

function buildTableOnlyHtml(tableHtml) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="table-container" id="table-content">
    ${tableHtml}
  </div>
</body>
</html>`;
}

function renderTable(headers, rows, widths = ['15%', '70%', '15%'], alignments = ['center', 'left', 'center']) {
  let html = `<table class="custom-table">\n<thead>\n<tr>\n`;
  headers.forEach((h, i) => {
    html += `  <th style="width:${widths[i]}; text-align:${alignments[i]};">${h}</th>\n`;
  });
  html += `</tr>\n</thead>\n<tbody>\n`;
  rows.forEach(r => {
    html += `<tr>\n`;
    html += `  <td class="col-${alignments[0]}">${r.c1}</td>\n`;
    html += `  <td class="col-${alignments[1]}">${r.c2}</td>\n`;
    html += `  <td class="col-${alignments[2]}">${r.c3}</td>\n`;
    html += `</tr>\n`;
  });
  html += `</tbody>\n</table>\n`;
  return html;
}

async function run() {
  console.log('Launching browser (Edge)...');
  const profileDir = path.join(__dirname, 'profile-tbl-' + Date.now());
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 880, height: 1200, deviceScaleFactor: 2.5 }); // Crisp 2.5x retina resolution!

  async function saveImage(html, selector, filename) {
    await page.setContent(html, { waitUntil: 'networkidle2' });
    const element = await page.$(selector);
    const buffer = await element.screenshot({ type: 'png', omitBackground: false });
    for (const d of outDirs) {
      const target = path.join(d, filename);
      fs.writeFileSync(target, buffer);
      console.log(`Saved: ${target} (${buffer.length} bytes)`);
    }
  }

  // 1. Table of Contents
  console.log('Rendering Table of Contents...');
  const tocTableHtml = renderTable(
    ['Sl. No.', 'Contents', 'Page No.'],
    tocRows.map(r => ({ c1: r.sl, c2: r.title, c3: r.page }))
  );
  await saveImage(buildHtmlPage('Table of Contents', tocTableHtml), '#page-content', '01_table_of_contents_page.png');
  await saveImage(buildTableOnlyHtml(tocTableHtml), '#table-content', '01_table_of_contents_table.png');

  // 2. List of Figures
  console.log('Rendering List of Figures...');
  const figTableHtml = renderTable(
    ['Figure No.', 'Title', 'Page No.'],
    figuresRows.map(r => ({ c1: r.no, c2: r.title, c3: r.page })),
    ['18%', '67%', '15%']
  );
  await saveImage(buildHtmlPage('List of Figures', figTableHtml), '#page-content', '02_list_of_figures_page.png');
  await saveImage(buildTableOnlyHtml(figTableHtml), '#table-content', '02_list_of_figures_table.png');

  // 3. List of Tables (Split into Part 1, Part 2, and Single Continuous Table)
  console.log('Rendering List of Tables...');
  const tablesPart1 = tablesRows.slice(0, 14);
  const tablesPart2 = tablesRows.slice(14);

  const tblTableHtmlFull = renderTable(
    ['Table No.', 'Title', 'Page No.'],
    tablesRows.map(r => ({ c1: r.no, c2: r.title, c3: r.page })),
    ['18%', '67%', '15%']
  );
  const tblTableHtmlPart1 = renderTable(
    ['Table No.', 'Title', 'Page No.'],
    tablesPart1.map(r => ({ c1: r.no, c2: r.title, c3: r.page })),
    ['18%', '67%', '15%']
  );
  const tblTableHtmlPart2 = renderTable(
    ['Table No.', 'Title', 'Page No.'],
    tablesPart2.map(r => ({ c1: r.no, c2: r.title, c3: r.page })),
    ['18%', '67%', '15%']
  );

  // Full Page Part 1
  await saveImage(buildHtmlPage('List of Tables (Part 1)', tblTableHtmlPart1), '#page-content', '03_list_of_tables_page_part1.png');
  // Full Page Part 2
  await saveImage(buildHtmlPage('List of Tables (Part 2)', tblTableHtmlPart2), '#page-content', '03_list_of_tables_page_part2.png');
  // Single continuous full table
  await saveImage(buildTableOnlyHtml(tblTableHtmlFull), '#table-content', '03_list_of_tables_table.png');

  // 4. Combined List of Figures & Tables Page (Standard Template Page 7)
  console.log('Rendering Combined List of Figures & Tables Page...');
  const combinedHtml = `
    <div class="page-subtitle" style="margin-top:0;">List of Figures</div>
    ${figTableHtml}
    <div class="page-subtitle" style="margin-top:25px;">List of Tables (Summary)</div>
    ${renderTable(
      ['Table No.', 'Title', 'Page No.'],
      tablesRows.slice(0, 8).map(r => ({ c1: r.no, c2: r.title, c3: r.page })),
      ['18%', '67%', '15%']
    )}
  `;
  await saveImage(buildHtmlPage('List of Figures and Tables', combinedHtml), '#page-content', '00_list_of_figures_and_tables_combined_page.png');

  await browser.close();

  // Clean up temporary profile directory
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('All table images generated successfully!');
}

run().catch(err => {
  console.error('Generation error:', err);
  process.exit(1);
});
