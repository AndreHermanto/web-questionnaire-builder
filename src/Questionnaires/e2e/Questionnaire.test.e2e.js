import fetch from 'isomorphic-fetch';
import { jwt, appUrl, getNewPage, closePage } from '../../e2e/Browser';

let page;

beforeAll(async () => {
  page = await getNewPage();
});
afterAll(() => {
  closePage(page);
});

let questionnaires = [];
let questionnaire = {};
const baseUrl = 'http://localhost:4000';

describe('Questionnaires List', () => {
  beforeAll(async () => {
    // call backend to get questionnairessr
    const response = await fetch(`${baseUrl}/questionnaires`, { headers: { jwt } });
    const { data: results } = await response.json();
    questionnaires = results;

    // now we have the questionnaires we expect to see
    await page.goto(`${appUrl}/?jwt=${jwt}`);
    await page.waitForSelector('h1');
  });
  it('api returned data', () => {
    expect(!!questionnaires.length).toBe(true);
  });
  it(
    'Heading is "Questionnaires"',
    async () => {
      const mainTitleText = await page.$eval('h1', el => el.textContent);
      expect(mainTitleText).toEqual('Questionnaires');
    },
    16000,
  );
  it(
    'Lists the questionnaires in a table',
    async () => {
      const table = await page.$eval('table', el => !!el);
      expect(table).toBe(true);
    },
    16000,
  );
  it(
    'Selects first one',
    async () => {
      const linkHandler = (await page.$x(
        `//a[@href="#/questionnaires/${questionnaires[0].id}"]`,
      ))[0];
      expect(!!linkHandler).toBe(true);
      await linkHandler.click();
      await page.waitForSelector('h1');
    },
    16000,
  );
  it('Fetches selected questionnaire version api data', async () => {
    const response = await fetch(
      `${baseUrl}/questionnaires/${questionnaires[0].id}/versions/${
        questionnaires[0].currentVersionId
      }`,
      { headers: { jwt } },
    );
    const { data } = await response.json();
    questionnaire = data;
    expect(questionnaire.id).toBe(questionnaires[0].currentVersionId);
  });
  it('Shows questionnaire version in key-value table', async () => {
    // check that the heading matches on the new page
    const mainTitleText = (await page.$eval('h1', el => el.textContent)).replace('...', '');
    const isTitle = questionnaire.title.includes(mainTitleText);
    expect(isTitle).toEqual(true);
    expect(page.url().indexOf(questionnaires[0].id) >= 0).toBe(true);
  });
});

describe('Questionnaire Create Edit Delete', () => {
  beforeAll(async () => {
    await page.goto(`${appUrl}/?jwt=${jwt}`);
    await page.waitForSelector('h1');
  });
  it(
    'Create Questionnaire',
    async () => {
      const currentTitle = 'e2e';
      await page.waitForSelector('a[href="#/questionnaires/create"]');
      await page.click('a[href="#/questionnaires/create"]');
      await page.type('input[name=currentTitle]', currentTitle, { delay: 1 });
      await page.click('button[type=submit]');

      const response = await fetch(`${baseUrl}/questionnaires`, {
        headers: { jwt },
      });
      const { data } = await response.json();
      questionnaires = data;

      expect(questionnaires[questionnaires.length - 1].currentTitle).toBe(currentTitle);
    },
    16000,
  );
  it(
    'Edit Questionnaire',
    async () => {
      let response = await fetch(`${baseUrl}/questionnaires?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      let jsonObj = await response.json();
      let results = jsonObj.data;
      questionnaires = results;

      await page.waitForSelector(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}/versions/${
          questionnaires[questionnaires.length - 1].currentVersionId
        }/edit-title']`,
      );
      await page.click(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}/versions/${
          questionnaires[questionnaires.length - 1].currentVersionId
        }/edit-title']`,
      );
      await page.type('input[name=title]', ' updated', { delay: 1 });
      await page.click('button[type=submit]');
      await page.waitForSelector(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}/versions/${
          questionnaires[questionnaires.length - 1].currentVersionId
        }/edit-title']`,
      );

      response = await fetch(`${baseUrl}/questionnaires?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      jsonObj = await response.json();
      results = jsonObj.data;
      questionnaires = results;

      expect(questionnaires[questionnaires.length - 1].currentTitle).toBe('e2e updated');
    },
    16000,
  );
  it(
    'Delete questionnaire',
    async () => {
      let response = await fetch(`${baseUrl}/questionnaires?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      let jsonObj = await response.json();
      let results = jsonObj.data;
      questionnaires = results;

      await page.click(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}/delete']`,
      );
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1');

      response = await fetch(`${baseUrl}/questionnaires?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      jsonObj = await response.json();
      results = jsonObj.data;
      const newQuestionnaires = results;

      expect(newQuestionnaires.length).toEqual(questionnaires.length - 1);
      expect(
        newQuestionnaires.filter(
          newQuestionnaire => newQuestionnaire.id === questionnaires[questionnaires.length - 1].id,
        ),
      ).toEqual([]);
    },
    16000,
  );
});
