const fs = require('fs');

let c = fs.readFileSync('orders.html', 'utf8');

const correctLogic = `
                // Repairs
                const repairRows = document.getElementById("repair-tickets-rows");
                if (repairTickets.length === 0) repairsBlock.style.display = "none";
                else {
                    repairTickets.forEach(t => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = \`
                            <td><strong>\${t.id}</strong></td>
                            <td>\${t.brand} (\${t.model})</td>
                            <td>\${t.capacity}</td>
                            <td title="\${t.issue}" style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${t.issue}</td>
                            <td><span class="status-badge \${getStatusClass(t.status)}">\${t.status}</span></td>
                            <td>\${t.date || 'N/A'}</td>
                            <td>
                                <button class="btn btn-primary btn-invoice" data-id="\${t.id}" data-type="repair" style="padding: 6px 12px; font-size: 13px; margin-right: 8px;"><i class="fa-solid fa-file-invoice"></i> Bill</button>
                                <button class="btn btn-glass btn-track" data-id="\${t.id}" data-status="\${t.status}" data-step="\${t.statusStep || 1}" data-eta="\${t.expectedDate || ''}" style="padding: 6px 12px; font-size: 11px;">
                                    <span>Track</span> <i class="fa-solid fa-location-dot"></i>
                                </button>
                            </td>
                        \`;
                        repairRows.appendChild(tr);
                    });
                }

                // Custom
                const customRows = document.getElementById("custom-orders-rows");
                if (customBuilds.length === 0) customsBlock.style.display = "none";
                else {
                    customBuilds.forEach(build => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = \`
                            <td><strong>\${build.id}</strong></td>
                            <td>\${build.blueprintType}</td>
                            <td>\${build.capacity}</td>
                            <td>\${build.redundancy}</td>
                            <td><span class="status-badge \${getStatusClass(build.status)}">\${build.status}</span></td>
                            <td>\${build.date || 'N/A'}</td>
                            <td>
                                <button class="btn btn-primary btn-invoice" data-id="\${build.id}" data-type="custom" style="padding: 6px 12px; font-size: 13px; margin-right: 8px;"><i class="fa-solid fa-file-invoice"></i> Bill</button>
                                <button class="btn btn-glass btn-track" data-id="\${build.id}" data-status="\${build.status}" data-step="\${build.statusStep || 1}" data-eta="\${build.expectedDate || ''}" style="padding: 6px 12px; font-size: 11px;">
                                    <span>Track</span> <i class="fa-solid fa-location-dot"></i>
                                </button>
                            </td>
                        \`;
                        customRows.appendChild(tr);
                    });
                }

                // Standard
                const standardRows = document.getElementById("standard-orders-rows");
                if (standardOrders.length === 0) standardsBlock.style.display = "none";
                else {
                    standardOrders.forEach(order => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = \`
                            <td><strong>\${order.id}</strong></td>
                            <td>\${order.title}</td>
                            <td>\${order.category}</td>
                            <td>₹\${(order.total || 0).toLocaleString()}</td>
                            <td><span class="status-badge \${getStatusClass(order.status)}">\${order.status}</span></td>
                            <td>\${order.date || 'N/A'}</td>
                            <td>
                                <button class="btn btn-primary btn-invoice" data-id="\${order.id}" data-type="standard" style="padding: 6px 12px; font-size: 13px; margin-right: 8px;"><i class="fa-solid fa-file-invoice"></i> Bill</button>
                                <button class="btn btn-glass btn-track" data-id="\${order.id}" data-status="\${order.status}" data-step="\${order.statusStep || 1}" data-eta="\${order.expectedDate || ''}" style="padding: 6px 12px; font-size: 11px;">
                                    <span>Track</span> <i class="fa-solid fa-location-dot"></i>
                                </button>
                            </td>
                        \`;
                        standardRows.appendChild(tr);
                    });
                }
`;

const regex = /\/\/ Repairs[\s\S]*?\/\/ Tracking Modal Logic/;
if (regex.test(c)) {
    c = c.replace(regex, correctLogic + '\n\n            // Tracking Modal Logic');
    fs.writeFileSync('orders.html', c);
    console.log('Fixed broken template literals in orders.html');
} else {
    console.log('Regex did not match.');
}
