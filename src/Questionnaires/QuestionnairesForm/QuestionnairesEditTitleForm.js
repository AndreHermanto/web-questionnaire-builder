import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const QuestionnairesEditTitleForm = ({ handleSubmit, onCancel }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Edit Questionnaire</Heading>
    <Fields.Text name="title" required />

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
QuestionnairesEditTitleForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
  form: 'questionnaires-edit-title-form',
})(QuestionnairesEditTitleForm);
