/* eslint-disable import/no-extraneous-dependencies */
const { client } = require('nightwatch-cucumber');
const { Given, Then, When } = require('cucumber');
const { createNestedSelector } = require('../src/helpers/nested-selector');

const pages = {
  homepage: `${client.launch_url}/#/examples`,
};
const defaultWaitTime = 5000;

Given(/^I (?:browse|open|visit).*? `(.*?)`$/, pageName => client.url(pages[pageName]));

Then(/^I (?:wait).*? to (?:find|identify|see|spot).*? (`.*`).*?$/, selectorChain =>
  client.useCss().waitForElementVisible(createNestedSelector(selectorChain), defaultWaitTime),
);

Then(
  /^I (?:find|identify|see|spot).*? (`.*`).*?$/,
  selectorChain =>
    client.useCss().expect.element(createNestedSelector(selectorChain)).to.be.visible,
);

Then(
  /^I (?:can|don)'t (?:find|identify|see|spot).*? (`.*`).*?$/,
  selectorChain =>
    client.useCss().expect.element(createNestedSelector(selectorChain)).to.not.be.visible,
);

When(/^I (?:enter|input|supply|type).*? "(.*?)" in.*? (`.*`)$/, (value, selectorChain) =>
  client
    .useCss()
    .waitForElementVisible(createNestedSelector(selectorChain), defaultWaitTime)
    .setValue(createNestedSelector(selectorChain), value),
);

When(/^I (?:check).*? (`.*`) not empty$/, value =>
  client.useCss().getText(createNestedSelector(value), (result) => {
    this.assert.notEqual('', result.value);
  }),
);

When(/^I (?:activate|click).*? (`.*`)$/, selectorChain =>
  client
    .useCss()
    .waitForElementVisible(createNestedSelector(selectorChain), defaultWaitTime)
    .click(createNestedSelector(selectorChain)),
);
