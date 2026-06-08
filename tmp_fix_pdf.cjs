const fs = require('fs');

const files = ['admin-quotation.html', 'admin-billing.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/html2canvas:\s*\{\s*scale:\s*2,\s*useCORS:\s*true\s*\}/g, "html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0, backgroundColor: '#ffffff', windowWidth: document.documentElement.offsetWidth }");
    fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed html2canvas scroll bug.');
