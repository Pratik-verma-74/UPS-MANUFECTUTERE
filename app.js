import { account, databases, ID } from './appwrite.js';

console.log('App.js initialized');

// Configuration
const ADMINS = ['pratikverma025@gmail.com', 'wolterpharma@gmail.com', 'admin.wolter@gmail.com'];
const DATABASE_ID = '69ff3a310008961aa77d';
const COLLECTION_ID = 'employees';

// DOM Elements
const loginBtn = document.getElementById('google-login-btn');
const emailLoginBtn = document.getElementById('email-login-btn');
const loader = document.getElementById('loader');
const authControls = document.getElementById('auth-controls');
const errorAlert = document.getElementById('error-alert');
const successAlert = document.getElementById('success-alert');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authToggleText = document.getElementById('auth-toggle-text');

let isLoginMode = true;

/**
 * Toggle between Login and Sign Up mode
 */
window.toggleAuthMode = function() {
    console.log('Toggling auth mode...');
    isLoginMode = !isLoginMode;
    const btn = document.getElementById('email-login-btn');
    if (isLoginMode) {
        btn.textContent = 'Login';
        authToggleText.innerHTML = `Don't have an account? <span onclick="toggleAuthMode()">Sign Up</span>`;
    } else {
        btn.textContent = 'Sign Up';
        authToggleText.innerHTML = `Already have an account? <span onclick="toggleAuthMode()">Login</span>`;
    }
    hideAlerts();
}

/**
 * Handle Email/Password Authentication
 */
async function handleEmailAuth() {
    console.log('Email auth clicked, mode:', isLoginMode ? 'Login' : 'Signup');
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showError('Please enter both email and password.');
        return;
    }

    toggleLoading(true);
    hideAlerts();

    try {
        if (isLoginMode) {
            // Login
            await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            await redirectByRole(user);
        } else {
            // Sign Up
            await account.create(ID.unique(), email, password);
            showSuccess('Account created! Now please Login.');
            window.toggleAuthMode();
            toggleLoading(false);
        }
    } catch (error) {
        console.error('Auth Error:', error);
        showError(error.message);
        toggleLoading(false);
    }
}

/**
 * Save or update employee profile
 */
async function syncEmployeeProfile(user) {
    try {
        const docId = user.email.replace(/[@.]/g, '-');
        const isAdmin = ADMINS.includes(user.email);
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, docId, {
            name: user.name || user.email.split('@')[0],
            email: user.email,
            role: isAdmin ? 'Admin' : 'MR'
        });
    } catch (error) {
        if (error.code === 409) {
            try {
                const docId = user.email.replace(/[@.]/g, '-');
                await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, {
                    lastLogin: new Date().toISOString()
                });
            } catch (e) {}
        }
    }
}

async function redirectByRole(user) {
    await syncEmployeeProfile(user);
    if (ADMINS.includes(user.email)) {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}

async function checkCurrentSession() {
    toggleLoading(true);
    try {
        const user = await account.get();
        console.log('Session active:', user.email);
        await redirectByRole(user);
    } catch (error) {
        console.log('No active session.');
        toggleLoading(false);
    }
}

function handleGoogleLogin() {
    try {
        console.log('Google login initiated at:', new Date().toLocaleTimeString());
        toggleLoading(true);
        // Ensure the redirect URL is exactly the current page URL
        const redirectUrl = window.location.href.split('?')[0].split('#')[0];
        console.log('Detected Redirect URL:', redirectUrl);
        console.log('Attempting OAuth with Appwrite...');
        
        account.createOAuth2Session('google', redirectUrl, redirectUrl);
        
        // This line might not execute if the redirect happens instantly
        console.log('OAuth session request sent to Appwrite.');
    } catch (error) {
        console.error('CRITICAL: Google Login Error:', error);
        showError('Google login failed: ' + error.message);
        toggleLoading(false);
    }
}

function toggleLoading(isLoading) {
    if (isLoading) {
        loader.classList.remove('hidden');
        authControls.classList.add('hidden');
    } else {
        loader.classList.add('hidden');
        authControls.classList.remove('hidden');
    }
}

function showError(msg) {
    errorAlert.textContent = msg;
    errorAlert.style.display = 'block';
    successAlert.style.display = 'none';
}

function showSuccess(msg) {
    successAlert.textContent = msg;
    successAlert.style.display = 'block';
    errorAlert.style.display = 'none';
}

function hideAlerts() {
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
}

// Event Listeners
if (loginBtn) {
    console.log('Attaching Google login listener');
    loginBtn.addEventListener('click', handleGoogleLogin);
}
if (emailLoginBtn) {
    console.log('Attaching Email login listener');
    emailLoginBtn.addEventListener('click', handleEmailAuth);
}

checkCurrentSession();
