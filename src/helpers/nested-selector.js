const prefixRegEx = /` in.*? (`.*`)/;

const parseSelectorChain = selectorChain =>
  selectorChain.split('` `').map(x => x.replace(/`/g, ''));

const extractPrefixSelectors = (selectorChain) => {
  const prefixMatch = selectorChain.match(prefixRegEx);

  return prefixMatch ? parseSelectorChain(prefixMatch[1]) : [];
};

const createNestedSelector = (selectorChain) => {
  const prefixSelectors = extractPrefixSelectors(selectorChain);
  const selectors = parseSelectorChain(selectorChain.replace(prefixRegEx, '`'));

  return prefixSelectors
    .concat(selectors)
    .map(x => `[data-test="${x.replace(/`/g, '')}"]`)
    .join(' ');
};

module.exports = {
  parseSelectorChain,
  extractPrefixSelectors,
  createNestedSelector,
};
