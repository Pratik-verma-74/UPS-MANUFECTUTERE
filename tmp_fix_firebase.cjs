const fs = require('fs');
let code = fs.readFileSync('firebase-service.js', 'utf8');

code = code.replace(
    '    async adminDeleteDocument(collectionName, documentId) {',
    '    },\n    async adminDeleteDocument(collectionName, documentId) {'
);

fs.writeFileSync('firebase-service.js', code);
console.log('Fixed syntax error in firebase-service.js cleanly');
