const fs = require('fs');
let html = fs.readFileSync('orders.html', 'utf8');

html = html.replace(
    '// Tracking Modal Logic',
    '}\n            // Tracking Modal Logic'
);

fs.writeFileSync('orders.html', html);
console.log('Fixed missing brace in orders.html');
