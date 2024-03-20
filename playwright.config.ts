const { getCdpEndpoint } = require('./browserstack.config');
import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./global.setup'),
  timeout: 900000,
  reporter: 'html',
  retries:3,
  projects: [
    {
      name: 'BrowserstackWeb',
      use: {
        connectOptions: { wsEndpoint: getCdpEndpoint('chrome@latest:OSX Ventura@browserstack', 'Smoke Test - Chrome Mac',false) },
      },
    },
    {
      name: 'BrowserstackWeb',
      use: {
        connectOptions: { wsEndpoint: getCdpEndpoint('chrome@latest:Windows 11','Smoke Test - Chrome Windows',false) },
      },
    },
    {
      name: 'BrowserstackWeb',
      use: {
        connectOptions: { wsEndpoint: getCdpEndpoint('playwright-webkit@latest:OSX Ventura@browserstack', 'Smoke Test - Mac Safari',false) },
      },
    },

    {
      name: "BrowserstackMobile",
      use: {
        connectOptions: {wsEndpoint: getCdpEndpoint('chrome@Samsung Galaxy S22:Android@12.0@browserstack', 'Android Chrome', true), 
        }
      },
    },
    
    {
      name: 'Local',
      testDir : 'main/tests',
      testMatch: ['*.spec.ts'],
      use: {
        channel: 'chrome',
        headless: false,
        ignoreHTTPSErrors: true,
        viewport: null,
        launchOptions: {
          args: [
            "--start-maximized",
            "--disable-blink-features=AutomationControlled",
            "--enable-automation",
          ],
        },
      },
    }
  ]
}

export default config;
