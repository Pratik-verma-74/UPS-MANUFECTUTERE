const fs = require('fs');
let html = fs.readFileSync('orders.html', 'utf8');

// The problematic lines were:
// const iconWrap = document.querySelector(\#t-step-\ .t-icon\);
// const message = \Hello Support!\n\nI want to track my order:\n*Reference ID:* \\n*Current Status:* \\n\nPlease provide an update.\;
// window.open(\https://wa.me/917463053829?text=\\, "_blank");

html = html.replace(/const iconWrap = document\.querySelector\(\\#t-step-\\\s*\.t-icon\\\);/g, 'const iconWrap = document.querySelector(`#t-step-${i} .t-icon`);');
html = html.replace(/const message = \\Hello Support!\\\\n\\\\nI want to track my order:\\\\n\*Reference ID:\* \\\\\\n\*Current Status:\* \\\\\\n\\\\nPlease provide an update\.\\;/g, 'const message = `Hello Support!\\n\\nI want to track my order:\\n*Reference ID:* ${id}\\n*Current Status:* ${status}\\n\\nPlease provide an update.`;');
html = html.replace(/window\.open\(\\https:\/\/wa\.me\/917463053829\?text=\\\\\\, "_blank"\);/g, 'window.open(`https://wa.me/917463053829?text=${encodeURIComponent(message)}`, "_blank");');

fs.writeFileSync('orders.html', html);
console.log('Fixed syntax errors in orders.html via regex');
