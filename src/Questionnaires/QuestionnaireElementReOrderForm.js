import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const QuestionnaireElementReOrderForm = ({ handleSubmit, onCancel }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Element Re Order</Heading>
    <Fields.Number name="index" label="Index" required />
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
QuestionnaireElementReOrderForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(QuestionnaireElementReOrderForm);
