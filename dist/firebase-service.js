// Firebase Configuration & Service Layer for Roboart Power Systems
const firebaseConfig = {
  apiKey: "AIzaSyAANGFVPMFcRmgbh720pYB58SJm0Xa4rXc",
  authDomain: "aura-power-systems-8c922.firebaseapp.com",
  projectId: "aura-power-systems-8c922",
  storageBucket: "aura-power-systems-8c922.firebasestorage.app",
  messagingSenderId: "800878578422",
  appId: "1:800878578422:web:58d6a59108628d9130bad7",
  measurementId: "G-5SRBE332HM"
};

// Initialize Firebase
let firebaseApp = null;
let db = null;
let auth = null;

function initFirebase() {
    if (typeof firebase === "undefined") {
        console.warn("Firebase SDK not loaded. Operating in localStorage fallback mode.");
        return false;
    }
    try {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();

        try {
            // App Check is temporarily disabled as it may be causing network-request-failed errors
            // if domains are not properly whitelisted in reCAPTCHA
            /*
            if (firebase.appCheck) {
                const appCheck = firebase.appCheck();
                appCheck.activate('6LfEmhMtAAAAAOEh6v1pDo9SQtYvdiWmBHnxUnOR', true);
                console.log("Firebase App Check initialized successfully.");
            }
            */
        } catch (e) {
            console.warn("App Check initialization skipped or failed:", e);
        }

        console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);
        return true;
    } catch (err) {
        console.error("Firebase Initialization failed:", err);
        return false;
    }
}

// Helper to check logged in customer email
function getLoggedInUserEmail() {
    return localStorage.getItem("aura-user-email") || "guest@roboartgrp.com";
}

initFirebase();

