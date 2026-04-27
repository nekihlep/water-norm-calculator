const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30000,
     reporter: 'html',
    use: {
        baseURL: 'http://127.0.0.1:8000',  // Порт 8000
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry'
    },
    webServer: {
        command: 'uvicorn main:app --host 127.0.0.1 --port 8000',
        url: 'http://127.0.0.1:8000',
        reuseExistingServer: true
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
});