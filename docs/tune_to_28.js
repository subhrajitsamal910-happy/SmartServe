const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.join(__dirname);
const reportHtmlPath = path.join(baseDir, 'documentation', 'report.html');
const pdfPath = path.join(baseDir, 'documentation', 'Final_Project_Document.pdf');
const profileDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fb013ef5-04e2-4e4a-af63-25d5f30c7983\\scratch\\chrome-pdf-tune';

// Read current report.html
let html = fs.readFileSync(reportHtmlPath, 'utf8');

// In Chapter 7, let's adjust figure image max-height from 220px to 235px and add a page-break before Section 7.3 so Chapter 7 expands cleanly by 1 page
html = html.replace('.figure-img {\\n    max-width: 92%;\\n    max-height: 220px;', '.figure-img {\\n    max-width: 92%;\\n    max-height: 235px;');

// Add a clean page break before Figure 7.5
html = html.replace('<!-- Pair 3: Booking Modal & Chatbot -->', '<div style="page-break-before: always; break-before: page;"></div>\\n  <!-- Pair 3: Booking Modal & Chatbot -->');

fs.writeFileSync(reportHtmlPath, html, 'utf8');

// Compile and check page count
const cmd = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --no-sandbox --disable-gpu --user-data-dir="${profileDir}" --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file:///${reportHtmlPath.replace(/\\/g, '/')}"`;
execSync(cmd, { stdio: 'ignore' });

// Count
const content = fs.readFileSync(pdfPath, 'latin1');
const pagesObjRegex = /(\d+\s+\d+\s+obj[\s\S]*?\/Type\s*\/Pages[\s\S]*?\/Count\s+(\d+)[\s\S]*?endobj)/g;
let m;
let maxCount = 0;
while ((m = pagesObjRegex.exec(content)) !== null) {
  const c = parseInt(m[2], 10);
  if (c > maxCount) maxCount = c;
}
console.log('New True Page Count:', maxCount);

