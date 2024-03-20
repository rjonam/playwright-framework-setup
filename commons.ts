import colors from '../helpers/colorHelper';
import { Page, chromium, _android, TestInfo, webkit } from '@playwright/test';
import config from './../../playwright.config';
import * as browserstack from 'browserstack-local';

const bsLocal = new browserstack.Local();
export class CommonHelper {
  private statusPrint = async (testInfo: any) => {
    testInfo.status === 'passed' ? console.info(colors.fg.yellow, `Test : ${colors.fg.green} ${testInfo.title} ${colors.fg.yellow}Passed`, colors.reset) : console.info(colors.fg.yellow, `Test : ${colors.fg.green} ${testInfo.title} ${colors.fg.red} Failed`, colors.reset);
  };

  private testNamePrint = async (testInfo: any) => {
    console.info(colors.fg.yellow, `Executing the Test : ${colors.fg.green} ${testInfo.title} ${colors.fg.yellow} in ${colors.fg.green} ${testInfo.project.name} ${colors.fg.yellow} Execution Mode`, colors.reset);
  };

  private takeScreenshot = async (testInfo: any, newPage: Page) => {
    if (testInfo.status !== 'passed') {
      const screenshotPath = await testInfo.outputPath(`${testInfo.title}.png`);
      await testInfo.attachments.push({ name: 'screenshot', path: screenshotPath, contentType: 'image/png' });
      await newPage.screenshot({ path: screenshotPath, timeout: 5000 });
    }
  };

  private updateStatusInBrowserstack = async (page: Page, testInfo: any, statusReason: string) => {
    const args: NodeJS.ProcessEnv = process.env;
    args.npm_lifecycle_script?.includes('Local') !== true && (await page.evaluate(() => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { status: testInfo.status, reason: statusReason } })}`));
  };

  public beforeEachHook = async (testInfo: TestInfo) => {
    await this.testNamePrint(testInfo);
  };

  public afterEachHook = async (page: Page, testInfo: any) => {
    const statusReason: string = testInfo.status === 'passed' ? 'Test Passed Successfully' : 'Test Failed or Timed Out . Please Check the Failures';
    await this.statusPrint(testInfo);
    await this.takeScreenshot(testInfo, page);
    await this.updateStatusInBrowserstack(page, testInfo, statusReason);
    await page.close();
  };

  public createPageInstance = async () => {
    let page: any;
    const args = process.env.npm_lifecycle_script;
    if (args?.includes('BrowserstackMobile')) {
      page = await this.launchBrowserstackMobileBrowser();
    } else if (args?.includes('BrowserstackWeb')) {
      page = await this.launchBrowserstackWebBrowser();
    } else {
      page = await this.launchLocalBrowser();
    }
    return page;
  };

  public launchBrowserstackMobileBrowser = async () => {
    const projects: any = config.projects?.filter((project) => project.name === 'BrowserstackMobile');
    const wsEndpoint: string = projects[0].use.connectOptions?.wsEndpoint;
    const device = await _android.connect(wsEndpoint);
    await device.shell('am force-stop com.android.chrome');
    const context = await device.launchBrowser();
    const page = await context.newPage();
    return page;
  };

  public launchBrowserstackWebBrowser = async () => {
    let bsLocalArgs;
    console.log('Browser Stack Local Mode is: ', process.env.browserStackLocalMode);
    if (process.env.browserStackLocalMode === 'true') {
      if (process.env.useBrowserStackProxy === 'true') {
        console.log('Starting making connecting from Jenkins to BrowserStack');
        bsLocalArgs = {
          key: process.env.browserstackPassword,
          proxyHost: process.env.jenkinsProxyHost,
          proxyPort: process.env.jenkinsProxyPort,
          binarypath: process.env.jenkinsBinaryPath,
          force: true,
          verbose: 1,
          forceLocal: true,
          forceProxy: true,
        };
      } else {
        bsLocalArgs = {
          key: process.env.browserstackPassword,
          force: true,
        };
      }
      bsLocal.start(bsLocalArgs, () => {
        console.log('Started BrowserStackLocal');
        // check if BrowserStack local instance is running
        console.log(bsLocal.isRunning());
      });
    }

    //waiting few seconds to make sure connection to browserstack is successful before launching the browser
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const browser = await webkit.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    return page;
  };

  public launchLocalBrowser = async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    return page;
  };
}
