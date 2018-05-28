import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';
import { fromJS } from 'immutable';
import cuid from 'cuid';

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

const ElementsForm = ({ handleSubmit, onCancel, change }) => (
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
        text: value,
      }))}
      required
      onChange={(event, newValue) => {
        change('answers', getAnswers(newValue));
      }}
    />

    <Fields.Array
      name="answers"
      header="Answers"
      components={<Fields.Text name="text" label="Text" required />}
    />
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
ElementsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(ElementsForm);
