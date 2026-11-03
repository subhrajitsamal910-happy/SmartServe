const fs = require('fs');
const content = fs.readFileSync('c:/Users/Lenovo/Desktop/SmartServe/smartserve-ai-booking-platform/docs/documentation/Final_Project_Document.pdf');
const str = content.toString('latin1');
const pages = str.split('/Type /Page');
console.log('Total pages found:', pages.length - 1);
pages.slice(1).forEach((page, i) => {
  const match = page.match(/Chapter \d|Certificate|Declaration|Acknowledgement|Abstract|Table of Contents|List of Figures|References/);
  if (match) {
    console.log(`Page ${i + 1}: contains ${match[0]}`);
  }
});

