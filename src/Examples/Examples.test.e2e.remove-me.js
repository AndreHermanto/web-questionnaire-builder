// import fetch from 'isomorphic-fetch';
import { jwt, appUrl, getNewPage, closePage } from '../e2e/Browser';
import {
  timeout,
  typeInField,
  findElementWithText,
  waitForSidePanelClosed,
  goto,
  clickLinkWithText,
  clickButtonWithText,
  clickLinkInTable,
  selectDropdownWithFieldAndText,
  clearTextField,
} from '../e2e';

let page;

beforeAll(async () => {
  page = await getNewPage();
});
afterAll(() => {
  closePage(page);
});

describe('CRUD for invitation', () => {
  beforeAll(async () => {
    // wait for app to load
    await goto(page, `${appUrl}/?jwt=${jwt}`);
    await page.waitForSelector('h1');
  });

  it(
    'create Example',
    async () => {
      // setup
      // need at least 2 patients for this to pass
      const title = `Example${new Date().getTime()}`;
      await goto(page, `${appUrl}/examples`);

      await clickLinkWithText(page, 'Add Example');

      await typeInField(page, 'title', title);
      await typeInField(page, 'age', '1');
      await selectDropdownWithFieldAndText(page, 'category', 'Patient');

      await clickButtonWithText(page, 'Create Example');
      await waitForSidePanelClosed(page);

      // results
      expect(await findElementWithText(page, title)).toBeTruthy();
      await clickLinkWithText(page, 'archiveExample');
      await page.waitForSelector('h1');
      expect(await findElementWithText(page, title)).toBeTruthy();
    },
    timeout * 500,
  );

  it(
    'update Example',
    async () => {
      await goto(page, `${appUrl}/examples`);

      const title = `Example${new Date().getTime()}`;
      await clickLinkInTable(page, 0);
      await clickLinkWithText(page, 'Edit');

      await clearTextField(page, 'title');
      await typeInField(page, 'title', title);
      await clickButtonWithText(page, 'Update Example');
      await waitForSidePanelClosed(page);

      expect(await findElementWithText(page, title)).toBeTruthy();
    },
    timeout,
  );

  it(
    'deletes an Example',
    async () => {
      // setup
      // requires at least 1 invitation to exist
      await goto(page, `${appUrl}/examples`);

      // change the name
      const exampleName = await clickLinkInTable(page, 0);
      await clickLinkWithText(page, 'Delete');
      await clickButtonWithText(page, 'Yes, Delete Example');
      await waitForSidePanelClosed(page);
      expect(await findElementWithText(page, exampleName)).toBeUndefined();
    },
    timeout,
  );
});
