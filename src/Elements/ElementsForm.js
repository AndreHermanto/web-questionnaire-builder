import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons, Helpers } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { fromJS } from 'immutable';
import cuid from 'cuid';
import { connect } from 'react-redux';
import Uomfields from './Fields/Uomfields';

const getAnswers = (type) => {
  switch (type) {
    case 'matrix':
    case 'radio':
    case 'checkbox':
    case 'text':
    case 'weight':
    case 'height':
    case 'date':
    case 'number':
      return fromJS([
        {
          id: cuid(),
          text: '',
          concepts: [],
        },
      ]);
    case 'uom':
      return fromJS([
        {
          id: cuid(),
          uom1: {},
          concepts: [],
        },
      ]);
    case 'uoms':
      return fromJS([
        {
          id: cuid(),
          uom1: {},
          uom2: {},
          concepts: [],
        },
      ]);
    default:
      return [];
  }
};

const showAnswers = type => type === 'radio' || type === 'checkbox' || type === 'matrix';
let ElementsForm = ({ handleSubmit, onCancel, type, change }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Elements</Heading>
    <Fields.Text name="question" required />
    <Fields.Select
      name="type"
      options={[
        'radio',
        'checkbox',
        'text',
        'textinformation',
        'weight',
        'height',
        'date',
        'number',
        'matrix',
        'uom',
        'uoms',
      ].map((value) => {
        if (value === 'text') {
          return {
            key: value,
            value,
            text: Helpers.renderLabel('questionType.text'),
          };
        }
        return {
          key: value,
          value,
          text: Helpers.renderLabel(value),
        };
      })}
      required
      onChange={(event, newValue) => {
        change('answers', getAnswers(newValue));
      }}
    />
    {showAnswers(type) && (
      <Fields.Array
        name="answers"
        header="Answers"
        components={<Fields.Text name="text" label="Text" required />}
      />
    )}

    {type === 'uom' && <Uomfields name="uom1" change={change} label="Unit of Measurement 1" />}
    {type === 'uoms' && (
      <div>
        <Uomfields name="uom1" change={change} label="Unit of Measurement 1" />
        <Uomfields name="uom2" change={change} label="Unit of Measurement 2" />
      </div>
    )}
    <Buttons
      actions={[
        {
          content: 'Save',
          type: 'submit',
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
ElementsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  type: PropTypes.string,
};

ElementsForm.defaultProps = {
  type: null,
};

ElementsForm = connect((state) => {
  const selector = formValueSelector('elements-form');
  const type = selector(state, 'type');
  return {
    type,
  };
})(ElementsForm);

export default reduxForm({
  enableReinitialize: true,
})(ElementsForm);
