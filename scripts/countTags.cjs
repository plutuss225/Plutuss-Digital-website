const fs = require('fs');
const path = 'src/pages/HomePage.jsx';
const text = fs.readFileSync(path, 'utf8');
const lines = text.split('\n');
const upto = lines.slice(0, 300).join('\n');
const opens = (upto.match(/<section/g) || []).length;
const closes = (upto.match(/<\/section>/g) || []).length;
console.log('sections open:', opens, 'sections close:', closes);
const mainOpens = (upto.match(/<main/g) || []).length;
const mainCloses = (upto.match(/<\/main>/g) || []).length;
console.log('main open:', mainOpens, 'main close:', mainCloses);
// Print lines around 220-280
for (let i = 219; i < 281; i++) {
  console.log((i+1)+': '+lines[i]);
}
