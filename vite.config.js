import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        admin: resolve(__dirname, 'admin.html'),
        adminAnalytics: resolve(__dirname, 'admin-analytics.html'),
        adminB2c: resolve(__dirname, 'admin-b2c.html'),
        adminBiharTrends: resolve(__dirname, 'admin-bihar-trends.html'),
        adminBilling: resolve(__dirname, 'admin-billing.html'),
        adminQuotation: resolve(__dirname, 'admin-quotation.html'),
        b2cStore: resolve(__dirname, 'b2c-store.html'),
        calculator: resolve(__dirname, 'calculator.html'),
        contact: resolve(__dirname, 'contact.html'),
        customerLogin: resolve(__dirname, 'customer-login.html'),
        customize: resolve(__dirname, 'customize.html'),
        orders: resolve(__dirname, 'orders.html'),
        repair: resolve(__dirname, 'repair.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        success: resolve(__dirname, 'success.html')
      }
    },
    // Minify CSS and JS automatically
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
