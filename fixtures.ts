//This Fixture Will Create the Page Instance For Both Local and Browserstack Execution
//Import this Fixture into your Test instead from @playwright/test and use the Page Instance created here

import { CommonHelper } from '../../main/helpers/commons';
import { test as base, Page } from '@playwright/test';
const commons = new CommonHelper();
let page: Page;

export const test = base.extend<{}>({
  page: async ({}, use) => {
    page = await commons.createPageInstance();
    await use(page);
  },
});

// Define beforeEach and afterEach hooks
test.beforeEach(async ({}, testInfo) => {
  await commons.beforeEachHook(testInfo);
});

test.afterEach(async ({}, testInfo) => {
  await commons.afterEachHook(page, testInfo);
});
