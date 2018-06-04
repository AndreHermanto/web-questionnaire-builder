import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

/* eslint "react/require-default-props": "off" */

const AnswersFollowUpForm = ({ handleSubmit, onCancel, initialValues, answerId, submitting }) => {
  const answerIndex = initialValues
    .get('answers')
    .findIndex(answer => answer.get('id') === answerId);
  return (
    <Form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <Heading size="h1">Follow Up Question</Heading>
      <Fields.Text
        name={`answers.${answerIndex}.followUp.question`}
        label={'Follow Up Question'}
        required
      />

      <Buttons
        actions={[
          {
            content: 'Create',
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
};
AnswersFollowUpForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  answerId: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    answers: PropTypes.arrayOf({
      id: PropTypes.string.isRequired,
      followUp: PropTypes.shape({
        question: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(AnswersFollowUpForm);
