const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname);
const reportHtmlPath = path.join(baseDir, 'documentation', 'report.html');

// Read report.html and replace all data:image/...;base64,... with relative paths
let html = fs.readFileSync(reportHtmlPath, 'utf8');

// Replace College logo
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="Srusti Academy Logo"/, 'src="../assets/image1.png" alt="Srusti Academy Logo"');

// Replace Diagram paths
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="System Architecture"/, 'src="../assets/diagrams/system-architecture.png" alt="System Architecture"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="Use Case Diagram"/, 'src="../assets/diagrams/use-case-diagram.png" alt="Use Case Diagram"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="ER Diagram"/, 'src="../assets/diagrams/er-diagram.png" alt="ER Diagram"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="AI Workflow"/, 'src="../assets/diagrams/ai-engine-workflow.png" alt="AI Workflow"');

// Replace Screenshot paths
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="Landing Page"/, 'src="../assets/screenshots/01-landing-page.png" alt="Landing Page"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="Login Page"/, 'src="../assets/screenshots/02-login-page.png" alt="Login Page"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="Signup Page"/, 'src="../assets/screenshots/03-signup-page.png" alt="Signup Page"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="Customer Dashboard"/, 'src="../assets/screenshots/04-customer-dashboard.png" alt="Customer Dashboard"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="Booking Modal"/, 'src="../assets/screenshots/05-booking-modal.png" alt="Booking Modal"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="AI Chatbot"/, 'src="../assets/screenshots/06-ai-chatbot.png" alt="AI Chatbot"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="Admin Analytics"/, 'src="../assets/screenshots/07-admin-analytics.png" alt="Admin Analytics"');
html = html.replace(/src="data:image\/png;base64,[^"]*?" alt="Swagger UI"/, 'src="../assets/screenshots/08-swagger-api-docs.png" alt="Swagger UI"');

fs.writeFileSync(reportHtmlPath, html, 'utf8');
console.log('Replaced base64 images with relative file paths. New size:', fs.statSync(reportHtmlPath).size, 'bytes');

