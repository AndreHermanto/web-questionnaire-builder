import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const QuestionnairesCreateForm = ({ initialValues, handleSubmit, onCancel, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">{initialValues ? 'Update' : 'Create'} Questionnaire</Heading>
    <Fields.Text name="currentTitle" label="Title" required />

    <Buttons
      actions={[
        {
          content: initialValues ? 'Update' : 'Create',
          type: 'submit',
          disabled: submitting,
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

QuestionnairesCreateForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
};

QuestionnairesCreateForm.defaultProps = {
  initialValues: null,
};

export default reduxForm({
  enableReinitialize: true,
  form: 'landing-page-form',
})(QuestionnairesCreateForm);
