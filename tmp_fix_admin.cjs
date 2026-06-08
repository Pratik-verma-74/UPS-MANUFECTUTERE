const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// 1. Update Table Headers
const headerSearch = `                                <tr>
                                    <th>Order ID</th>
                                    <th>Model Purchased</th>
                                    <th>Capacity</th>
                                    <th>Price</th>
                                    <th>Tracking State</th>
                                    <th>Action</th>
                                </tr>`;

const headerReplace = `                                <tr>
                                    <th>Order ID</th>
                                    <th>Client / Model Purchased</th>
                                    <th>Capacity</th>
                                    <th>Price</th>
                                    <th>Tracking & Delivery Manager</th>
                                    <th>Action</th>
                                </tr>`;

html = html.replace(headerSearch, headerReplace);

// 2. Update renderAdminOrders loop body
const loopSearch = `                stdOrders.forEach((order, index) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = \`
                        <td><strong style="color: var(--primary);">\${escapeHTML(order.id)}</strong></td>
                        <td>\${escapeHTML(order.title)}</td>
                        <td>\${escapeHTML(order.capacity)}</td>
                        <td>₹\${Number(order.price).toLocaleString()}</td>
                        <td>
                            <select class="mult-input select-order-status" data-index="\${index}" data-id="\${escapeHTML(order.id)}" style="margin-top:0; padding:4px 8px; width:auto; border-radius:4px;">
                                <option value="Pending Audit" \${order.status === 'Pending Audit' ? 'selected' : ''}>Pending Audit</option>
                                <option value="Components Inbound" \${order.status === 'Components Inbound' ? 'selected' : ''}>Inbound Sourcing</option>
                                <option value="Factory Assembling" \${order.status === 'Factory Assembling' ? 'selected' : ''}>Assembling</option>
                                <option value="Quality Auditing" \${order.status === 'Quality Auditing' ? 'selected' : ''}>Quality Check</option>
                                <option value="Dispatched & Shipped" \${order.status === 'Dispatched & Shipped' ? 'selected' : ''}>Dispatched</option>
                            </select>
                            <input type="number" min="1" max="5" class="mult-input select-order-step" data-index="\${index}" value="\${order.statusStep || 1}" style="width: 50px; margin-left: 8px; padding:4px; display:inline-block;" title="Progress Step (1-5)">
                            <input type="text" class="mult-input select-order-date" data-index="\${index}" value="\${order.expectedDate || ''}" placeholder="ETA Date" style="width: 90px; margin-left: 8px; padding:4px; display:inline-block;">
                        </td>
                        <td>
                            <button class="admin-action-btn btn-delete-order" data-index="\${index}" style="border-color:#ef4444; color:#ef4444;"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    \`;
                    ordersList.appendChild(tr);
                });

                // Listeners for order updates
                ordersList.querySelectorAll(".select-order-status, .select-order-step, .select-order-date").forEach(input => {
                    input.addEventListener("change", async (e) => {
                        const index = parseInt(input.getAttribute("data-index"));
                        const docId = ordersList.querySelector(\`.select-order-status[data-index="\${index}"]\`).getAttribute("data-id");
                        const newStatus = ordersList.querySelector(\`.select-order-status[data-index="\${index}"]\`).value;
                        const newStep = parseInt(ordersList.querySelector(\`.select-order-step[data-index="\${index}"]\`).value) || 1;
                        const newDate = ordersList.querySelector(\`.select-order-date[data-index="\${index}"]\`).value;

                        awOrders[index].status = newStatus;
                        awOrders[index].statusStep = newStep;
                        awOrders[index].expectedDate = newDate;
                        localStorage.setItem("aura-user-orders", JSON.stringify(awOrders));
                        if (typeof FirebaseService !== "undefined") {
                            await FirebaseService.adminUpdateStatus("orders", docId, newStatus, newStep, newDate);
                        }
                        renderAdminOrders();
                        renderFactoryBoard();
                    });
                });`;

