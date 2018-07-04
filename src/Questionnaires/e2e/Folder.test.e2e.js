import fetch from 'isomorphic-fetch';
import cuid from 'cuid';
import { jwt, appUrl, getNewPage, closePage } from '../../e2e/Browser';

let page;

beforeAll(async () => {
  page = await getNewPage();
});

afterAll(() => {
  closePage(page);
});

const folderTitle = `e2e folder ${cuid()}`;
const questionnaireTitle = `e2e questionnaire ${cuid()}`;
const baseUrl = 'http://localhost:4000';

describe('Questionnaire Create Edit Delete', () => {
  beforeAll(async () => {
    await page.goto(`${appUrl}/?jwt=${jwt}`);
    await page.waitForSelector('h1');
  });

  it(
    'Create Folder',
    async () => {
      await page.waitForSelector('a[href="#/folders/create"]');
      await page.click('a[href="#/folders/create"]');
      await page.type('input[name=title]', folderTitle, { delay: 1 });
      await page.click('button[type=submit]');

      const response = await fetch(`${baseUrl}/folders`, {
        headers: { jwt },
      });
      const { data: folders } = await response.json();

      expect(!!folders.find(f => f.title === folderTitle)).toBe(true);
    },
    16000,
  );

  it(
    'Create Questionnaire',
    async () => {
      await page.waitForSelector('a[href="#/questionnaires/create"]');
      await page.click('a[href="#/questionnaires/create"]');
      await page.type('input[name=currentTitle]', questionnaireTitle, { delay: 1 });
      await page.click('button[type=submit]');

      const response = await fetch(`${baseUrl}/questionnaires`, {
        headers: { jwt },
      });
      const { data: questionnaires } = await response.json();
      expect(!!questionnaires.find(q => q.currentTitle === questionnaireTitle)).toBe(true);
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
      const questionnaires = jsonObj.data;
      const questionnaire = questionnaires.find(q => q.currentTitle === questionnaireTitle);

      await page.waitForSelector(
        `a[href='#/questionnaires/${questionnaire.id}/versions/${
          questionnaire.currentVersionId
        }/move-to-folder']`,
      );
      await page.click(
        `a[href='#/questionnaires/${questionnaire.id}/versions/${
          questionnaire.currentVersionId
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
      const questionnaires = jsonObj.data;
      const questionnaire = questionnaires.find(q => q.currentTitle === questionnaireTitle);

      await page.waitForSelector(
        `a[href='#/questionnaires/${questionnaire.id}/versions/${
          questionnaire.currentVersionId
        }/move-to-folder']`,
      );
      await page.click(
        `a[href='#/questionnaires/${questionnaire.id}/versions/${
          questionnaire.currentVersionId
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
      const folders = jsonObj.data;
      const folder = folders.find(f => f.title === folderTitle);
      await page.waitForSelector('a[href="#/questionnaires"]');
      await page.click('a[href="#/questionnaires"]');
      await page.click(`a[href='#/folders/${folder.id}']`);
      await page.waitForSelector(`a[href='#/folders/${folder.id}/delete']`);
      await page.click(`a[href='#/folders/${folder.id}/delete']`);
      await page.waitForSelector('button[type="submit"]');
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1');

      response = await fetch(`${baseUrl}/folders?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      jsonObj = await response.json();
      const newFolders = jsonObj.data;

      expect(newFolders.length).toEqual(folders.length - 1);
      expect(newFolders.filter(newFolder => newFolder.id === folder.id)).toEqual([]);
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
      const questionnaires = jsonObj.data;
      const questionnaire = questionnaires.find(q => q.currentTitle === questionnaireTitle);

      await page.waitForSelector(`a[href='#/questionnaires/${questionnaire.id}']`);
      await page.click(`a[href='#/questionnaires/${questionnaire.id}']`);
      await page.waitForSelector(`a[href='#/questionnaires/${questionnaire.id}/delete']`);
      await page.click(`a[href='#/questionnaires/${questionnaire.id}/delete']`);
      await page.waitForSelector('button[type="submit"]');
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1');

      response = await fetch(`${baseUrl}/questionnaires?page=1&itemsPerPage=10`, {
        headers: { jwt },
      });
      jsonObj = await response.json();
      const newQuestionnaires = jsonObj.data;

      expect(newQuestionnaires.length).toEqual(questionnaires.length - 1);
      expect(
        newQuestionnaires.filter(newQuestionnaire => newQuestionnaire.id === questionnaire.id),
      ).toEqual([]);
    },
    16000,
  );
});
