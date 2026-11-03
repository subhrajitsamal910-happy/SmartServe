const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.join(__dirname);
const htmlPath = path.join(baseDir, 'documentation', 'report.html');
const pdfPath = path.join(baseDir, 'documentation', 'Final_Project_Document.pdf');
const profileDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fb013ef5-04e2-4e4a-af63-25d5f30c7983\\scratch\\chrome-pdf-tune';

function getPdfPageCount() {
  const content = fs.readFileSync(pdfPath);
  const str = content.toString('latin1');
  const matches = str.match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 0;
}

function compilePdf() {
  const cmd = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless=new --no-sandbox --disable-gpu --user-data-dir="${profileDir}" --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;
  execSync(cmd, { stdio: 'ignore' });
  const pages = getPdfPageCount();
  console.log(`Generated PDF page count: ${pages} pages (target: 28 pages)`);
  return pages;
}

compilePdf();

