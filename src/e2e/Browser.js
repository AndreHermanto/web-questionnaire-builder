/* eslint-disable import/no-extraneous-dependencies */
import puppeteer from 'puppeteer';

let browser;
const width = 1440;
const height = 900;

export const jwt = '1234';
export const appUrl = 'http://localhost:3000/#';

const getNewPage = async () => {
  if (browser) {
    const page = await browser.newPage();
    page.setViewport({ width, height });
  }
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: [`--window-size=${width},${height}`],
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  return page;
};

const closePage = async (page) => {
  await page.close();
  setTimeout(async () => {
    const pages = await browser.pages();
    if (pages.length === 1 && pages[0].url() === 'about:blank') {
      await browser.close();
      browser = null;
    }
  }, 1000);
};

export { getNewPage, closePage };
