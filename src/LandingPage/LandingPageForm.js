import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const LandingPageForm = ({ handleSubmit, onCancel, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Update landing page</Heading>
    <Fields.TextArea name="title" required />
    <Fields.TextArea name="heading" required label="Heading" />
    <Fields.TextArea name="text" required />

    <Buttons
      actions={[
        {
          content: 'Update',
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

LandingPageForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
  form: 'landing-page-form',
})(LandingPageForm);
