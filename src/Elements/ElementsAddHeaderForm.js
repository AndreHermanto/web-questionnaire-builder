import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const ElementsAddHeaderForm = ({ handleSubmit, onCancel }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Element Header</Heading>
    <Fields.Text name="title" label="Title" required />
    <Fields.Select
      name="size"
      options={['1', '2', '3'].map(value => ({
        key: value,
        value,
        text: `Heading ${value}`,
      }))}
      required
    />
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
ElementsAddHeaderForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(ElementsAddHeaderForm);
