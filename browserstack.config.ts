const cp = require('child_process');
import { _android } from '@playwright/test';
import 'dotenv/config'

const clientPlaywrightVersion = cp
  .execSync('npx playwright --version')
  .toString()
  .trim()
  .split(' ')[1];

//BrowserStack Specific Capabilities.
//Set 'browserstack.local:true for turning local mode as ON
export const caps = {
  browser: 'chrome',
  os: "",
  os_version: 'catalina',
  name: 'Test Automatoin',
  build: 'Test Automation Web',
  'browserstack.username': process.env.browserstackUsername,
  'browserstack.accessKey': process.env.browserstackPassword,
  'browserstack.local': process.env.browserStackLocalMode,
  'browserstack.proxyHost': process.env.jenkinsProxyHost,
  'browserstack.proxyPort': process.env.jenkinsProxyPort,
  'client.playwrightVersion': clientPlaywrightVersion,
  'browserstack.debug': false,
  acceptSslCerts: true,
  acceptInsecureCerts: true,
  trustAllSSLCertificates: true,
  ACCEPT_SSL_CERTS: true,
  headless: false,
  'browserstack.networkLogs': true,
  interactiveDebugging: true,
};

export const mobileCaps = {
  browser: 'chrome',
  os: "Android, v12.0",
  osVersion: 12,
  name: 'Test Automation',
  build: 'Test Automation Mobile',
  'browserstack.username': process.env.browserstackUsername,
  'browserstack.accessKey': process.env.browserstackPassword,
  'browserstack.local': false,
  'client.playwrightVersion': clientPlaywrightVersion,
  acceptInsecureCerts: true,
  headless: false,
  'browserstack.networkLogs': true,
  deviceName: 'Samsung Galaxy S22',
  browser_version: 'latest',
  realMobile: true,
  interactiveDebugging: true,
};



//Patching the capabilities dynamically according to the project name.
const patchCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, browser_version] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  let os = osCapsSplit.shift();
  let os_version = osCapsSplit.join(' ');
  caps.browser = browser ? browser : 'chrome';
  caps.os_version = browser_version ? browser_version : 'latest';
  caps.os = os ? os : 'osx';
  caps.os_version = os_version ? os_version : 'catalina';
  caps.name = title;
};

const patchMobileCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, deviceName] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  //let osVersion = osCapsSplit.join(" ");
  let osVersion;
  mobileCaps.browser = browser ? browser : "chrome";
  mobileCaps.deviceName = deviceName ? deviceName : "Samsung Galaxy S22";
  mobileCaps.osVersion = osVersion ? osVersion : "12.0";
  mobileCaps.name = title;
  mobileCaps.realMobile = true
};

exports.getCdpEndpoint = (name:any, title:any, isMobile?: boolean) => {
  let cdpUrl: string;
  if(isMobile) {
    patchMobileCaps(name, title);
    cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(mobileCaps))}`;
  }
  else {
    patchCaps(name, title);
    cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;
  }
  return cdpUrl;

}
