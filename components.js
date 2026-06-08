class AuraHeader extends HTMLElement {
    connectedCallback() {
        const activePage = this.getAttribute('active') || '';
        const isUserLoggedIn = localStorage.getItem("aura-user-logged-in") === "true";
        const isAdminLoggedIn = localStorage.getItem("aura-admin-logged-in") === "true";
        const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
        const userName = localStorage.getItem("aura-user-name") || "Administrator";
        const userEmail = localStorage.getItem("aura-user-email") || "Secure Session";

        const userProfileStr = localStorage.getItem("aura-user-profile");
        let userProfile = null;
        try {
            if (userProfileStr && userProfileStr !== "undefined") {
                userProfile = JSON.parse(userProfileStr);
            }
        } catch(e) { console.error("Error parsing profile", e); }
        const userAvatar = userProfile && userProfile.profilePicture ? userProfile.profilePicture : null;

        this.innerHTML = `
        <header class="header">
            <div class="header-left-group" style="display: flex; align-items: center; gap: 16px;">
                <button id="left-settings-trigger" class="theme-btn" title="Settings & Navigation" style="margin-right: 4px;">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <div class="logo" onclick="window.location.href='index.html'" style="cursor:pointer;">
                    <i class="fa-solid fa-bolt logo-icon"></i>
                    <span>ROBOART</span>
                </div>
            </div>
            <nav class="nav">
                <a href="index.html" class="nav-link ${activePage === 'systems' ? 'active' : ''}">Home</a>
                <a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}">About Us</a>
                <a href="b2c-store.html" class="nav-link ${activePage === 'b2c' ? 'active' : ''}">Products</a>
                <a href="calculator.html" class="nav-link ${activePage === 'calculator' ? 'active' : ''}">KVA Calculator</a>
                <a href="customize.html" class="nav-link ${activePage === 'customize' ? 'active' : ''}">Custom Solutions</a>
                <a href="repair.html" class="nav-link ${activePage === 'repair' ? 'active' : ''}">Repair</a>
                <a href="orders.html" class="nav-link ${activePage === 'orders' ? 'active' : ''}">My Orders</a>
            </nav>
            <div class="header-actions">
                <button id="theme-toggle" class="theme-btn" title="Toggle Light/Dark Theme">
                    <i class="fa-solid fa-moon"></i>
                </button>
                
                ${isLoggedIn ? `
                <div class="profile-dropdown-container" id="notif-dropdown-container">
                    <button id="notif-dropdown-trigger" class="theme-btn user-btn" title="Notifications" style="position: relative;">
                        <i class="fa-solid fa-bell"></i>
                        <span id="notif-badge" style="display:none; position:absolute; top:2px; right:2px; width:8px; height:8px; background:#fb641b; border-radius:50%;"></span>
                    </button>
                    <div class="profile-dropdown" id="notif-dropdown-menu" style="width: 320px; right: -40px;">
                        <div class="dropdown-header" style="flex-direction: row; justify-content: space-between; align-items: center;">
                            <span class="user-name">Notifications</span>
                            <button id="mark-read-btn" style="background:none; border:none; color:var(--primary); font-size:11px; cursor:pointer; font-weight:700;">Mark all read</button>
                        </div>
                        <div class="dropdown-body" id="notif-list" style="max-height: 300px; overflow-y: auto; padding: 0;">
                            <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;">No new notifications</div>
                        </div>
                    </div>
                </div>

                <div class="profile-dropdown-container">
                    <button id="profile-dropdown-trigger" class="theme-btn user-btn logged-in-state" title="My Profile" style="padding: 0; overflow: hidden; border-radius: 50%; border: 2px solid var(--primary);">
                        ${userAvatar ? `<img src="${userAvatar}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fa-solid fa-user-check" style="color: #10b981;"></i>`}
                    </button>
                    <div class="profile-dropdown" id="profile-dropdown-menu">
                        <div class="dropdown-header" style="display: flex; gap: 12px; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--card-border); margin-bottom: 8px;">
                            ${userAvatar ? `<img src="${userAvatar}" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border: 2px solid var(--primary);">` : `<div style="width:44px; height:44px; border-radius:50%; background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:bold;">${userName.charAt(0).toUpperCase()}</div>`}
                            <div style="display: flex; flex-direction: column;">
                                <span class="user-name" style="font-size: 15px; font-weight: 700;">${userName}</span>
                                <span class="user-email" style="font-size: 12px; opacity: 0.8;">${userEmail}</span>
                            </div>
                        </div>
                        <div class="dropdown-body">
                            ${isAdminLoggedIn ? `<a href="admin.html"><i class="fa-solid fa-user-shield"></i> Admin Panel</a>` : ''}
                            <a href="orders.html"><i class="fa-solid fa-box"></i> My Dashboard</a>
                            <button id="global-logout-btn" class="logout-action-btn"><i class="fa-solid fa-power-off"></i> Sign Out</button>
                        </div>
                    </div>
                </div>
                ` : `
                <button id="user-login-btn" class="theme-btn user-btn" title="Customer Portal Login">
                    <i class="fa-solid fa-user"></i>
                </button>
                `}

                <a href="contact.html" class="btn btn-primary btn-quote">
                    <span>Get B2B Pricing</span>
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
            </div>
        </header>
        `;

        // Attach event listeners for dynamic header elements after rendering
        setTimeout(() => {
            if (isLoggedIn) {
                const trigger = document.getElementById("profile-dropdown-trigger");
                const menu = document.getElementById("profile-dropdown-menu");
                const logoutBtn = document.getElementById("global-logout-btn");

                if (trigger && menu) {
                    trigger.addEventListener("click", (e) => {
                        e.stopPropagation();
                        menu.classList.toggle("show");
                    });
                    document.addEventListener("click", (e) => {
                        if (!menu.contains(e.target) && !trigger.contains(e.target)) {
                            menu.classList.remove("show");
                        }
                    });
                }

                if (logoutBtn) {
                    logoutBtn.addEventListener("click", () => {
                        if (confirm("Are you sure you want to sign out?")) {
                            if (typeof FirebaseService !== "undefined") {
                                FirebaseService.logout();
                            } else {
                                localStorage.removeItem("aura-user-logged-in");
                                localStorage.removeItem("aura-user-email");
                                localStorage.removeItem("aura-user-name");
                                localStorage.removeItem("aura-admin-logged-in");
                            }
                            window.location.href = "customer-login.html";
                        }
                    });
                }

                // Notification Logic
                const notifTrigger = document.getElementById("notif-dropdown-trigger");
                const notifMenu = document.getElementById("notif-dropdown-menu");
                const notifBadge = document.getElementById("notif-badge");
                const notifList = document.getElementById("notif-list");
                const markReadBtn = document.getElementById("mark-read-btn");

                if (notifTrigger && notifMenu) {
                    notifTrigger.addEventListener("click", (e) => {
                        e.stopPropagation();
                        notifMenu.classList.toggle("show");
                        if (profileMenu) profileMenu.classList.remove("show");
                    });

                    // Load Notifications
                    if (typeof FirebaseService !== "undefined") {
                        FirebaseService.getNotifications().then(notifs => {
                            const unreadCount = notifs.filter(n => !n.read).length;
                            if (unreadCount > 0) {
                                notifBadge.style.display = "block";
                            }
                            if (notifs.length > 0) {
                                notifList.innerHTML = notifs.map(n => `
                                    <div style="padding: 12px 16px; border-bottom: 1px solid var(--card-border); background: ${n.read ? 'transparent' : 'rgba(var(--primary-rgb), 0.05)'}">
                                        <div style="font-size: 13px; font-weight: 700; color: var(--text-color);">${n.title}</div>
                                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${n.message}</div>
                                        <div style="font-size: 10px; color: var(--primary); margin-top: 6px;">${new Date(n.timestamp).toLocaleString()}</div>
                                    </div>
                                `).join('');
                            }
                        });
                    }

                    if (markReadBtn) {
                        markReadBtn.addEventListener("click", async () => {
                            if (typeof FirebaseService !== "undefined") {
                                await FirebaseService.markNotificationsRead();
                                notifBadge.style.display = "none";
                                const unreadItems = notifList.querySelectorAll('div[style*="rgba(var(--primary-rgb), 0.05)"]');
                                unreadItems.forEach(item => item.style.background = 'transparent');
                            }
                        });
                    }
                }

            } else {
                const loginBtn = document.getElementById("user-login-btn");
                if (loginBtn) {
                    loginBtn.addEventListener("click", () => {
                        window.location.href = "customer-login.html";
                    });
                }
            }
        }, 100);
    }
}

