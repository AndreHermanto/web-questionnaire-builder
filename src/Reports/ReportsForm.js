import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

// eslint-disable-next-line import/no-mutable-exports
let ReportsForm = ({
  handleSubmit,
  dirty,
  // change,
  questionnaires,
}) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Create new report</Heading>

    <Fields.Text name="mrn" />
    <Fields.Radio
      name="completed"
      options={[
        { key: 'YES', value: true, text: 'Yes' },
        { key: 'NO', value: false, text: 'No' },
      ].map(option => ({
        key: option.key,
        value: option.value,
        text: option.text,
      }))}
    />
    <Fields.Radio
      name="pushedToSapio"
      options={[
        { key: 'YES', value: true, text: 'Yes' },
        { key: 'NO', value: false, text: 'No' },
      ].map(option => ({
        key: option.key,
        value: option.value,
        text: option.text,
      }))}
    />
    <Fields.Select
      name="questionnaireId"
      label="Questionnaires"
      options={questionnaires.map(questionnaire => ({
        key: questionnaire.id,
        value: questionnaire.id,
        text: questionnaire.currentTitle,
      }))}
    />

    <Fields.DatePicker name="createdFrom" />
    <Fields.DatePicker name="createdTo" />
    <Buttons
      actions={[
        {
          content: 'Run report',
          type: 'submit',
          disabled: !dirty,
        },
      ]}
    />
  </Form>
);

ReportsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  dirty: PropTypes.bool.isRequired,
  questionnaires: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const form = 'reports-form';
ReportsForm = reduxForm({
  enableReinitialize: true,
  form,
})(ReportsForm);

const selector = formValueSelector(form);
ReportsForm = connect(state => ({
  questionnaireId: selector(state, 'questionnaireId'),
}))(ReportsForm);

export default ReportsForm;
