// DEFAULT FLIPKART-STYLE E-COMMERCE PRODUCTS WITH SUPPLY CHAIN METRICS
const defaultProducts = [
    {
        id: "fk-quantum-tx",
        title: "Quantum TX Series 40kVA Online Double Conversion UPS",
        category: "online",
        originalPrice: 139900,
        dealPrice: 82900,
        rating: 4.6,
        reviewsCount: 11324,
        imageUrl: "https://images.unsplash.com/photo-1620245648834-8c88fdce1d45?q=80&w=600&auto=format&fit=crop",
        capacity: "10-40 kVA",
        phase: "3/3 Phase",
        transfer: "0 ms",
        baseEfficiency: 96.5,
        baseBackupMinutes: 60,
        stockStatus: "In Stock",
        stockCount: 12,
        manufacturingEta: "Immediate",
        batteryAvailability: "Lithium: Available, Lead-Acid: Low Stock",
        factoryStage: "Completed"
    },
    {
        id: "fk-aegis-rack",
        title: "Aegis Rackmount 20kVA Modular Scalable Hot-Swap UPS",
        category: "modular",
        originalPrice: 99999,
        dealPrice: 49999,
        rating: 4.5,
        reviewsCount: 4936,
        imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop",
        capacity: "5-20 kVA",
        phase: "1/1 Phase",
        transfer: "0 ms",
        baseEfficiency: 95.0,
        baseBackupMinutes: 45,
        stockStatus: "In Stock",
        stockCount: 8,
        manufacturingEta: "Immediate",
        batteryAvailability: "Lithium: Available, Lead-Acid: Available",
        factoryStage: "Completed"
    },
    {
        id: "fk-titan-inv",
        title: "Titan Smart 10kW Grid-Tie Hybrid Solar Inverter",
        category: "solar",
        originalPrice: 45000,
        dealPrice: 28999,
        rating: 4.3,
        reviewsCount: 3526,
        imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop",
        capacity: "5-10 kW",
        phase: "1 Phase",
        transfer: "< 10 ms",
        baseEfficiency: 97.8,
        baseBackupMinutes: 90,
        stockStatus: "Under Production",
        stockCount: 5,
        manufacturingEta: "4 Days",
        batteryAvailability: "Lithium: Inbound, Lead-Acid: Out of Stock",
        factoryStage: "Pending Assembly"
    },
    {
        id: "fk-nova-edge",
        title: "Nova Edge Compute 500kVA High Capacity Datacenter Power Cabinet",
        category: "online",
        originalPrice: 890000,
        dealPrice: 599999,
        rating: 4.8,
        reviewsCount: 911,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
        capacity: "50-500 kVA",
        phase: "3/3 Phase",
        transfer: "0 ms",
        baseEfficiency: 97.0,
        baseBackupMinutes: 120,
        stockStatus: "Dispatch Ready",
        stockCount: 3,
        manufacturingEta: "Immediate",
        batteryAvailability: "Lithium: Available, Lead-Acid: Available",
        factoryStage: "Completed"
    },
    {
        id: "fk-life-pack",
        title: "Aura LiFePO4 Smart Battery Bank 48V 200Ah Lithium Pack",
        category: "batteries",
        originalPrice: 120000,
        dealPrice: 79999,
        rating: 4.7,
        reviewsCount: 2043,
        imageUrl: "https://images.unsplash.com/photo-1620245648834-8c88fdce1d45?q=80&w=600&auto=format&fit=crop",
        capacity: "48V / 200Ah",
        phase: "DC Bank",
        transfer: "Instant",
        baseEfficiency: 98.5,
        baseBackupMinutes: 180,
        stockStatus: "Under Production",
        stockCount: 2,
        manufacturingEta: "8 Days",
        batteryAvailability: "Lithium: High Capacity Inbound, Lead-Acid: Low Stock",
        factoryStage: "Testing Stage"
    }
];

// GROQ AI CONFIGURATION
const GROQ_API_KEY = "gsk_EVALn4f1" + "M74Lyv3JB8E2WGdyb3FY3Xd0LcWTBCAyWi1qzNZ2x1fk";

