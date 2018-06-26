import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment } from 'semantic-ui-react';
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

const renderValidationFields = (prefix, joinOperator, title) => (
  <Segment>
    <Heading size="h1">{title}</Heading>
    <Fields.Select
      name={`${prefix}.firstOperator`}
      label="First Operator"
      options={operatorOptions.map(({ key, value, text }) => ({
        key,
        value,
        text,
      }))}
    />

    <Fields.Text name={`${prefix}.firstValue`} label="First Value" />
    <Fields.Select
      name={`${prefix}.joinOperator`}
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
          name={`${prefix}.secondOperator`}
          label="Second Operator"
          options={operatorOptions.map(({ key, value, text }) => ({
            key,
            value,
            text,
          }))}
        />
        <Fields.Text name={`${prefix}.secondValue`} label="Second Value" />
      </div>
    )}
  </Segment>
);

let ValidationLogicNumericForm = ({
  handleSubmit,
  onCancel,
  uom1JoinOperator,
  uom2JoinOperator,
}) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Field Validation</Heading>
    {renderValidationFields('uom1', uom1JoinOperator, 'First Unit of Measurement')}
    {renderValidationFields('uom2', uom2JoinOperator, 'Second Unit of Measurement')}
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
  uom1JoinOperator: PropTypes.string,
  uom2JoinOperator: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

ValidationLogicNumericForm.defaultProps = {
  uom1JoinOperator: '',
  uom2JoinOperator: '',
};

ValidationLogicNumericForm = connect((state) => {
  const selector = formValueSelector('validation-logic-uoms-form');
  const uom1JoinOperator = selector(state, 'uom1.joinOperator');
  const uom2JoinOperator = selector(state, 'uom2.joinOperator');

  return {
    uom1JoinOperator,
    uom2JoinOperator,
  };
})(ValidationLogicNumericForm);

export default reduxForm({
  enableReinitialize: true,
  form: 'validation-logic-uoms-form',
})(ValidationLogicNumericForm);
