const fs = require('fs');
let code = fs.readFileSync('firebase-service.js', 'utf8');
code = code.replace(/db\.collection\("users"\)/g, 'db.collection("userProfiles")');
fs.writeFileSync('firebase-service.js', code);
console.log('Done replacing users with userProfiles in firebase-service.js');
