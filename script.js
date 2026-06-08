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
        imageUrl: "images/ups_online.png",
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
        imageUrl: "images/ups_modular.png",
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
        imageUrl: "images/solar_inverter.png",
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
        imageUrl: "images/power_cabinet.png",
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
        imageUrl: "images/battery_bank.png",
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
// GROQ AI CONFIGURATION - Loaded dynamically from local storage for security
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
    } else {
        // Upgrade existing user local storage to local image paths automatically!
        let hasUpgrade = false;
        appProducts.forEach(p => {
            if (p.imageUrl && p.imageUrl.includes("unsplash.com")) {
                const match = defaultProducts.find(dp => dp.id === p.id);
                if (match) {
                    p.imageUrl = match.imageUrl;
                    hasUpgrade = true;
                }
            }
        });
        if (hasUpgrade) {
            localStorage.setItem("aura-flipkart-products", JSON.stringify(appProducts));
        }
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
                            <span class="price-deal" id="price-deal-${product.id}">₹${Number(product.dealPrice).toLocaleString()}</span>
                            <span class="price-mrp" id="price-mrp-${product.id}">₹${Number(product.originalPrice).toLocaleString()}</span>
                            <span class="price-off">${percentageOff}% off</span>
                        </div>
                        
                        <div class="bank-offer-row">
                            <i class="fa-solid fa-tag"></i>
                            <span id="bank-offer-${product.id}">₹${Math.round(product.dealPrice * 0.95).toLocaleString()} with Bulk Bank offer</span>
                        </div>

                        <div class="fk-specs-row">
                            <div>
                                <span>Capacity Sizing</span>
                                <span>${product.capacity}</span>
                            </div>
                            <div>
                                <span>Phase Layout</span>
                                <select id="phase-select-${product.id}" style="max-width: 80px; padding: 2px; border-radius: 4px; background: rgba(120,119,119,0.1); color: var(--text-color); border: 1px solid var(--card-border); font-size: 11px; outline: none;">
                                    <option value="1 Phase" ${product.phase === '1 Phase' ? 'selected' : ''}>1 Phase</option>
                                    <option value="1/1 Phase" ${product.phase.includes('1/1') ? 'selected' : ''}>1/1 Phase</option>
                                    <option value="3/1 Phase" ${product.phase.includes('3/1') ? 'selected' : ''}>3/1 Phase</option>
                                    <option value="3/3 Phase" ${product.phase.includes('3/3') ? 'selected' : ''}>3/3 Phase</option>
                                </select>
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

                    <!-- Quantity Input -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; background: rgba(120,119,119,0.05); border: 1px solid var(--card-border); border-radius: 4px; padding: 6px 12px;">
                        <span style="font-size: 11px; font-weight: bold; color: var(--text-muted); text-transform: uppercase;">Quantity (Pieces):</span>
                        <input type="number" id="qty-${product.id}" value="1" min="1" max="100" style="width: 60px; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(0, 229, 255, 0.3); background: rgba(0,0,0,0.2); color: var(--text-color); font-size: 12px; outline: none; text-align: center; box-shadow: inset 0 0 5px rgba(0,0,0,0.5);">
                    </div>

                    <!-- Order & Customize CTA Buttons -->
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-primary btn-order-now" data-id="${product.id}" style="flex: 1; padding: 8px; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <span>Order</span>
                            <i class="fa-solid fa-cart-shopping"></i>
                        </button>
                        <button class="btn btn-secondary btn-customize" onclick="window.location.href='customize.html?product=${encodeURIComponent(product.title)}'" style="flex: 1; padding: 8px; font-size: 12px; background: rgba(139,92,246,0.1); color: #8b5cf6; border: 1px solid rgba(139,92,246,0.3); display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.3s ease;">
                            <span>Customize</span>
                            <i class="fa-solid fa-sliders"></i>
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);

            // Hook up Card Simulator Listeners
            const slider = card.querySelector(`#slider-${product.id}`);
            const loadLbl = card.querySelector(`#load-label-${product.id}`);
            const runtimeLbl = card.querySelector(`#runtime-label-${product.id}`);
            const phaseSelect = card.querySelector(`#phase-select-${product.id}`);
            const dealLbl = card.querySelector(`#price-deal-${product.id}`);
            const mrpLbl = card.querySelector(`#price-mrp-${product.id}`);
            const bankLbl = card.querySelector(`#bank-offer-${product.id}`);

            function updateDynamicPrice() {
                const currentLoad = parseInt(slider.value);
                const loadFactor = currentLoad / 50; 
                
                const phaseVal = phaseSelect.value;
                let phaseFactor = 1;
                if (phaseVal === "3/1 Phase") phaseFactor = 1.15;
                if (phaseVal === "3/3 Phase") phaseFactor = 1.30;
                
                const basePhaseFactor = product.phase.includes('3/3') ? 1.30 : (product.phase.includes('3/1') ? 1.15 : 1);
                const relativePhaseFactor = phaseFactor / basePhaseFactor;

                const newDeal = Math.round(product.dealPrice * loadFactor * relativePhaseFactor);
                const newMrp = Math.round(product.originalPrice * loadFactor * relativePhaseFactor);
                
                dealLbl.textContent = "₹" + newDeal.toLocaleString();
                mrpLbl.textContent = "₹" + newMrp.toLocaleString();
                if(bankLbl) bankLbl.textContent = "₹" + Math.round(newDeal * 0.95).toLocaleString() + " with Bulk Bank offer";
                
                return newDeal;
            }

            slider.addEventListener("input", (e) => {
                const currentLoad = parseInt(e.target.value);
                loadLbl.textContent = `${currentLoad}%`;
                
                const runtime = Math.round((product.baseBackupMinutes || 45) * (100 / currentLoad));
                runtimeLbl.textContent = `${runtime} Mins`;
                
                updateDynamicPrice();
            });

            phaseSelect.addEventListener("change", () => {
                updateDynamicPrice();
            });

            // Hook up Order Now Listener
            const orderBtn = card.querySelector(`.btn-order-now`);
            orderBtn.addEventListener("click", async () => {
                // Real Appwrite session verification
                const isAuthenticated = await requireAuth("index.html");
                if (!isAuthenticated) return;

                const qtyInput = card.querySelector(`#qty-${product.id}`);
                const quantity = parseInt(qtyInput.value) || 1;
                const orderId = "ORD-" + Date.now().toString().slice(-6);
                
                const finalPrice = updateDynamicPrice();
                const selectedPhase = phaseSelect.value;
                const finalLoad = slider.value;
                
                const orderTitle = `${product.title} (${selectedPhase}, ${finalLoad}% Load)`;
                
                // Check if User Profile / Address Exists
                let userProfile = null;
                if (typeof FirebaseService !== "undefined") {
                    userProfile = await FirebaseService.getUserProfile();
                } else {
                    userProfile = JSON.parse(localStorage.getItem("aura-user-profile"));
                }

                // If user doesn't have an address, send them to the Checkout Form
                if (!userProfile || !userProfile.address) {
                    window.location.href = `checkout.html?type=standard&item=${encodeURIComponent(orderTitle)}&price=${finalPrice * quantity}`;
                    return; // Stop here, the checkout page will handle saving profile and order
                }

                // If profile exists, use it to automatically process the order
                const newOrder = {
                    id: orderId,
                    title: orderTitle,
                    capacity: product.capacity,
                    price: finalPrice * quantity,
                    quantity: quantity,
                    status: "Pending Audit",
                    shippingAddress: `${userProfile.address}, ${userProfile.city} - ${userProfile.pin} (Ph: ${userProfile.phone})`,
                    timestamp: new Date().toLocaleDateString()
                };
                
                if (typeof FirebaseService !== "undefined") {
                    await FirebaseService.saveOrder(newOrder);
                    await FirebaseService.createNotification("admin", "New Order Received", `User ordered ${orderTitle}. Order ID: ${orderId}`);
                } else {
                    let orders = JSON.parse(localStorage.getItem("aura-user-orders")) || [];
                    orders.unshift(newOrder);
                    localStorage.setItem("aura-user-orders", JSON.stringify(orders));
                }

                // Push lead for WhatsApp Tracker
                let leads = JSON.parse(localStorage.getItem("aura-whatsapp-leads")) || [];
                leads.unshift({
                    name: userProfile.name || "Storefront Customer",
                    system: product.title + " (Qty: " + quantity + ")",
                    capacity: product.capacity,
                    timestamp: "Just now"
                });
                localStorage.setItem("aura-whatsapp-leads", JSON.stringify(leads));

                // Open WhatsApp
                const message = `Hello Roboart Transformers!\n\nI want to place an order for the *${orderTitle}*:\n*Sizing Rating:* ${product.capacity}\n*Quantity:* ${quantity} Pieces\n*Calculated Price:* ₹${finalPrice.toLocaleString()} (per piece)\n*Order Reference ID:* ${orderId}`;
                window.open(`https://wa.me/916394635914?text=${encodeURIComponent(message)}`, "_blank");

                // Redirect to success page
                window.location.href = `success.html?id=${orderId}`;
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
    
    if (adminTriggerBtn) {
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
                window.location.href = "customer-login.html";
            }
        });
    }

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
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
                    ]
                })
            });

            if (!response.ok) {
                throw new Error("Serverless API responded with error status: " + response.status);
            }

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
                    window.location.href = "customer-login.html";
                }
            });
        }
    }
});
