import fetch from 'isomorphic-fetch';
import { jwt, appUrl, getNewPage, closePage } from '../../e2e/Browser';

let page;

beforeAll(async () => {
  page = await getNewPage();
});

afterAll(() => {
  closePage(page);
});

let folders = [];
let questionnaires = [];
const baseUrl = 'http://localhost:4000';

describe('Questionnaire Create Edit Delete', () => {
  beforeAll(async () => {
    await page.goto(`${appUrl}/?jwt=${jwt}`);
    await page.waitForSelector('h1');
  });

  it(
    'Create Folder',
    async () => {
      const title = 'e2e folder';
      await page.waitForSelector('a[href="#/folders/create"]');
      await page.click('a[href="#/folders/create"]');
      await page.type('input[name=title]', title, { delay: 1 });
      await page.click('button[type=submit]');

      const response = await fetch(`${baseUrl}/folders`, {
        headers: { jwt },
      });
      const { data } = await response.json();
      folders = data;

      expect(folders[folders.length - 1].title).toBe(title);
    },
    16000,
  );

  it(
    'Create Questionnaire',
    async () => {
      const currentTitle = 'e2e questionnaire';
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
    'Move Questionnaire to Folder',
    async () => {
      const response = await fetch(`${baseUrl}/questionnaires?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      const jsonObj = await response.json();
      const results = jsonObj.data;
      questionnaires = results;

      await page.waitForSelector(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}/versions/${
          questionnaires[questionnaires.length - 1].currentVersionId
        }/move-to-folder']`,
      );
      await page.click(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}/versions/${
          questionnaires[questionnaires.length - 1].currentVersionId
        }/move-to-folder']`,
      );
      await page.waitForSelector('#folder');
      await page.click('#folder');
      await page.waitForSelector('div#folder > div.visible.menu.transition > div.item:last-child');
      await page.click('div#folder > div.visible.menu.transition > div.item:last-child');
      await page.click('button[type=submit]');
    },
    16000,
  );

  it(
    'Move Questionnaire to Home',
    async () => {
      const response = await fetch(`${baseUrl}/questionnaires?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      const jsonObj = await response.json();
      const results = jsonObj.data;
      questionnaires = results;

      await page.waitForSelector(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}/versions/${
          questionnaires[questionnaires.length - 1].currentVersionId
        }/move-to-folder']`,
      );
      await page.click(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}/versions/${
          questionnaires[questionnaires.length - 1].currentVersionId
        }/move-to-folder']`,
      );
      await page.waitForSelector('#folder');
      await page.click('#folder');
      await page.waitForSelector('div#folder > div.visible.menu.transition > div.item:first-child');
      await page.click('div#folder > div.visible.menu.transition > div.item:first-child');
      await page.click('button[type=submit]');
    },
    16000,
  );

  it(
    'Delete Folder',
    async () => {
      let response = await fetch(`${baseUrl}/folders?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      let jsonObj = await response.json();
      let results = jsonObj.data;
      folders = results;
      await page.waitForSelector('a[href="#/questionnaires"]');
      await page.click('a[href="#/questionnaires"]');
      await page.click(`a[href='#/folders/${folders[folders.length - 1].id}']`);
      await page.waitForSelector(`a[href='#/folders/${folders[folders.length - 1].id}/delete']`);
      await page.click(`a[href='#/folders/${folders[folders.length - 1].id}/delete']`);
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1');

      response = await fetch(`${baseUrl}/folders?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      jsonObj = await response.json();
      results = jsonObj.data;
      const newFolders = results;

      expect(newFolders.length).toEqual(folders.length - 1);
      expect(
        newFolders.filter(newFolder => newFolder.id === folders[folders.length - 1].id),
      ).toEqual([]);
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

      await page.waitForSelector(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}']`,
      );
      await page.click(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}']`,
      );
      await page.waitForSelector(
        `a[href='#/questionnaires/${questionnaires[questionnaires.length - 1].id}/delete']`,
      );
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
