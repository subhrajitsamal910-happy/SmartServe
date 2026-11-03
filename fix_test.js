const fs = require('fs');
const p = 'C:/Users/Lenovo/.gemini/antigravity/brain/fb013ef5-04e2-4e4a-af63-25d5f30c7983/scratch/test_all.ps1';
let content = fs.readFileSync(p, 'utf8');
content = content.replace(
  'Check "GET /recommendations/me works"        ($recs.recommendedServices -ne $null)',
  'Check "GET /recommendations/me works"        ($null -ne $recs.recommendedServices)'
);
fs.writeFileSync(p, content, 'utf8');
console.log('Fixed line 91 in test_all.ps1');
