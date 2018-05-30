import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

const operatorOptions = [
  {
    key: '',
    value: '',
    text: '',
  },
  {
    key: '>',
    value: '>',
    text: 'Greater Than',
  },
  {
    key: '<',
    value: '<',
    text: 'Less Than',
  },
  {
    key: '==',
    value: '==',
    text: 'Equal',
  },
  {
    key: '!==',
    value: '!==',
    text: 'Different',
  },
];
const joinOperators = [
  {
    key: '',
    value: '',
    text: '',
  },
  {
    key: 'and',
    value: 'and',
    text: 'And',
  },
  {
    key: 'or',
    value: 'or',
    text: 'Or',
  },
];

let ValidationLogicNumericForm = ({ handleSubmit, onCancel, joinOperator }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Field Validation</Heading>
    <Fields.Select
      name="firstOperator"
      label="First Operator"
      options={operatorOptions.map(({ key, value, text }) => ({
        key,
        value,
        text,
      }))}
    />

    <Fields.Text name="firstValue" label="First Value" />
    <Fields.Select
      name="joinOperator"
      label="Add second condition"
      options={joinOperators.map(({ key, value, text }) => ({
        key,
        value,
        text,
      }))}
    />
    {joinOperator && (
      <div>
        <Fields.Select
          name="secondOperator"
          label="Second Operator"
          options={operatorOptions.map(({ key, value, text }) => ({
            key,
            value,
            text,
          }))}
        />
        <Fields.Text name="secondValue" label="Second Value" />
      </div>
    )}
    <Buttons
      actions={[
        {
          content: 'Save',
          type: 'submit',
          onClick: () => {},
        },
        {
          content: 'Cancel',
          onClick: onCancel,
          type: 'button',
        },
      ]}
    />
  </Form>
);
ValidationLogicNumericForm.propTypes = {
  joinOperator: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

ValidationLogicNumericForm.defaultProps = {
  joinOperator: '',
};

ValidationLogicNumericForm = connect((state) => {
  const selector = formValueSelector('validation-logic-numeric-form');
  const joinOperator = selector(state, 'joinOperator');
  return {
    joinOperator,
  };
})(ValidationLogicNumericForm);

export default reduxForm({
  enableReinitialize: true,
  form: 'validation-logic-numeric-form',
})(ValidationLogicNumericForm);