const FirebaseService = {
    // -----------------------------------------------------
    // USER PROFILE METHODS (Address/Location)
    // -----------------------------------------------------
    async saveUserProfile(profileData) {
        if (!db) return false;
        try {
            const userEmail = getLoggedInUserEmail();
            await db.collection("userProfiles").doc(userEmail).set(profileData, { merge: true });
            localStorage.setItem("aura-user-profile", JSON.stringify(profileData));
            console.log("Firebase: User profile saved");
            return true;
        } catch (err) {
            console.error("Firebase: Failed to save user profile", err);
            return false;
        }
    },

    async getUserProfile() {
        if (!db) return JSON.parse(localStorage.getItem("aura-user-profile")) || null;
        try {
            const userEmail = getLoggedInUserEmail();
            const doc = await db.collection("userProfiles").doc(userEmail).get();
            if (doc.exists) {
                const data = doc.data();
                localStorage.setItem("aura-user-profile", JSON.stringify(data));
                return data;
            }
            return null;
        } catch (err) {
            console.error("Firebase: Failed to fetch user profile", err);
            return null;
        }
    },

    // -----------------------------------------------------
    // NOTIFICATION METHODS
    // -----------------------------------------------------
    async createNotification(targetEmail, title, message) {
        if (!db) return false;
        try {
            const notif = {
                targetEmail: targetEmail,
                title: title,
                message: message,
                timestamp: new Date().toISOString(),
                read: false
            };
            await db.collection("notifications").add(notif);
            return true;
        } catch (err) {
            console.error("Firebase: Failed to create notification", err);
            return false;
        }
    },

    async getNotifications() {
        if (!db) return [];
        try {
            const userEmail = getLoggedInUserEmail();
            const isAdmin = localStorage.getItem("aura-admin-logged-in") === "true";
            const target = isAdmin ? "admin" : userEmail;
            
            const snapshot = await db.collection("notifications")
                .where("targetEmail", "==", target)
                .orderBy("timestamp", "desc")
                .limit(20)
                .get();
                
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
            console.error("Firebase: Failed to fetch notifications", err);
            return [];
        }
    },

    async markNotificationsRead() {
        if (!db) return;
        try {
            const userEmail = getLoggedInUserEmail();
            const isAdmin = localStorage.getItem("aura-admin-logged-in") === "true";
            const target = isAdmin ? "admin" : userEmail;
            
            const snapshot = await db.collection("notifications")
                .where("targetEmail", "==", target)
                .where("read", "==", false)
                .get();
                
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.update(doc.ref, { read: true });
            });
            await batch.commit();
        } catch (err) {
            console.error("Firebase: Failed to mark notifications read", err);
        }
    },

    // -----------------------------------------------------
    // ORDERS COLLECTION METHODS
    // -----------------------------------------------------
    async saveOrder(order) {
        const userEmail = getLoggedInUserEmail();
        const documentData = {
            orderId: order.id,
            title: order.title,
            capacity: order.capacity,
            price: String(order.price),
            status: order.status || "Order Placed & Confirmed",
            statusStep: order.statusStep || 1, // 1 to 5 tracker
            expectedDate: order.expectedDate || null,
            shippingAddress: order.shippingAddress || null,
            timestamp: order.timestamp || new Date().toLocaleDateString(),
            userEmail: userEmail
        };

        let localOrders = JSON.parse(localStorage.getItem("aura-user-orders")) || [];
        if (!localOrders.some(o => o.id === order.id)) {
            localOrders.unshift(order);
            localStorage.setItem("aura-user-orders", JSON.stringify(localOrders));
        }

        if (!db) return order;

        try {
            await db.collection("orders").doc(order.id).set(documentData);
            console.log("Firebase: Order saved successfully to Cloud DB");
            return documentData;
        } catch (err) {
            console.error("Firebase: Failed to save order", err);
            return order;
        }
    },

    async getOrders() {
        if (!db) return JSON.parse(localStorage.getItem("aura-user-orders")) || [];
        try {
            const userEmail = getLoggedInUserEmail();
            const snapshot = await db.collection("orders").where("userEmail", "==", userEmail).get();
            const orders = snapshot.docs.map(doc => doc.data());
            localStorage.setItem("aura-user-orders", JSON.stringify(orders));
            return orders;
        } catch (err) {
            console.error("Firebase: Failed to fetch orders", err);
            return JSON.parse(localStorage.getItem("aura-user-orders")) || [];
        }
    },

    // -----------------------------------------------------
    // CUSTOMIZATIONS COLLECTION METHODS
    // -----------------------------------------------------
    async saveCustomization(custom) {
        const userEmail = getLoggedInUserEmail();
        const documentData = {
            customId: custom.id,
            name: custom.name,
            capacity: custom.capacity,
            phase: custom.phase,
            battery: custom.battery,
            specs: custom.specs,
            status: custom.status || "Order Placed & Confirmed",
            statusStep: custom.statusStep || 1,
            expectedDate: custom.expectedDate || null,
            shippingAddress: custom.shippingAddress || null,
            timestamp: custom.timestamp || new Date().toLocaleDateString(),
            userEmail: userEmail
        };

        let localCustoms = JSON.parse(localStorage.getItem("aura-user-customizations")) || [];
        if (!localCustoms.some(c => c.id === custom.id)) {
            localCustoms.unshift(custom);
            localStorage.setItem("aura-user-customizations", JSON.stringify(localCustoms));
        }

        if (!db) return custom;

        try {
            await db.collection("customizations").doc(custom.id).set(documentData);
            console.log("Firebase: Customization saved successfully");
            return documentData;
        } catch (err) {
            console.error("Firebase: Failed to save customization", err);
            return custom;
        }
    },

    async getCustomizations() {
        if (!db) return JSON.parse(localStorage.getItem("aura-user-customizations")) || [];
        try {
            const userEmail = getLoggedInUserEmail();
            const snapshot = await db.collection("customizations").where("userEmail", "==", userEmail).get();
            const customs = snapshot.docs.map(doc => doc.data());
            localStorage.setItem("aura-user-customizations", JSON.stringify(customs));
            return customs;
        } catch (err) {
            console.error("Firebase: Failed to fetch customizations", err);
            return JSON.parse(localStorage.getItem("aura-user-customizations")) || [];
        }
    },

    // -----------------------------------------------------
    // REPAIRS COLLECTION METHODS
    // -----------------------------------------------------
    async saveRepair(repair) {
        const userEmail = getLoggedInUserEmail();
        const documentData = {
            ticketId: repair.id,
            brand: repair.brand,
            model: repair.model,
            capacity: repair.capacity,
            fault: repair.fault,
            desc: repair.desc,
            name: repair.name,
            address: repair.address,
            status: repair.status || "Pending",
            statusStep: repair.statusStep || 1,
            expectedDate: repair.expectedDate || null,
            shippingAddress: repair.shippingAddress || null,
            timestamp: repair.timestamp || new Date().toLocaleDateString(),
            userEmail: userEmail
        };

        let localRepairs = JSON.parse(localStorage.getItem("aura-user-repairs")) || [];
        if (!localRepairs.some(r => r.id === repair.id)) {
            localRepairs.unshift(repair);
            localStorage.setItem("aura-user-repairs", JSON.stringify(localRepairs));
        }

        if (!db) return repair;

        try {
            await db.collection("repairs").doc(repair.id).set(documentData);
            console.log("Firebase: Repair ticket saved successfully");
            return documentData;
        } catch (err) {
            console.error("Firebase: Failed to save repair ticket", err);
            return repair;
        }
    },

    async getRepairs() {
        if (!db) return JSON.parse(localStorage.getItem("aura-user-repairs")) || [];
        try {
            const userEmail = getLoggedInUserEmail();
            const snapshot = await db.collection("repairs").where("userEmail", "==", userEmail).get();
            const repairs = snapshot.docs.map(doc => doc.data());
            localStorage.setItem("aura-user-repairs", JSON.stringify(repairs));
            return repairs;
        } catch (err) {
            console.error("Firebase: Failed to fetch repairs", err);
            return JSON.parse(localStorage.getItem("aura-user-repairs")) || [];
        }
    },

    // -----------------------------------------------------
    // ADMIN ONLY METHODS
    // -----------------------------------------------------
    // --- ADMIN USER CRM METHODS ---
    async adminGetAllUsers() {
        if (!db) return [];
        try {
            const snapshot = await db.collection("userProfiles").get();
            let users = [];
            snapshot.forEach(doc => {
                users.push({
                    email: doc.id,
                    ...doc.data()
                });
            });
            return users;
        } catch (err) {
            console.error("Firebase: Failed to fetch all users", err);
            return [];
        }
    },

    async adminUpdateUserProfile(email, updatedData) {
        if (!db) return false;
        try {
            await db.collection("userProfiles").doc(email).set(updatedData, { merge: true });
            console.log(`Firebase: User profile ${email} updated by admin`);
            return true;
        } catch (err) {
            console.error("Firebase: Failed to update user profile", err);
            return false;
        }
    },

    async adminDeleteUserProfile(email) {
        if (!db) return false;
        try {
            await db.collection("userProfiles").doc(email).delete();
            console.log(`Firebase: User profile ${email} deleted by admin`);
            return true;
        } catch (err) {
            console.error("Firebase: Failed to delete user profile", err);
            return false;
        }
    },

    // --- ADMIN ORDER & REPAIR METHODS ---
    async adminGetAllOrders() {
        if (!db) return [];
        try {
            const snapshot = await db.collection("orders").limit(100).get();
            return snapshot.docs.map(doc => doc.data());
        } catch (err) {
            console.error("Firebase: Admin failed to fetch all orders", err);
            return [];
        }
    },

    async adminGetAllCustomizations() {
        if (!db) return [];
        try {
            const snapshot = await db.collection("customizations").limit(100).get();
            return snapshot.docs.map(doc => doc.data());
        } catch (err) {
            console.error("Firebase: Admin failed to fetch all customizations", err);
            return [];
        }
    },

    async adminGetAllRepairs() {
        if (!db) return [];
        try {
            const snapshot = await db.collection("repairs").limit(100).get();
            return snapshot.docs.map(doc => doc.data());
        } catch (err) {
            console.error("Firebase: Admin failed to fetch all repairs", err);
            return [];
        }
    },

    
    async addAuditLog(action, details) {
        if (!db) return;
        try {
            const adminEmail = localStorage.getItem("aura-user-email") || "Unknown Admin";
            await db.collection("audit_logs").add({
                admin: adminEmail,
                action: action,
                details: details,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Audit log saved:", action);
        } catch (e) {
            console.error("Failed to save audit log:", e);
        }
    },

    
    listenAuditLogs(callback) {
        if (!db) return null;
        try {
            return db.collection("audit_logs")
                .orderBy("timestamp", "desc")
                .limit(20)
                .onSnapshot(snapshot => {
                    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    callback(logs);
                });
        } catch (e) {
            console.error("Failed to listen to audit logs", e);
            return null;
        }
    },

    async adminUpdateStatus(collectionName, documentId, newStatus, newStep, newDate) {
        if (!db) return false;
        try {
            const idField = collectionName === "orders" ? "orderId" : (collectionName === "customizations" ? "customId" : "ticketId");
            const snapshot = await db.collection(collectionName).where(idField, "==", documentId).get();
            if (snapshot.empty) {
                console.error(`Document with ${idField} = ${documentId} not found in Firebase.`);
                return false;
            }
            const docRef = snapshot.docs[0].ref;
            const docData = snapshot.docs[0].data();
            
            const updatePayload = { status: newStatus };
            if (newStep) updatePayload.statusStep = newStep;
            if (newDate !== undefined) updatePayload.expectedDate = newDate;
            
            await docRef.update(updatePayload);
            console.log(`Firebase: Document ${documentId} status updated to ${newStatus} in ${collectionName}`);
            
            // Add Audit Log
            await this.addAuditLog("STATUS_UPDATE", `Updated ${documentId} in ${collectionName} to ${newStatus}`);
            
            // Notify User
            if (docData.userEmail) {
                await this.createNotification(docData.userEmail, "Order Updated", `Your item (${documentId}) is now: ${newStatus}`);
            }
            return true;
        } catch (err) {
            console.error("Firebase: Admin failed to update status", err);
            return false;
        }
    },

    // -----------------------------------------------------
    // AUTHENTICATION METHODS
    // -----------------------------------------------------
    async signup(email, password, name) {
        if (!auth) return { success: false, error: "Firebase Auth not initialized" };
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            if (name) {
                await user.updateProfile({ displayName: name });
            }
            return await this.login(email, password);
        } catch (err) {
            console.error("Firebase Auth: Signup failed", err);
            return { success: false, error: err.message || "Signup failed" };
        }
    },

    async login(email, password) {
        if (!auth) return { success: false, error: "Firebase Auth not initialized" };
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            localStorage.setItem("aura-user-logged-in", "true");
            localStorage.setItem("aura-user-email", user.email);
            localStorage.setItem("aura-user-name", user.displayName || user.email);
            
            console.log("Firebase Auth: Login successful for", user.email);
            return { success: true, user: user };
        } catch (err) {
            console.error("Firebase Auth: Login failed", err);
            return { success: false, error: err.message || "Invalid credentials" };
        }
    },

    async loginWithGoogle() {
        if (!auth) return;
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            // Primary method: Popup (Most reliable on Desktop)
            const result = await auth.signInWithPopup(provider);
            return result;
        } catch (err) {
            console.error("Firebase Auth: Google OAuth Popup failed", err);
            // Fallback for Mobile or aggressive popup blockers
            if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
                console.log("Popup blocked/cancelled, falling back to redirect...");
                try {
                    await auth.signInWithRedirect(provider);
                } catch (redirectErr) {
                    console.error("Redirect fallback failed:", redirectErr);
                    this._handleAuthError(redirectErr);
                    throw redirectErr;
                }
            } else {
                this._handleAuthError(err);
                throw err;
            }
        }
    },

    _handleAuthError(err) {
        if (err.code === "auth/unauthorized-domain") {
            alert("Google Sign-In Error: Domain not authorized in Firebase Console.");
        } else if (err.code === "auth/network-request-failed") {
            alert("Network Error: Could not reach Google. Please check your internet connection or disable ad-blockers (like Brave Shields/uBlock) which might be blocking Firebase.");
        } else {
            alert("Google Sign-In failed: " + err.message);
        }
    },

    async checkSession() {
        if (!auth) return null;
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                if (user) {
                    localStorage.setItem("aura-user-logged-in", "true");
                    localStorage.setItem("aura-user-email", user.email);
                    localStorage.setItem("aura-user-name", user.displayName || user.email);
                    resolve(user);
                } else {
                    resolve(null);
                }
            });
        });
    },

    async logout() {
        try {
            if (auth) {
                await auth.signOut();
            }
        } catch (err) {
            console.warn("Firebase Auth: Logout failed", err);
        }
        localStorage.removeItem("aura-user-logged-in");
        localStorage.removeItem("aura-user-email");
        localStorage.removeItem("aura-user-name");
        localStorage.removeItem("aura-user-picture");
        localStorage.removeItem("aura-admin-logged-in");
        console.log("Firebase Auth: Logged out successfully");
    
    },
    async adminDeleteDocument(collectionName, documentId) {
        if (!db) return false;
        try {
            await db.collection(collectionName).doc(documentId).delete();
            console.log(`Firebase: Document ${documentId} deleted from ${collectionName}`);
            return true;
        } catch (err) {
            console.error(`Firebase: Failed to delete ${documentId}`, err);
            return false;
        }
    }
};
window.FirebaseService = FirebaseService;
// Maintain backward compatibility for a moment while transitioning files
window.AppwriteService = FirebaseService;

(async () => {
    if (typeof FirebaseService !== "undefined" && auth) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                localStorage.setItem("aura-user-logged-in", "true");
                localStorage.setItem("aura-user-email", user.email);
                localStorage.setItem("aura-user-name", user.displayName || user.email);
            }
        });
    }
})();

window.requireAuth = async function(redirectPage) {
    if (typeof FirebaseService !== "undefined") {
        const user = await FirebaseService.checkSession();
        if (user || localStorage.getItem("aura-user-logged-in") === "true") return true;
    }
    alert("ROBOART Security: Please sign in to continue!");
    if (redirectPage) {
        localStorage.setItem("aura-auth-redirect", redirectPage);
    }
    window.location.href = "customer-login.html";
    return false;
};
