import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

const ReleasesForm = ({ handleSubmit, onCancel, submitting, questionnaireOptions }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Create Release</Heading>
    <Fields.Array
      name="questionnaires"
      header="Questionnaire"
      required
      components={index => (
        <div>
          <Fields.Select
            required
            name={`questionnaires.${index}.questionnaireId`}
            label="Questionnaires"
            options={questionnaireOptions}
          />
          <Fields.Radio
            name={`questionnaires.${index}.afterPayment`}
            label="After Payment"
            required
            options={[
              { key: 'YES', value: true, text: 'Yes' },
              { key: 'NO', value: false, text: 'No' },
            ]}
          />
        </div>
      )}
    />
    <Fields.Text name="notificationEmail" />
    <Fields.Select
      name="notificationFrequency"
      label="Notification frequency"
      options={['Daily', 'Weekly', 'Monthly'].map(value => ({
        key: value,
        text: value,
        value,
      }))}
    />
    <p style={{ marginTop: 16, color: '#888' }}>
      When you publish, the questionnaires are immediately available to any new patients that come
      in with that consent. Any existing patients that have started a questionnaire in an old
      release, will continue on with that questionnaire (this prevents them having to start the
      questionnaire again).
    </p>
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

ReleasesForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  questionnaireOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
};

const form = 'releases-form';
const selector = formValueSelector(form);

export default connect(state => ({
  questionnaires: selector(state, 'questionnaires'),
  questionnaireAfterPayment: selector(state, 'questionnaireAfterPayment'),
}))(
  reduxForm({
    enableReinitialize: true,
    form,
  })(ReleasesForm),
);
