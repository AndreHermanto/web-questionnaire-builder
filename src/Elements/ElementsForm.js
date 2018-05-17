import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const ElementsForm = ({ handleSubmit, onCancel }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Elements</Heading>
    <Fields.Text name="question" required />
    <Fields.Select
      name="type"
      options={['RADIO', 'CHECKBOX', 'TEXT'].map(value => ({
        key: value,
        value,
        text: value,
      }))}
      required
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
};

export default reduxForm({
  enableReinitialize: true,
})(ElementsForm);
