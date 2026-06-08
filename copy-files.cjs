const fs = require('fs');

function safeCopy(src, dest) {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${src} to ${dest}`);
    } else {
        console.warn(`Warning: ${src} not found, skipping copy.`);
    }
}

// Make sure dist directory exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

safeCopy('components.js', 'dist/components.js');
safeCopy('firebase-service.js', 'dist/firebase-service.js');
safeCopy('script.js', 'dist/script.js');
