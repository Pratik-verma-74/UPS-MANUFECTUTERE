
        document.addEventListener("DOMContentLoaded", async () => {

            function escapeHTML(str) {
                if (str === null || str === undefined) return '';
                return String(str).replace(/[&<>'"]/g, tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag] || tag));
            }

            const getStatusClass = (statusStr) => {
                const s = statusStr.toLowerCase();
                if (s.includes("pending") || s.includes("review") || s.includes("dispatch")) return "status-pending";
                if (s.includes("complete") || s.includes("delivered") || s.includes("resolved")) return "status-completed";
                return "status-active";
            };

            let standardOrders = [], customBuilds = [], repairTickets = [];
            let userProfile = null;

            if (typeof FirebaseService !== "undefined") {
                try {
                    const [oData, cData, rData, pData] = await Promise.all([
                        FirebaseService.getOrders(),
                        FirebaseService.getCustomizations(),
                        FirebaseService.getRepairs(),
                        FirebaseService.getUserProfile()
                    ]);
                    standardOrders = oData;
                    customBuilds = cData;
                    repairTickets = rData;
                    userProfile = pData;
                } catch (e) {
                    console.warn(e);
                }
            }

            const emptyState = document.getElementById("orders-empty-state");
            const shelfContainer = document.getElementById("orders-shelf-container");
            const customsBlock = document.getElementById("customs-block");
            const standardsBlock = document.getElementById("standards-block");
            const repairsBlock = document.getElementById("repairs-block");
            
            if (standardOrders.length === 0 && customBuilds.length === 0 && repairTickets.length === 0) {
                emptyState.style.display = "block";
                shelfContainer.style.display = "none";
                document.getElementById("dashboard-stats-grid").style.display = "none";
            } else {
                emptyState.style.display = "none";
                shelfContainer.style.display = "flex";
                document.getElementById("dashboard-stats-grid").style.display = "grid";

                document.getElementById("stat-standard").innerText = standardOrders.length;
                document.getElementById("stat-custom").innerText = customBuilds.length;
                document.getElementById("stat-repair").innerText = repairTickets.length;

                // Set Profile Display
                const profDisplay = document.getElementById("profile-address-display");
                if (userProfile && userProfile.address) {
                    profDisplay.textContent = `${userProfile.address}, ${userProfile.city} - ${userProfile.pin} (Ph: ${userProfile.phone})`;
                } else {
                    profDisplay.textContent = "No delivery profile saved. Update now for faster checkout.";
                }

                
                // Repairs
                const repairRows = document.getElementById("repair-tickets-rows");
                if (repairTickets.length === 0) repairsBlock.style.display = "none";
                else {
                    repairTickets.forEach(t => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td><strong>${t.id}</strong></td>
                            <td>${t.brand} (${t.model})</td>
                            <td>${t.capacity}</td>
                            <td title="${t.issue}" style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${t.issue}</td>
                            <td><span class="status-badge ${getStatusClass(t.status)}">${t.status}</span></td>
                            <td>${t.date || 'N/A'}</td>
                            <td>
                                <button class="btn btn-primary btn-invoice" data-id="${t.id}" data-type="repair" style="padding: 6px 12px; font-size: 13px; margin-right: 8px;"><i class="fa-solid fa-file-invoice"></i> Bill</button>
                                <button class="btn btn-glass btn-track" data-id="${t.id}" data-status="${t.status}" data-step="${t.statusStep || 1}" data-eta="${t.expectedDate || ''}" style="padding: 6px 12px; font-size: 11px;">
                                    <span>Track</span> <i class="fa-solid fa-location-dot"></i>
                                </button>
                            </td>
                        `;
                        repairRows.appendChild(tr);
                    });
                }

                // Custom
                const customRows = document.getElementById("custom-orders-rows");
                if (customBuilds.length === 0) customsBlock.style.display = "none";
                else {
                    customBuilds.forEach(build => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td><strong>${build.id}</strong></td>
                            <td>${build.blueprintType}</td>
                            <td>${build.capacity}</td>
                            <td>${build.redundancy}</td>
                            <td><span class="status-badge ${getStatusClass(build.status)}">${build.status}</span></td>
                            <td>${build.date || 'N/A'}</td>
                            <td>
                                <button class="btn btn-primary btn-invoice" data-id="${build.id}" data-type="custom" style="padding: 6px 12px; font-size: 13px; margin-right: 8px;"><i class="fa-solid fa-file-invoice"></i> Bill</button>
                                <button class="btn btn-glass btn-track" data-id="${build.id}" data-status="${build.status}" data-step="${build.statusStep || 1}" data-eta="${build.expectedDate || ''}" style="padding: 6px 12px; font-size: 11px;">
                                    <span>Track</span> <i class="fa-solid fa-location-dot"></i>
                                </button>
                            </td>
                        `;
                        customRows.appendChild(tr);
                    });
                }

                // Standard
                const standardRows = document.getElementById("standard-orders-rows");
                if (standardOrders.length === 0) standardsBlock.style.display = "none";
                else {
                    standardOrders.forEach(order => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td><strong>${order.id}</strong></td>
                            <td>${order.title}</td>
                            <td>${order.category}</td>
                            <td>₹${(order.total || 0).toLocaleString()}</td>
                            <td><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></td>
                            <td>${order.date || 'N/A'}</td>
                            <td>
                                <button class="btn btn-primary btn-invoice" data-id="${order.id}" data-type="standard" style="padding: 6px 12px; font-size: 13px; margin-right: 8px;"><i class="fa-solid fa-file-invoice"></i> Bill</button>
                                <button class="btn btn-glass btn-track" data-id="${order.id}" data-status="${order.status}" data-step="${order.statusStep || 1}" data-eta="${order.expectedDate || ''}" style="padding: 6px 12px; font-size: 11px;">
                                    <span>Track</span> <i class="fa-solid fa-location-dot"></i>
                                </button>
                            </td>
                        `;
                        standardRows.appendChild(tr);
                    });
                }


            }
            // Tracking Modal Logic
            const trackModal = document.getElementById("tracking-modal");
            const closeTrackModal = document.getElementById("close-tracking-modal");
            const trackModalId = document.getElementById("track-modal-id");
            const trackModalStatus = document.getElementById("track-modal-status");
            const trackProgressLine = document.getElementById("track-progress-line");
            const trackContactSupport = document.getElementById("track-contact-support");
            const trackModalEtaContainer = document.getElementById("track-modal-eta-container");
            const trackModalEta = document.getElementById("track-modal-eta");

            function openTracker(id, status, stepStr, etaStr) {
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
                    const iconWrap = document.querySelector(`#t-step-${i} .t-icon`);
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
                    const message = `Hello Support!\n\nI want to track my order:\n*Reference ID:* ${id}\n*Current Status:* ${status}\n\nPlease provide an update.`;
                    window.open(`https://wa.me/917463053829?text=${encodeURIComponent(message)}`, "_blank");
                };

                trackModal.style.display = "flex";
            }

            if (closeTrackModal) {
                closeTrackModal.addEventListener("click", () => trackModal.style.display = "none");
            }

            document.querySelectorAll(".btn-track").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.getAttribute("data-id");
                    const status = btn.getAttribute("data-status");
                    const step = btn.getAttribute("data-step");
                    const eta = btn.getAttribute("data-eta");
                    openTracker(id, status, step, eta);
                });
            });

            // Profile Modal Logic
            const profileModal = document.getElementById("profile-modal");
            const btnEditProfile = document.getElementById("btn-edit-profile");
            const closeProfileModal = document.getElementById("close-profile-modal");
            const profileForm = document.getElementById("profile-form");

            if (btnEditProfile) {
                btnEditProfile.addEventListener("click", () => {
                    if (userProfile) {
                        document.getElementById("prof-name").value = userProfile.name || "";
                        document.getElementById("prof-phone").value = userProfile.phone || "";
                        document.getElementById("prof-address").value = userProfile.address || "";
                        document.getElementById("prof-city").value = userProfile.city || "";
                        document.getElementById("prof-pin").value = userProfile.pin || "";
                    }
                    profileModal.style.display = "flex";
                });
            }

            if (closeProfileModal) {
                closeProfileModal.addEventListener("click", () => profileModal.style.display = "none");
            }

            if (profileForm) {
                profileForm.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const saveBtn = document.getElementById("prof-save-btn");
                    const origHtml = saveBtn.innerHTML;
                    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
                    saveBtn.disabled = true;

                    const pData = {
                        name: document.getElementById("prof-name").value,
                        phone: document.getElementById("prof-phone").value,
                        address: document.getElementById("prof-address").value,
                        city: document.getElementById("prof-city").value,
                        pin: document.getElementById("prof-pin").value
                    };

                    if (typeof FirebaseService !== "undefined") {
                        await FirebaseService.saveUserProfile(pData);
                        userProfile = pData;
                        document.getElementById("profile-address-display").textContent = `${pData.address}, ${pData.city} - ${pData.pin} (Ph: ${pData.phone})`;
                    }

                    saveBtn.innerHTML = origHtml;
                    saveBtn.disabled = false;
                    profileModal.style.display = "none";
                    alert("Delivery profile updated successfully!");
                });
            }
        });
    