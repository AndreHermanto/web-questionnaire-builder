import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

/* eslint "react/require-default-props": "off" */

const AnswersFollowUpForm = ({ handleSubmit, onCancel }) => (
  <Form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
    <Heading size="h1">Follow Up Question</Heading>
    <Fields.Text name="question" required />

    <Buttons
      actions={[
        {
          content: 'Create',
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
AnswersFollowUpForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const form = 'answers-add-follow-up';
const selector = formValueSelector(form);

export default connect(state => ({
  question: selector(state, 'question'),
}))(
  reduxForm({
    enableReinitialize: true,
    form,
  })(AnswersFollowUpForm),
);
