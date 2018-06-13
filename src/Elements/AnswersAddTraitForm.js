import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const AnswersAddTraitForm = ({ handleSubmit, onCancel, answerId, initialValues }) => {
  const answerIndex = initialValues
    .get('answers')
    .findIndex(answer => answer.get('id') === answerId);
  return (
    <Form onSubmit={handleSubmit}>
      <Heading size="h1">Answer Trait</Heading>
      <Fields.Text label="Trait Data" name={`answers.${answerIndex}.traitData`} required />

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
};
AnswersAddTraitForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    answers: PropTypes.arrayOf({
      id: PropTypes.string.isRequired,
      traitData: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  answerId: PropTypes.string.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
  form: 'answers-trait-form',
})(AnswersAddTraitForm);
