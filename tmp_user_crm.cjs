const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// --- 1. ADD HTML ---
const htmlSearch = `                <!-- 1. UPS Repair & Servicing Tickets Controls -->`;
const htmlReplace = `                <!-- 0. User CRM -->
                <div class="admin-card-section" style="border-color: rgba(14, 165, 233, 0.2);">
                    <div class="card-section-header">
                        <h3 style="color: #0ea5e9;"><i class="fa-solid fa-users-gear" style="margin-right: 6px;"></i>User Details & CRM</h3>
                        <p>Manage registered user profiles, contact information, and view their lifetime purchase history.</p>
                    </div>

                    <div class="inventory-table-container">
                        <table class="inventory-table" id="admin-users-table">
                            <thead>
                                <tr>
                                    <th>User Profile</th>
                                    <th>Contact Details</th>
                                    <th>Address / Shipping</th>
                                    <th>Purchase History</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="admin-users-list">
                                <tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading users...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 1. UPS Repair & Servicing Tickets Controls -->`;

html = html.replace(htmlSearch, htmlReplace);

// Add modal for editing at the end of body
const modalSearch = `    <script src="script.js?v=2"></script>`;
const modalReplace = `    <!-- Edit User Modal -->
    <div id="edit-user-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
        <div style="background:var(--card-bg); padding:24px; border-radius:8px; width:90%; max-width:400px; border:1px solid var(--card-border);">
            <h3 style="margin-bottom:16px;">Edit User Profile</h3>
            <input type="hidden" id="edit-user-email">
            <div class="form-group" style="margin-bottom:12px;">
                <label>Full Name</label>
                <input type="text" id="edit-user-name" class="mult-input" style="width:100%; padding:8px; border-radius:4px; border:1px solid var(--card-border);">
            </div>
            <div class="form-group" style="margin-bottom:12px;">
                <label>Phone Number</label>
                <input type="text" id="edit-user-phone" class="mult-input" style="width:100%; padding:8px; border-radius:4px; border:1px solid var(--card-border);">
            </div>
            <div class="form-group" style="margin-bottom:16px;">
                <label>Address</label>
                <textarea id="edit-user-address" class="mult-input" rows="3" style="width:100%; padding:8px; border-radius:4px; border:1px solid var(--card-border); resize:none;"></textarea>
            </div>
            <div style="display:flex; gap:12px; justify-content:flex-end;">
                <button onclick="document.getElementById('edit-user-modal').style.display='none'" class="btn" style="background:#e2e8f0; color:#334155; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">Cancel</button>
                <button id="save-user-btn" class="btn btn-primary" style="padding:8px 16px; border-radius:4px; border:none; cursor:pointer;">Save Changes</button>
            </div>
        </div>
    </div>

    <script src="script.js?v=2"></script>`;

html = html.replace(modalSearch, modalReplace);

// --- 2. ADD JS DATA VARIABLES ---
const varSearch = `let awOrders = [], awCustoms = [], awRepairs = [];`;
const varReplace = `let awOrders = [], awCustoms = [], awRepairs = [], awUsers = [];`;
html = html.replace(varSearch, varReplace);

// --- 3. ADD JS DATA FETCHING ---
const fetchSearch = `[awOrders, awCustoms, awRepairs] = await Promise.all([
                            FirebaseService.adminGetAllOrders(),
                            FirebaseService.adminGetAllCustomizations(),
                            FirebaseService.adminGetAllRepairs()
                        ]);`;
const fetchReplace = `[awOrders, awCustoms, awRepairs, awUsers] = await Promise.all([
                            FirebaseService.adminGetAllOrders(),
                            FirebaseService.adminGetAllCustomizations(),
                            FirebaseService.adminGetAllRepairs(),
                            FirebaseService.adminGetAllUsers()
                        ]);`;
html = html.replace(fetchSearch, fetchReplace);

const renderCallsSearch = `renderAdminRepairs();
                renderAdminOrders();`;
const renderCallsReplace = `renderAdminUsers();
                renderAdminRepairs();
                renderAdminOrders();`;
html = html.replace(renderCallsSearch, renderCallsReplace);

