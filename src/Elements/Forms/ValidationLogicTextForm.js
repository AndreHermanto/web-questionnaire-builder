import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const ValidationLogicTextForm = ({ handleSubmit, onCancel }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Field Validation</Heading>
    <Fields.Text name="regex" label="Regex" />

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
ValidationLogicTextForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
  form: 'validation-logic-text-form',
})(ValidationLogicTextForm);
