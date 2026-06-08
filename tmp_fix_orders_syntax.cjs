const fs = require('fs');
let html = fs.readFileSync('orders.html', 'utf8');

// Fix iconWrap
html = html.replace(
    'const iconWrap = document.querySelector(\\#t-step-\\ .t-icon\\);',
    'const iconWrap = document.querySelector(`#t-step-${i} .t-icon`);'
);

// Fix message string
const badMessage = `                    const message = \\Hello Support!\\n\\nI want to track my order:\\n*Reference ID:* \\\\n*Current Status:* \\\\n\\nPlease provide an update.\\;
                    window.open(\\https://wa.me/917463053829?text=\\\\, "_blank");`;

const goodMessage = `                    const message = \`Hello Support!\\n\\nI want to track my order:\\n*Reference ID:* \${id}\\n*Current Status:* \${status}\\n\\nPlease provide an update.\`;
                    window.open(\`https://wa.me/917463053829?text=\${encodeURIComponent(message)}\`, "_blank");`;

html = html.replace(badMessage, goodMessage);

fs.writeFileSync('orders.html', html);
console.log('Fixed syntax errors in orders.html');