const loopReplace = `                stdOrders.forEach((order, index) => {
                    const clientIdentity = order.userEmail || order.userName || "Storefront Customer";
                    const tr = document.createElement("tr");
                    tr.innerHTML = \`
                        <td><strong style="color: var(--primary);">\${escapeHTML(order.id)}</strong></td>
                        <td>
                            <strong style="font-size: 11px; color: #0ea5e9; display: block; margin-bottom: 4px;">
                                <i class="fa-solid fa-user" style="margin-right: 4px;"></i>\${escapeHTML(clientIdentity)}
                            </strong>
                            \${escapeHTML(order.title)}
                        </td>
                        <td>\${escapeHTML(order.capacity)}</td>
                        <td>₹\${Number(order.price).toLocaleString()}</td>
                        <td>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <select class="mult-input select-order-status" data-index="\${index}" data-id="\${escapeHTML(order.id)}" style="margin:0; padding:6px; flex:1; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; font-weight:bold;">
                                        <option value="Pending Audit" \${order.status === 'Pending Audit' ? 'selected' : ''}>Pending Audit</option>
                                        <option value="Components Inbound" \${order.status === 'Components Inbound' ? 'selected' : ''}>Inbound Sourcing</option>
                                        <option value="Factory Assembling" \${order.status === 'Factory Assembling' ? 'selected' : ''}>Assembling</option>
                                        <option value="Quality Auditing" \${order.status === 'Quality Auditing' ? 'selected' : ''}>Quality Check</option>
                                        <option value="Dispatched & Shipped" \${order.status === 'Dispatched & Shipped' ? 'selected' : ''}>Dispatched & Shipped</option>
                                        <option value="Delivered" \${order.status === 'Delivered' ? 'selected' : ''}>Delivered ✅</option>
                                    </select>
                                    <input type="number" min="1" max="6" class="mult-input select-order-step" data-index="\${index}" value="\${order.statusStep || 1}" style="width:45px; margin:0; padding:6px; border:1px solid #cbd5e1; border-radius:4px; text-align:center; font-size:11px;" title="Pipeline Step (1-6)">
                                </div>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="date" class="mult-input select-order-date" data-index="\${index}" value="\${order.expectedDate || ''}" title="Delivery ETA Date" style="margin:0; padding:5px; flex:1; border:1px solid #cbd5e1; border-radius:4px; font-size:11px; cursor:pointer;">
                                    <button class="btn btn-primary update-tracking-btn" data-index="\${index}" style="padding:5px 10px; font-size:10px; border-radius:4px; background:var(--primary); color:white; border:none; cursor:pointer;" title="Save Tracking Details">
                                        <i class="fa-solid fa-cloud-arrow-up"></i> Save
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td style="vertical-align: middle;">
                            <button class="admin-action-btn btn-delete-order" data-index="\${index}" style="border-color:#ef4444; color:#ef4444;"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    \`;
                    ordersList.appendChild(tr);
                });

                // Listeners for explicit order updates (Save Button)
                ordersList.querySelectorAll(".update-tracking-btn").forEach(btn => {
                    btn.addEventListener("click", async (e) => {
                        const index = parseInt(btn.getAttribute("data-index"));
                        const docId = ordersList.querySelector(\`.select-order-status[data-index="\${index}"]\`).getAttribute("data-id");
                        const newStatus = ordersList.querySelector(\`.select-order-status[data-index="\${index}"]\`).value;
                        const newStep = parseInt(ordersList.querySelector(\`.select-order-step[data-index="\${index}"]\`).value) || 1;
                        const newDate = ordersList.querySelector(\`.select-order-date[data-index="\${index}"]\`).value;

                        // Visual feedback to button
                        const originalHtml = btn.innerHTML;
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                        btn.disabled = true;

                        awOrders[index].status = newStatus;
                        awOrders[index].statusStep = newStep;
                        awOrders[index].expectedDate = newDate;
                        localStorage.setItem("aura-user-orders", JSON.stringify(awOrders));
                        
                        if (typeof FirebaseService !== "undefined") {
                            await FirebaseService.adminUpdateStatus("orders", docId, newStatus, newStep, newDate);
                        }
                        
                        // Show quick alert
                        setTimeout(() => {
                            btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
                            btn.style.background = '#10b981';
                            setTimeout(() => {
                                renderAdminOrders();
                                renderFactoryBoard();
                            }, 800);
                        }, 500);
                    });
                });`;

html = html.replace(loopSearch, loopReplace);

fs.writeFileSync('admin.html', html, 'utf8');
console.log('Fixed admin orders tracker');