// --- 4. ADD JS RENDER FUNCTION ---
const jsSearch = `            function renderAdminOrders() {`;
const jsReplace = `            async function renderAdminUsers() {
                const usersList = document.getElementById("admin-users-list");
                if (!usersList) return;
                
                if (!awUsers || awUsers.length === 0) {
                    usersList.innerHTML = \`<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);">No users found in database.</td></tr>\`;
                    return;
                }

                usersList.innerHTML = "";

                awUsers.forEach((user, index) => {
                    // Match orders to this user
                    const userOrders = awOrders.filter(o => o.userEmail === user.email);
                    
                    let ordersHtml = '<ul style="margin:0; padding-left:16px; font-size:12px; color:var(--text-muted);">';
                    if(userOrders.length > 0) {
                        userOrders.forEach(o => {
                            ordersHtml += \`<li style="margin-bottom:4px;"><strong>\${escapeHTML(o.title)}</strong> <br><span style="font-size:10px;">Order ID: \${escapeHTML(o.id)} | Date: \${escapeHTML(o.createdAt || 'N/A')}</span></li>\`;
                        });
                    } else {
                        ordersHtml += '<li style="list-style:none; color:#94a3b8;">No purchases yet</li>';
                    }
                    ordersHtml += '</ul>';

                    const tr = document.createElement("tr");
                    tr.innerHTML = \`
                        <td>
                            <strong style="color: #0ea5e9; font-size:14px;"><i class="fa-solid fa-circle-user" style="margin-right:6px;"></i>\${escapeHTML(user.name || 'N/A')}</strong><br>
                            <span style="font-size:11px; color:var(--text-muted);">\${escapeHTML(user.email)}</span>
                        </td>
                        <td>
                            <div style="font-size:12px; display:flex; flex-direction:column; gap:4px;">
                                <span><i class="fa-solid fa-phone" style="width:16px; color:#64748b;"></i> \${escapeHTML(user.phone || 'Not provided')}</span>
                            </div>
                        </td>
                        <td>
                            <div style="font-size:12px; line-height:1.4; color:var(--text-color); max-width:200px;">
                                <i class="fa-solid fa-location-dot" style="color:#64748b; margin-right:4px;"></i> 
                                \${escapeHTML(user.address || 'Address not provided')}
                                \${user.city ? '<br>' + escapeHTML(user.city) + ', ' + escapeHTML(user.state || '') + ' - ' + escapeHTML(user.pincode || '') : ''}
                            </div>
                        </td>
                        <td>
                            \${ordersHtml}
                        </td>
                        <td style="vertical-align: middle;">
                            <div style="display:flex; gap:8px;">
                                <button class="admin-action-btn btn-edit-user" data-index="\${index}" style="border-color:#3b82f6; color:#3b82f6;" title="Edit User"><i class="fa-solid fa-pen-to-square"></i></button>
                                <button class="admin-action-btn btn-delete-user" data-index="\${index}" style="border-color:#ef4444; color:#ef4444;" title="Delete User Profile"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    \`;
                    usersList.appendChild(tr);
                });

                // Attach Event Listeners
                usersList.querySelectorAll(".btn-edit-user").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const index = btn.getAttribute("data-index");
                        const user = awUsers[index];
                        document.getElementById("edit-user-email").value = user.email;
                        document.getElementById("edit-user-name").value = user.name || '';
                        document.getElementById("edit-user-phone").value = user.phone || '';
                        document.getElementById("edit-user-address").value = user.address || '';
                        document.getElementById("edit-user-modal").style.display = "flex";
                    });
                });

                usersList.querySelectorAll(".btn-delete-user").forEach(btn => {
                    btn.addEventListener("click", async () => {
                        const index = btn.getAttribute("data-index");
                        const user = awUsers[index];
                        if(confirm(\`Are you sure you want to permanently delete the profile of \${user.email}? This will remove their CRM record.\`)) {
                            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                            btn.disabled = true;
                            const success = await FirebaseService.adminDeleteUserProfile(user.email);
                            if(success) {
                                awUsers.splice(index, 1);
                                renderAdminUsers();
                            } else {
                                alert("Failed to delete user from Firebase.");
                                btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
                                btn.disabled = false;
                            }
                        }
                    });
                });
            }

            // Handle Save User Modal
            document.getElementById("save-user-btn").addEventListener("click", async () => {
                const btn = document.getElementById("save-user-btn");
                const email = document.getElementById("edit-user-email").value;
                const updatedData = {
                    name: document.getElementById("edit-user-name").value,
                    phone: document.getElementById("edit-user-phone").value,
                    address: document.getElementById("edit-user-address").value,
                };

                btn.innerHTML = 'Saving...';
                btn.disabled = true;

                const success = await FirebaseService.adminUpdateUserProfile(email, updatedData);
                
                if(success) {
                    // Update local awUsers array
                    const userIndex = awUsers.findIndex(u => u.email === email);
                    if(userIndex > -1) {
                        awUsers[userIndex] = { ...awUsers[userIndex], ...updatedData };
                    }
                    renderAdminUsers();
                    document.getElementById("edit-user-modal").style.display = "none";
                } else {
                    alert("Failed to update user profile in Firebase.");
                }

                btn.innerHTML = 'Save Changes';
                btn.disabled = false;
            });

            function renderAdminOrders() {`;
html = html.replace(jsSearch, jsReplace);

fs.writeFileSync('admin.html', html, 'utf8');
console.log('CRM User table added to admin.html');
