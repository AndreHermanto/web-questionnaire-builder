import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const QuestionnaireElementReOrderForm = ({ handleSubmit, onCancel, questionOptions }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Element Re Order</Heading>
    <Fields.Select name="index" label="Index" options={questionOptions} required />
    <Fields.Radio
      name="position"
      label="Position"
      options={[
        { key: 'AFTER', text: 'After', value: 1 },
        { key: 'BEFORE', text: 'Before', value: 0 },
      ]}
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
QuestionnaireElementReOrderForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  questionOptions: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(QuestionnaireElementReOrderForm);
