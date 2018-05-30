import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const options = [{ key: 'YES', value: true, text: 'Yes' }, { key: 'NO', value: false, text: 'No' }];

const QuestionnairesResponsesReportForm = ({ handleSubmit, onCancel, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Generate responses report</Heading>
    <Fields.Select
      name="format"
      label="File format"
      required
      options={['CSV', 'JSON'].map(option => ({
        key: option,
        value: option.toLowerCase(),
        text: option,
      }))}
    />
    <Fields.Radio
      name="includeTimestamp"
      label="Timestamp"
      subLabel="Include submission times"
      required
      options={options}
    />
    <Fields.Radio
      name="includePartialAnswers"
      label="Incomplete Submissions"
      subLabel="Include responses where the user hasn't completed the questionnaire."
      required
      options={options}
    />

    <Buttons
      actions={[
        {
          content: 'Generate',
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

QuestionnairesResponsesReportForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(QuestionnairesResponsesReportForm);
