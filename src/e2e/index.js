export const timeout = 16000;
export const typeInField = (myPage, fieldName, text) =>
  myPage.type(`input[name=${fieldName}]`, text);
export const findLinkWithText = async (myPage, text) =>
  (await myPage.$x(`//a[contains(., "${text}")]`))[0];
export const findButtonWithText = async (myPage, text) =>
  (await myPage.$x(`//button[contains(text(), "${text}")]`))[0];
export const findElementWithText = async (myPage, text) =>
  (await myPage.$x(`//*[contains(text(), "${text}")]`))[0];
export const waitForSidePanelClosed = myPage =>
  myPage.waitFor(() => !document.querySelector('.ui.right.corner'));
export const goto = async (myPage, url) => {
  await myPage.goto(url);
  return myPage.waitForSelector('h1');
};

export const findUncheckedCheckboxesWithField = async (myPage, fieldName) => {
  const checkboxes = await myPage.$x(
    `//div[not(contains(@class, "checked")) and input[contains(@name, "${fieldName}")]]`,
  );
  // return the name of what we clicked
  const labels = checkboxes.map(checkbox => myPage.evaluate(div => div.textContent, checkbox));
  return Promise.all(labels);
};

export const selectCheckboxWithField = async (myPage, fieldName, index) => {
  const checkboxDiv = (await myPage.$x(
    `//div[not(contains(@class, "checked")) and input[contains(@name, "${fieldName}")]]`,
  ))[index >= 0 ? index : 0];
  // click it
  await checkboxDiv.click();
  // return the name of what we clicked
  return myPage.evaluate(div => div.textContent, checkboxDiv);
};

export const clickLinkInTable = async (myPage, index) => {
  const link = (await myPage.$x('//table//td/a'))[index >= 0 ? index : 0];
  // get out name of what we clicked
  const text = await myPage.evaluate(a => a.textContent, link);
  const navigationPromise = myPage.waitForNavigation({
    waitUntil: 'networkidle2',
  });
  // click it
  await link.click();
  await navigationPromise;
  // return the name of what we clicked
  return text;
};

export const clearTextField = async (myPage, fieldName) => {
  const elementHandle = await myPage.$(`[name="${fieldName}"`);
  await elementHandle.click();
  await elementHandle.focus();
  // click three times to select all
  await elementHandle.click({ clickCount: 3 });
  await elementHandle.press('Backspace');
};
export const clickLinkWithText = async (myPage, text) => {
  const navigationPromise = myPage.waitForNavigation({
    waitUntil: 'networkidle0',
  });
  const link = await findLinkWithText(myPage, text);
  if (!link) {
    throw new Error(`Couldnt find link with text ${text}`);
  }
  await link.click();
  return navigationPromise;
};
export const clickButtonWithText = async (myPage, text) => {
  const navigationPromise = myPage.waitForNavigation({
    waitUntil: 'networkidle0',
  });
  const button = await findButtonWithText(myPage, text);
  if (!button) {
    throw new Error(`Couldnt find button with text ${text}`);
  }
  await button.click();
  return navigationPromise;
};

// get out the text value, of something
// in a definition list
export const readTextInDefinitionList = async (myPage, keyText) => {
  const valueElement = (await myPage.$x(`//tr[contains(., "${keyText}")]/td[2]`))[0];
  // return the name of what we clicked
  return myPage.evaluate(div => div.textContent, valueElement);
};
