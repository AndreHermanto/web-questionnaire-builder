import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const QuestionnairesExportForm = ({ handleSubmit, onCancel, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Export questionnaire</Heading>
    <Fields.TextArea name="yamlData" label="Questionnaire" required />
    <Buttons
      actions={[
        {
          content: 'Download',
          type: 'submit',
          disabled: submitting,
        },
        {
          content: 'Go back',
          onClick: onCancel,
          type: 'button',
        },
      ]}
    />
  </Form>
);

QuestionnairesExportForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(QuestionnairesExportForm);
