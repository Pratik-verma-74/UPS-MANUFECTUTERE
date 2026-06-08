const fs = require('fs');

// 1. Add adminDeleteDocument to firebase-service.js
let fbCode = fs.readFileSync('firebase-service.js', 'utf8');
if (!fbCode.includes('adminDeleteDocument')) {
    fbCode = fbCode.replace(
        /}\s*};\s*(window\.FirebaseService\s*=\s*FirebaseService;)/,
        `
    async adminDeleteDocument(collectionName, documentId) {
        if (!db) return false;
        try {
            await db.collection(collectionName).doc(documentId).delete();
            console.log(\`Firebase: Document \${documentId} deleted from \${collectionName}\`);
            return true;
        } catch (err) {
            console.error(\`Firebase: Failed to delete \${documentId}\`, err);
            return false;
        }
    }
};
$1`
    );
    fs.writeFileSync('firebase-service.js', fbCode);
}

// 2. Fix admin.html
let html = fs.readFileSync('admin.html', 'utf8');

// Header
html = html.replace('<th>Model Purchased</th>', '<th>Client & Model Purchased</th>');

// User details in row
const orderSearch = `<td>\${escapeHTML(order.title)}</td>`;
const orderReplace = `<td>
                            <div style="font-size: 11px; font-weight: bold; color: var(--primary); margin-bottom: 4px;">
                                <i class="fa-solid fa-user"></i> \${escapeHTML(order.userName || order.userEmail || "Storefront Customer")}
                            </div>
                            \${escapeHTML(order.title)}
                        </td>`;
if(html.includes(orderSearch)) {
    html = html.replace(orderSearch, orderReplace);
}

// Fix orders delete
const orderDeleteSearch = `                    btn.addEventListener("click", () => {
                        const index = parseInt(btn.getAttribute("data-index"));
                        if (confirm("Are you sure you want to remove this client order log?")) {
                            awOrders.splice(index, 1);
                            localStorage.setItem("aura-user-orders", JSON.stringify(awOrders));
                            renderAdminOrders();
                            renderMetrics();
                            renderFactoryBoard();
                        }
                    });`;
const orderDeleteReplace = `                    btn.addEventListener("click", async () => {
                        const index = parseInt(btn.getAttribute("data-index"));
                        if (confirm("Are you sure you want to permanently delete this client order?")) {
                            const docId = awOrders[index].id;
                            awOrders.splice(index, 1);
                            localStorage.setItem("aura-user-orders", JSON.stringify(awOrders));
                            if (typeof FirebaseService !== "undefined") {
                                await FirebaseService.adminDeleteDocument("orders", docId);
                            }
                            renderAdminOrders();
                            renderMetrics();
                            renderFactoryBoard();
                        }
                    });`;
html = html.replace(orderDeleteSearch, orderDeleteReplace);

// Fix customs delete
const customDeleteSearch = `                    btn.addEventListener("click", () => {
                        const index = parseInt(btn.getAttribute("data-index"));
                        if (confirm("Are you sure you want to delete this custom build spec?")) {
                            awCustoms.splice(index, 1);
                            localStorage.setItem("aura-user-customizations", JSON.stringify(awCustoms));
                            renderAdminCustoms();
                            renderMetrics();
                            renderFactoryBoard();
                        }
                    });`;
const customDeleteReplace = `                    btn.addEventListener("click", async () => {
                        const index = parseInt(btn.getAttribute("data-index"));
                        if (confirm("Are you sure you want to permanently delete this custom build spec?")) {
                            const docId = awCustoms[index].customId;
                            awCustoms.splice(index, 1);
                            localStorage.setItem("aura-user-customizations", JSON.stringify(awCustoms));
                            if (typeof FirebaseService !== "undefined") {
                                await FirebaseService.adminDeleteDocument("customizations", docId);
                            }
                            renderAdminCustoms();
                            renderMetrics();
                            renderFactoryBoard();
                        }
                    });`;
html = html.replace(customDeleteSearch, customDeleteReplace);

// Fix repairs delete
const repairDeleteSearch = `                    btn.addEventListener("click", () => {
                        const index = parseInt(btn.getAttribute("data-index"));
                        if (confirm("Are you sure you want to remove this repair ticket?")) {
                            awRepairs.splice(index, 1);
                            localStorage.setItem("aura-user-repairs", JSON.stringify(awRepairs));
                            renderAdminRepairs();
                            renderMetrics();
                        }
                    });`;
const repairDeleteReplace = `                    btn.addEventListener("click", async () => {
                        const index = parseInt(btn.getAttribute("data-index"));
                        if (confirm("Are you sure you want to permanently delete this repair ticket?")) {
                            const docId = awRepairs[index].ticketId;
                            awRepairs.splice(index, 1);
                            localStorage.setItem("aura-user-repairs", JSON.stringify(awRepairs));
                            if (typeof FirebaseService !== "undefined") {
                                await FirebaseService.adminDeleteDocument("repairs", docId);
                            }
                            renderAdminRepairs();
                            renderMetrics();
                        }
                    });`;
html = html.replace(repairDeleteSearch, repairDeleteReplace);

fs.writeFileSync('admin.html', html);
console.log('Fixed admin orders UI and delete logic comprehensively');
