const fs = require('fs');

const apiPath = 'c:/Users/Lenovo/Desktop/SmartServe/smartserve-ai-booking-platform/frontend/src/lib/api.ts';
let apiContent = fs.readFileSync(apiPath, 'utf8');

const target = "throw new Error(payload?.message || payload?.error || 'Request failed');";
const replacement = `const fieldMsgs = payload?.fieldErrors ? Object.values(payload.fieldErrors).join(', ') : null;
    throw new Error(fieldMsgs || payload?.message || payload?.error || 'Request failed');`;

if (apiContent.includes(target)) {
  apiContent = apiContent.replace(target, replacement);
  fs.writeFileSync(apiPath, apiContent, 'utf8');
  console.log('Successfully updated api.ts');
} else {
  console.log('Target string not found in api.ts');
}
