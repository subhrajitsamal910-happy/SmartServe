const fs = require('fs');
const content = fs.readFileSync('c:/Users/Lenovo/Desktop/SmartServe/smartserve-ai-booking-platform/docs/documentation/Final_Project_Document.pdf', 'latin1');

// Match all objects like: "12 0 obj ... /Type /Pages ... /Count 28 ... endobj"
const pagesObjRegex = /(\d+\s+\d+\s+obj[\s\S]*?\/Type\s*\/Pages[\s\S]*?\/Count\s+(\d+)[\s\S]*?endobj)/g;
let m;
let maxCount = 0;
while ((m = pagesObjRegex.exec(content)) !== null) {
  const c = parseInt(m[2], 10);
  if (c > maxCount) maxCount = c;
}
console.log('True Root Page Count:', maxCount);

