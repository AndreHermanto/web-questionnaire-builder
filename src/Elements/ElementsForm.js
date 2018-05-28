import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons, Helpers } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { fromJS } from 'immutable';
import cuid from 'cuid';
import { connect } from 'react-redux';

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
        'weight',
        'height',
        'date',
        'number',
        'matrix',
        'uom',
        'uoms',
      ].map(value => ({
        key: value,
        value,
        text: Helpers.renderLabel(value),
      }))}
      required
      onChange={(event, newValue) => {
        change('answers', getAnswers(newValue));
      }}
    />
    {type !== 'textinformation' && (
      <Fields.Array
        name="answers"
        header="Answers"
        components={<Fields.Text name="text" label="Text" required />}
      />
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