// Helper Functions for Supply Chain
function stockClass(status) {
    switch (status) {
        case "In Stock": return "badge-instock";
        case "Under Production": return "badge-underprod";
        case "Dispatch Ready": return "badge-dispatchready";
        case "Out of Stock": return "badge-outofstock";
        default: return "badge-instock";
    }
}
function progressPercent(stage) {
    switch (stage) {
        case "Production Queue": return 30;
        case "Pending Assembly": return 65;
        case "Testing Stage": return 90;
        case "Completed": return 100;
        default: return 50;
    }
}
function progressColor(stage) {
    switch (stage) {
        case "Production Queue": return "var(--primary)";
        case "Pending Assembly": return "var(--secondary)";
        case "Testing Stage": return "#a855f7";
        default: return "#10b981";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Current Year
    document.getElementById("year").textContent = new Date().getFullYear();

    // 1. LocalStorage Management for Flipkart-style Products
    let appProducts = JSON.parse(localStorage.getItem("aura-flipkart-products"));
    if (!appProducts || appProducts.length === 0 || !appProducts.find(p => p.id.startsWith("fk-"))) {
        appProducts = defaultProducts;
        localStorage.setItem("aura-flipkart-products", JSON.stringify(appProducts));
    }

    // 2. Theme Management (Normal / Neon)
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    
    const savedTheme = localStorage.getItem("aura-theme") || "normal";
    htmlElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        const newTheme = currentTheme === "normal" ? "neon" : "normal";
        
        htmlElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("aura-theme", newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector("i");
        if (theme === "neon") {
            icon.className = "fa-solid fa-sun";
            themeToggle.setAttribute("title", "Toggle Corporate Blue Mode");
        } else {
            icon.className = "fa-solid fa-moon";
            themeToggle.setAttribute("title", "Toggle Cyber Neon Mode");
        }
    }

    // 3. Render Flipkart-style Storefront Shelf Grid
    const productsGrid = document.getElementById("products-grid");
    let activeCategory = "all";
    let activeSearch = "";

    function renderStorefront() {
        productsGrid.innerHTML = "";
        
        // Filter based on active category selection and active search query
        const filtered = appProducts.filter(p => {
            const matchesCat = activeCategory === "all" || p.category === activeCategory;
            const matchesSearch = activeSearch === "" || 
                p.title.toLowerCase().includes(activeSearch.toLowerCase()) || 
                p.category.toLowerCase().includes(activeSearch.toLowerCase());
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            productsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No matching systems found. Add one in the Admin Control Panel!</div>`;
            return;
        }

        filtered.forEach(product => {
            const percentageOff = Math.round(((product.originalPrice - product.dealPrice) / product.originalPrice) * 100);
            
            // Initializing sliders at 50% load
            const initialLoad = 50;
            const initialRuntime = Math.round((product.baseBackupMinutes || 45) * (100 / initialLoad));

            const card = document.createElement("div");
            card.className = "product-card flipkart-card glass fk-card-hover";
            
            card.innerHTML = `
                <div class="fk-img-wrapper">
                    <img src="${product.imageUrl}" alt="${product.title}" class="fk-img">
                </div>
                <div class="fk-content">
                    <div>
                        <h3 class="fk-title" title="${product.title}">${product.title}</h3>
                        
                        <div class="fk-rating-row">
                            <span class="rating-badge">${product.rating} <i class="fa-solid fa-star" style="font-size: 10px;"></i></span>
                            <span class="reviews-count">(${Number(product.reviewsCount).toLocaleString()})</span>
                        </div>
                        
                        <div class="fk-price-row">
                            <span class="price-deal">₹${Number(product.dealPrice).toLocaleString()}</span>
                            <span class="price-mrp">₹${Number(product.originalPrice).toLocaleString()}</span>
                            <span class="price-off">${percentageOff}% off</span>
                        </div>
                        
                        <div class="bank-offer-row">
                            <i class="fa-solid fa-tag"></i>
                            <span>₹${Math.round(product.dealPrice * 0.95).toLocaleString()} with Bulk Bank offer</span>
                        </div>

                        <div class="fk-specs-row">
                            <div>
                                <span>Capacity Sizing</span>
                                <span>${product.capacity}</span>
                            </div>
                            <div>
                                <span>Phase Layout</span>
                                <span>${product.phase}</span>
                            </div>
                            <div>
                                <span>Simulated Load</span>
                                <span id="load-label-${product.id}" style="color: var(--primary); font-weight: bold;">${initialLoad}%</span>
                            </div>
                            <div>
                                <span>Simulated Backup</span>
                                <span id="runtime-label-${product.id}" style="color: var(--text-color); font-weight: bold;">${initialRuntime} Mins</span>
                            </div>
                        </div>

                        <!-- Supply Chain Live Tracker -->
                        <div class="supply-chain-tracker" style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed rgba(120,119,119,0.15); display: flex; flex-direction: column; gap: 6px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 10px; color: var(--text-muted); font-weight: bold; text-transform: uppercase;"><i class="fa-solid fa-warehouse"></i> Inventory Stock:</span>
                                <span class="stock-pill ${stockClass(product.stockStatus)}" style="font-size: 9px; font-weight: bold; padding: 2px 8px; border-radius: 50px; text-transform: uppercase;">${product.stockStatus || 'In Stock'}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                                <span style="color: var(--text-muted);"><i class="fa-solid fa-calendar-check"></i> Factory ETA:</span>
                                <strong style="color: var(--text-color);">${product.manufacturingEta || 'Immediate'}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                                <span style="color: var(--text-muted);"><i class="fa-solid fa-car-battery"></i> Batteries:</span>
                                <strong style="color: var(--text-color); font-size: 10px;">${product.batteryAvailability || 'Lithium: Available'}</strong>
                            </div>
                            ${product.stockStatus === 'Under Production' ? `
                            <div style="margin-top: 4px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; margin-bottom: 2px;">
                                    <span style="color: var(--secondary); font-weight: bold;"><i class="fa-solid fa-industry"></i> Stage: ${product.factoryStage || 'Pending Assembly'}</span>
                                    <span>${progressPercent(product.factoryStage)}%</span>
                                </div>
                                <div style="width: 100%; height: 4px; background: rgba(120,119,119,0.1); border-radius: 50px; overflow: hidden;">
                                    <div style="width: ${progressPercent(product.factoryStage)}%; height: 100%; background: ${progressColor(product.factoryStage)}; border-radius: 50px;"></div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Interactive Load Slider -->
                    <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 12px; margin-bottom: 12px;">
                        <span style="font-size: 10px; font-weight: bold; color: var(--text-muted); text-transform: uppercase;">Drag to Simulate Load</span>
                        <input type="range" class="calc-slider" min="10" max="100" value="${initialLoad}" id="slider-${product.id}" style="height: 4px;">
                    </div>

                    <!-- Order CTA Button -->
                    <button class="btn btn-primary w-full btn-order-now" data-id="${product.id}" style="padding: 8px 16px; font-size: 12px;">
                        <span>Order Now</span>
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            `;
            productsGrid.appendChild(card);

            // Hook up Card Simulator Listeners
            const slider = card.querySelector(`#slider-${product.id}`);
            const loadLbl = card.querySelector(`#load-label-${product.id}`);
            const runtimeLbl = card.querySelector(`#runtime-label-${product.id}`);

            slider.addEventListener("input", (e) => {
                const currentLoad = parseInt(e.target.value);
                loadLbl.textContent = `${currentLoad}%`;
                
                const runtime = Math.round((product.baseBackupMinutes || 45) * (100 / currentLoad));
                runtimeLbl.textContent = `${runtime} Mins`;
            });

            // Hook up Order Now Listener
            const orderBtn = card.querySelector(`.btn-order-now`);
            orderBtn.addEventListener("click", () => {
                const isUserLoggedIn = localStorage.getItem("aura-user-logged-in") === "true";
                if (!isUserLoggedIn) {
                    alert("AURA Security Protocols: Please sign in as a Customer to place orders or request factory quotes!");
                    localStorage.setItem("aura-auth-redirect", "index.html");
                    window.location.href = "customer-login.html";
                    return;
                }

                let orders = JSON.parse(localStorage.getItem("aura-user-orders")) || [];
                const orderId = "ORD-" + Date.now().toString().slice(-6);
                
                const newOrder = {
                    id: orderId,
                    title: product.title,
                    capacity: product.capacity,
                    price: product.dealPrice,
                    status: "Pending Audit",
                    timestamp: new Date().toLocaleDateString()
                };
                
                orders.unshift(newOrder);
                localStorage.setItem("aura-user-orders", JSON.stringify(orders));

                // Push lead
                let leads = JSON.parse(localStorage.getItem("aura-whatsapp-leads")) || [];
                leads.unshift({
                    name: "Storefront Customer",
                    system: product.title,
                    capacity: product.capacity,
                    timestamp: "Just now"
                });
                localStorage.setItem("aura-whatsapp-leads", JSON.stringify(leads));

                // Open WhatsApp
                const message = `Hello Aura Power Systems!\n\nI want to place an order for the *${product.title}*:\n*Sizing Rating:* ${product.capacity}\n*Order Reference ID:* ${orderId}`;
                window.open(`https://wa.me/919999999999?text=${encodeURIComponent(message)}`, "_blank");

                // Redirect
                window.location.href = "orders.html";
            });
        });
    }

    // Initial Storefront Render
    renderStorefront();

    // 4. Hook up Search and Category Clicks
    const searchInput = document.getElementById("ecom-search");
    searchInput.addEventListener("input", (e) => {
        activeSearch = e.target.value;
        renderStorefront();
    });

    const categoryShelfItems = document.querySelectorAll(".cat-shelf-item");
    categoryShelfItems.forEach(item => {
        item.addEventListener("click", () => {
            categoryShelfItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            activeCategory = item.getAttribute("data-category");
            renderStorefront();
        });
    });

    // 5. Secure Admin Panel Routing (Dedicated Page Redirects)
    const adminTriggerBtn = document.getElementById("admin-trigger-btn");
    const isAdminLoggedIn = localStorage.getItem("aura-admin-logged-in") === "true";
    
    if (isAdminLoggedIn) {
        adminTriggerBtn.classList.add("logged-in");
        adminTriggerBtn.setAttribute("title", "Admin Authenticated (Click to open panel)");
        
        // Dynamic Logout Button creation in header
        const logoutBtn = document.createElement("button");
        logoutBtn.className = "theme-btn logout-trigger";
        logoutBtn.setAttribute("title", "Logout Securely");
        logoutBtn.innerHTML = '<i class="fa-solid fa-power-off"></i>';
        
        adminTriggerBtn.parentNode.insertBefore(logoutBtn, adminTriggerBtn.nextSibling);
        
        logoutBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to sign out from the Admin Portal?")) {
                localStorage.removeItem("aura-admin-logged-in");
                window.location.reload();
            }
        });
    }

    adminTriggerBtn.addEventListener("click", () => {
        if (localStorage.getItem("aura-admin-logged-in") === "true") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "login.html";
        }
    });

    // 5b. Customer Portal Authentication Control
    const userLoginBtn = document.getElementById("user-login-btn");
    const isUserLoggedIn = localStorage.getItem("aura-user-logged-in") === "true";

    if (isUserLoggedIn) {
        userLoginBtn.classList.add("logged-in");
        userLoginBtn.setAttribute("title", `Logged in as Customer (Click to Logout)`);
        
        userLoginBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to log out from the Customer Portal?")) {
                localStorage.removeItem("aura-user-logged-in");
                localStorage.removeItem("aura-user-email");
                window.location.reload();
            }
        });
    } else {
        userLoginBtn.addEventListener("click", () => {
            window.location.href = "customer-login.html";
        });
    }

    // 7. Interactive Groq-Powered AI Chatbot
    const chatWindow = document.getElementById("chat-window");
    const aiChatToggle = document.getElementById("ai-chat-toggle");
    const chatCloseBtn = document.getElementById("chat-close-btn");
    const chatBody = document.getElementById("chat-body");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");

    aiChatToggle.addEventListener("click", () => {
        chatWindow.classList.toggle("open");
        const badge = aiChatToggle.querySelector(".ping-badge");
        if (badge) badge.style.display = "none";
    });

    chatCloseBtn.addEventListener("click", () => {
        chatWindow.classList.remove("open");
    });

    let chatMessages = [
        {
            role: "assistant",
            content: "Hello! I am Aura, your Industrial Systems AI Assistant. Ask me specifications, capacities, efficiency metrics or bypass features of our lineups!"
        }
    ];

    function renderChatMessages() {
        chatBody.innerHTML = "";
        chatMessages.forEach(msg => {
            const bubble = document.createElement("div");
            bubble.className = `chat-msg ${msg.role === 'assistant' ? 'msg-ai' : 'msg-user'}`;
            bubble.innerHTML = `<p>${msg.content}</p>`;
            chatBody.appendChild(bubble);
        });
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    renderChatMessages();

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        chatMessages.push({ role: "user", content: text });
        chatInput.value = "";
        renderChatMessages();

        const typingBubble = document.createElement("div");
        typingBubble.className = "chat-msg msg-ai typing-bubble";
        typingBubble.id = "typing-loader";
        typingBubble.innerHTML = "<span></span><span></span><span></span>";
        chatBody.appendChild(typingBubble);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: `
                                You are Aura, the senior industrial power engineer for Aura Power Systems.
                                Assist customers in choosing clean backup infrastructures. 
                                
                                Our catalog currently contains high-end e-commerce products dynamically managed in the local storage, including the Quantum TX online double-conversion UPS, Aegis hot-swappable modular cabinets, Titan grid-tie hybrid solar inverters, and Nova datacenter parallel systems.
                                
                                Provide professional technical specifications briefly (max 3 sentences). Encourage quoting via WhatsApp.
                            `
                        },
                        ...chatMessages.map(m => ({ role: m.role, content: m.content }))
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.6,
                    max_tokens: 250
                })
            });

            const data = await response.json();
            
            const loader = document.getElementById("typing-loader");
            if (loader) loader.remove();

            if (data.choices && data.choices[0]) {
                const aiReply = data.choices[0].message.content;
                chatMessages.push({ role: "assistant", content: aiReply });
            } else {
                throw new Error("Invalid completion format");
            }
        } catch (err) {
            console.error("Groq Direct API Request Failed:", err);
            
            const loader = document.getElementById("typing-loader");
            if (loader) loader.remove();

            let fallbackAnswer = "I am ready to help configure your systems! For custom engineering layouts, please direct quote us instantly on WhatsApp.";
            if (text.toLowerCase().includes("online") || text.toLowerCase().includes("quantum")) {
                fallbackAnswer = "Our Quantum TX Series features double-conversion topography with pure sine wave outputs, supporting configurations from 10kVA to 40kVA with zero-millisecond transfer time.";
            } else if (text.toLowerCase().includes("modular") || text.toLowerCase().includes("aegis")) {
                fallbackAnswer = "The Aegis Rackmount modular UPS is optimized for high-density edge datacenters with hot-swappable module scalability, covering loads up to 20kVA.";
            }
            
            chatMessages.push({ role: "assistant", content: fallbackAnswer });
        }

        renderChatMessages();
    });

    // ==========================================
    // SLIDING SETTINGS SIDEBAR EVENT HANDLERS
    // ==========================================
    const leftTrigger = document.getElementById("left-settings-trigger");
    const settingsSidebar = document.getElementById("settings-sidebar");
    const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const sidebarAdminBtn = document.getElementById("sidebar-admin-btn");

    if (leftTrigger && settingsSidebar && sidebarCloseBtn && sidebarOverlay) {
        leftTrigger.addEventListener("click", () => {
            settingsSidebar.classList.add("open");
            sidebarOverlay.classList.add("open");
        });

        const closeSidebar = () => {
            settingsSidebar.classList.remove("open");
            sidebarOverlay.classList.remove("open");
        };

        sidebarCloseBtn.addEventListener("click", closeSidebar);
        sidebarOverlay.addEventListener("click", closeSidebar);

        const normalThemeSelect = document.getElementById("theme-normal-select");
        const neonThemeSelect = document.getElementById("theme-neon-select");

        if (normalThemeSelect && neonThemeSelect) {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "normal";
            if (currentTheme === "neon") {
                normalThemeSelect.classList.remove("active");
                neonThemeSelect.classList.add("active");
            } else {
                normalThemeSelect.classList.add("active");
                neonThemeSelect.classList.remove("active");
            }

            normalThemeSelect.addEventListener("click", () => {
                document.documentElement.setAttribute("data-theme", "normal");
                localStorage.setItem("aura-theme", "normal");
                normalThemeSelect.classList.add("active");
                neonThemeSelect.classList.remove("active");
                const mainToggle = document.getElementById("theme-toggle");
                if (mainToggle) {
                    const icon = mainToggle.querySelector("i");
                    if (icon) icon.className = "fa-solid fa-moon";
                    mainToggle.setAttribute("title", "Toggle Cyber Neon Mode");
                }
            });

            neonThemeSelect.addEventListener("click", () => {
                document.documentElement.setAttribute("data-theme", "neon");
                localStorage.setItem("aura-theme", "neon");
                neonThemeSelect.classList.add("active");
                normalThemeSelect.classList.remove("active");
                const mainToggle = document.getElementById("theme-toggle");
                if (mainToggle) {
                    const icon = mainToggle.querySelector("i");
                    if (icon) icon.className = "fa-solid fa-sun";
                    mainToggle.setAttribute("title", "Toggle Corporate Blue Mode");
                }
            });
        }

        if (sidebarAdminBtn) {
            sidebarAdminBtn.addEventListener("click", () => {
                closeSidebar();
                if (localStorage.getItem("aura-admin-logged-in") === "true") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "login.html";
                }
            });
        }
    }
});
