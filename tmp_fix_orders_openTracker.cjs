const fs = require('fs');
let html = fs.readFileSync('orders.html', 'utf8');

const badFuncStart = html.indexOf('function openTracker(id, status, stepStr, etaStr) {');
const badFuncEnd = html.indexOf('trackModal.style.display = "flex";', badFuncStart) + 'trackModal.style.display = "flex";\n            }'.length;

const goodFunc = `function openTracker(id, status, stepStr, etaStr) {
                const step = parseInt(stepStr) || 1;
                trackModalId.textContent = id;
                trackModalStatus.textContent = status;
                
                if (etaStr) {
                    trackModalEta.textContent = etaStr;
                    trackModalEtaContainer.style.display = "block";
                } else {
                    trackModalEtaContainer.style.display = "none";
                }
                
                // Update Progress Line (20% per step)
                const linePercentage = (step - 1) * 20 + 10; 
                trackProgressLine.style.width = Math.min(linePercentage, 100) + "%";

                // Update Icons
                for (let i = 1; i <= 5; i++) {
                    const iconWrap = document.querySelector(\`#t-step-\${i} .t-icon\`);
                    if (iconWrap) {
                        if (i <= step) {
                            iconWrap.style.borderColor = "#10b981";
                            iconWrap.style.color = "#10b981";
                        } else {
                            iconWrap.style.borderColor = "var(--card-border)";
                            iconWrap.style.color = "var(--text-muted)";
                        }
                    }
                }

                trackContactSupport.onclick = () => {
                    const message = \`Hello Support!\\n\\nI want to track my order:\\n*Reference ID:* \${id}\\n*Current Status:* \${status}\\n\\nPlease provide an update.\`;
                    window.open(\`https://wa.me/917463053829?text=\${encodeURIComponent(message)}\`, "_blank");
                };

                trackModal.style.display = "flex";
            }`;

html = html.slice(0, badFuncStart) + goodFunc + html.slice(badFuncEnd);

fs.writeFileSync('orders.html', html);
console.log('Fixed openTracker in orders.html');
