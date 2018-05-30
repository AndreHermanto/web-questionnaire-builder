export const buildValidationLogicFromForm = (property, values) => {
  const { joinOperator, firstOperator, firstValue, secondOperator, secondValue } = values;
  const firstPart = { [firstOperator]: [{ var: property }, firstValue] };
  if (!joinOperator) {
    return firstPart;
  }
  const secondPart = { [secondOperator]: [{ var: property }, secondValue] };
  return {
    [joinOperator]: [firstPart, secondPart],
  };
};

export const convertRegexValidationLogicToForm = validationLogic => ({
  regex: validationLogic.regex[1],
});

export const convertJsonLogicToText = (value) => {
  if (typeof value === 'object') {
    const key = Object.keys(value)[0];
    if (key === 'var') {
      return `a ${value[key]} value`;
    }
    const label = {
      '>': 'greater than',
      '<': 'less than',
      '==': 'equal',
      '!==': 'does not equal',
      and: 'and,',
      or: 'or',
    };
    return value[key].map(convertJsonLogicToText).join(` ${label[key]} `);
  }
  return value;
};

export const convertNumericValidationLogicToForm = (validationLogic) => {
  const keys = Object.keys(validationLogic);
  const firstKey = keys[0];
  let joinOperator;
  let firstOperator;
  let firstValue;
  if (firstKey === 'and' || firstKey === 'or') {
    joinOperator = firstKey;
  }
  if (!joinOperator) {
    firstOperator = firstKey;
    firstValue = validationLogic[firstOperator][1];
    const returnValue = {
      firstOperator,
      firstValue,
    };
    return returnValue;
  }
  const values = validationLogic[firstKey];
  const firstPart = values[0];
  const secondPart = values[1];
  firstOperator = Object.keys(firstPart)[0];
  const secondOperator = Object.keys(secondPart)[0];
  firstValue = firstPart[firstOperator][1];
  const secondValue = secondPart[secondOperator][1];
  return {
    joinOperator,
    firstOperator,
    firstValue,
    secondOperator,
    secondValue,
  };
};

export const buildTextValidationLogicFromForm = (type, regex) => ({
  regex: [{ var: type }, regex],
});