class AuraFooter extends HTMLElement {
    connectedCallback() {
        const year = new Date().getFullYear();
        this.innerHTML = `
        <footer class="footer" style="z-index: 10; margin-top: auto; background: transparent; border-top: 1px solid rgba(255, 255, 255, 0.03); padding: 40px 0;">
            <div class="container footer-container" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 20px;">
                <div class="footer-brand" style="max-width: 300px;">
                    <div class="footer-logo" style="margin-bottom: 12px; font-size: 24px; font-weight: 800; color: var(--primary);">
                        <i class="fa-solid fa-bolt"></i> ROBOART
                    </div>
                    <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">
                        <strong>Transformer Range</strong><br>
                        Reliable Power. Stronger Performance.<br>
                        Powering Automation. Empowering Industries.
                    </p>
                </div>
                <div class="footer-contact" style="font-size: 13px; color: var(--text-muted); line-height: 1.6; max-width: 300px;">
                    <h4 style="color: var(--text-color); margin-bottom: 12px;">Contact Information</h4>
                    <p><i class="fa-solid fa-location-dot" style="width: 20px;"></i> D-54, Gurukul Industrial Area,<br>Plot No. 4, Anangpur,<br>Faridabad, Haryana 121003</p>
                    <p><i class="fa-solid fa-phone" style="width: 20px;"></i> +91 7827 562528 | 6394635914</p>
                    <p><i class="fa-solid fa-envelope" style="width: 20px;"></i> info.roboart@gmail.com</p>
                    <p><i class="fa-solid fa-globe" style="width: 20px;"></i> www.roboartgrp.com</p>
                </div>
            </div>
            <div class="container" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
                <p class="footer-copy">© <span id="year">${year}</span> Roboart Transformers. Engineered for Excellence.</p>
            </div>
        </footer>
        `;
    }
}

class AuraSidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="settings-sidebar" class="sidebar-panel" style="z-index: 100;">
            <div class="sidebar-header">
                <h3><i class="fa-solid fa-gears"></i> Settings Panel</h3>
                <button id="sidebar-close-btn" class="close-btn">&times;</button>
            </div>
            <div class="sidebar-body">
                <div class="settings-group">
                    <label><i class="fa-solid fa-circle-half-stroke"></i> Select Theme</label>
                    <div class="theme-select-grid">
                        <button id="theme-normal-select" class="theme-select-btn active">Light Mode</button>
                        <button id="theme-neon-select" class="theme-select-btn">Dark Mode</button>
                    </div>
                </div>
                <div class="settings-group">
                    <label><i class="fa-solid fa-link"></i> Quick Navigation</label>
                    <ul class="settings-nav-links">
                        <li><a href="index.html"><i class="fa-solid fa-house"></i> Home</a></li>
                        <li><a href="about.html"><i class="fa-solid fa-building"></i> About Us</a></li>
                        <li><a href="b2c-store.html"><i class="fa-solid fa-bolt"></i> Transformer Products</a></li>
                        <li><a href="calculator.html"><i class="fa-solid fa-calculator"></i> Capacity Sizer</a></li>
                        <li><a href="customize.html"><i class="fa-solid fa-sliders"></i> Custom Solutions</a></li>
                        <li><a href="repair.html"><i class="fa-solid fa-wrench"></i> Repair Service</a></li>
                        <li><a href="contact.html"><i class="fa-solid fa-address-book"></i> Contact Us</a></li>
                        <li><a href="orders.html"><i class="fa-solid fa-cart-flatbed"></i> My Orders Registry</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="sidebar-overlay" class="sidebar-overlay" style="z-index: 90;"></div>
        `;
    }
}

class AuraChat extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="chat-widget-container">
            <div class="floating-triggers">
                <a href="https://wa.me/916394635914" target="_blank" class="float-btn whatsapp-float" title="Direct WhatsApp Sales">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
                <button id="ai-chat-toggle" class="float-btn ai-chat-float" title="Roboart AI Assistant">
                    <i class="fa-solid fa-comment-dots"></i>
                    <span class="ping-badge"></span>
                </button>
            </div>

            <div class="chat-window" id="chat-window">
                <div class="chat-header">
                    <div class="chat-avatar"><i class="fa-solid fa-robot"></i></div>
                    <div class="chat-header-info">
                        <h4>Roboart AI System</h4>
                        <p><span class="status-indicator"></span> Active Support</p>
                    </div>
                    <button id="chat-close-btn" class="chat-close"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="chat-body" id="chat-body"></div>
                <form id="chat-form" class="chat-footer">
                    <input type="text" id="chat-input" placeholder="Ask about sizing, batteries..." required>
                    <button type="submit" class="chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
        `;
    }
}

customElements.define('aura-header', AuraHeader);
customElements.define('aura-footer', AuraFooter);
customElements.define('aura-sidebar', AuraSidebar);
customElements.define('aura-chat', AuraChat);
