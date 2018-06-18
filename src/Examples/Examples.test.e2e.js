import puppeteer from 'puppeteer';
import fetch from 'isomorphic-fetch';

let page;
let browser;
const width = 1440;
const height = 900;

const jwt = '1234';
const appUrl = 'http://localhost:3000/#';
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    args: [`--window-size=${width},${height}`],
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});
afterAll(() => {
  browser.close();
});

let examples = [];
const baseUrl = 'http://localhost:4000';

describe('Example List', () => {
  beforeAll(async () => {
    // call backend to get examples
    const response = await fetch(`${baseUrl}/examples`, { headers: { jwt } });
    const { data: { results } } = await response.json();
    examples = results;

    // now we have the examples we expect to see
    await page.goto(`${appUrl}/?jwt=${jwt}`);
    await page.waitForSelector('h1');
  });
  it('api returned data', () => {
    expect(!!examples.length).toBe(true);
  });
  it(
    'Heading is "Examples"',
    async () => {
      const mainTitleText = await page.$eval('h1', el => el.textContent);
      expect(mainTitleText).toEqual('Examples');
    },
    16000,
  );
  it(
    'Lists the examples in a table',
    async () => {
      const table = await page.$eval('table', el => !!el);
      expect(table).toBe(true);
    },
    16000,
  );
  it(
    'displays a list of examples, where the first one Hello',
    async () => {
      const linkHandler = (await page.$x(`//a[contains(text(), "${examples[0].id}")]`))[0];
      expect(!!linkHandler).toBe(true);

      await linkHandler.click();
      await page.waitForSelector('h1');
      // check that the heading matches on the new page
      const mainTitleText = await page.$eval('h1', el => el.textContent);
      expect(mainTitleText).toEqual(examples[0].title);
      expect(page.url().indexOf(examples[0].id) >= 0).toBe(true);
    },
    16000,
  );
});

describe('Example Create Edit Delete', () => {
  beforeAll(async () => {
    await page.goto(`${appUrl}/?jwt=${jwt}`);
    await page.waitForSelector('h1');
  });
  it(
    'create example',
    async () => {
      await page.waitForSelector('[data-test=add-example-button]');
      await page.click('[data-test=add-example-button]');
      await page.type('input[name=title]', 'e2e', { delay: 1 });
      await page.type('input[name=age]', '10', { delay: 1 });
      await page.click('#category > i');
      await page.click('#category > div.visible.menu.transition > div.selected.item > span');
      await page.click('[data-test=submit-example-button]');

      const response = await fetch(`${baseUrl}/examples?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      const { data: { results } } = await response.json();
      examples = results;

      expect(examples[examples.length - 1].title).toBe('e2e');
    },
    16000,
  );
  it(
    'edit example',
    async () => {
      let response = await fetch(`${baseUrl}/examples?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      let jsonObj = await response.json();
      let results = jsonObj.data.results;
      examples = results;

      await page.click(`a[href='#/examples/${examples[examples.length - 1].id}']`);
      await page.click('[data-test=edit-example-button');
      await page.type('input[name=title]', ' updated', { delay: 1 });
      await page.click('[data-test=submit-example-button]');

      response = await fetch(`${baseUrl}/examples?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      jsonObj = await response.json();
      results = jsonObj.data.results;
      examples = results;

      expect(examples[examples.length - 1].title).toBe('e2e updated');
    },
    16000,
  );
  it(
    'delete example',
    async () => {
      let response = await fetch(`${baseUrl}/examples?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      let jsonObj = await response.json();
      let results = jsonObj.data.results;
      examples = results;

      await page.click('[data-test=delete-example-button');
      await page.click('button[type="submit"]');

      response = await fetch(`${baseUrl}/examples?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      jsonObj = await response.json();
      results = jsonObj.data.results;
      const newExamples = results;

      expect(newExamples.length).toEqual(examples.length - 1);
      expect(
        newExamples.filter(example => example.id === examples[examples.length - 1].id),
      ).toEqual([]);
    },
    16000,
  );
});
