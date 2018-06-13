import React from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox } from 'semantic-ui-react';
import { Fields, Buttons, Heading, Table } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

const handleSelectChange = (values, afterPaymentData, questionnaireData, change) => {
  const remainingAfterPayment = values.reduce((result, questionnaireId) => {
    afterPaymentData.map((questionnaire) => {
      if (questionnaire.id === questionnaireId) {
        return result.push({
          id: questionnaire.id,
          afterPayment: questionnaire.afterPayment,
          title: questionnaire.title,
          versionPublished: questionnaire.versionPublished,
        });
      }
      return '';
    });
    return result;
  }, []);
  const remainingQuestionnaireIds = values.filter(
    questionnaireId =>
      !remainingAfterPayment.some(questionnaire => questionnaire.id === questionnaireId),
  );
  if (remainingQuestionnaireIds.length > 0) {
    const newQuestionnaire = questionnaireData.filter(
      questionnaire => questionnaire.id === remainingQuestionnaireIds[0],
    );
    remainingAfterPayment.push({
      id: remainingQuestionnaireIds[0],
      afterPayment: false,
      title: newQuestionnaire[0].currentTitle,
      versionPublished: newQuestionnaire[0].currentVersionId,
    });
  }
  change('questionnaires', values);
  change('questionnaireAfterPayment', remainingAfterPayment);
};

const handleCheckBoxChange = (values, afterPaymentData, change) => {
  const newData = afterPaymentData.map((questionnaire) => {
    if (questionnaire.id === values.name) {
      return Object.assign({}, questionnaire, {
        afterPayment: values.checked,
      });
    }
    return questionnaire;
  });
  change('questionnaireAfterPayment', newData);
};

const headerRow = [
  {
    propName: 'title',
  },
  {
    propName: 'afterPayment',
    label: 'Requires payment',
  },
];

const renderBodyRow = ({ id, title, afterPayment }, change, afterPaymentData) => ({
  key: id,
  cells: [
    title,
    <Checkbox
      slider
      name={id}
      checked={afterPayment}
      onChange={(e, values) => {
        handleCheckBoxChange(values, afterPaymentData, change);
      }}
    />,
  ],
  actions: [],
});

const ReleasesForm = ({
  initialValues,
  handleSubmit,
  onCancel,
  submitting,
  questionnaireData,
  questionnaireOptions,
  questionnaires,
  questionnaireAfterPayment,
  change,
}) => {
  // at the start it will return immutable data but when we change the form
  // then it return normal data
  const selectedQuestionnaires =
    questionnaires && questionnaires.size ? questionnaires.toJS() : questionnaires;

  const afterPaymentData =
    questionnaireAfterPayment && questionnaireAfterPayment.size
      ? questionnaireAfterPayment.toJS()
      : questionnaireAfterPayment;

  return (
    <Form onSubmit={handleSubmit}>
      <Heading size="h1">Create Release</Heading>
      {initialValues.get('consentTypeId') && (
        <Heading as="h3">Consent: {initialValues.get('consentTypeId')}</Heading>
      )}
      <Fields.Select
        required
        multiple
        name="questionnaires"
        label="Questionnaires"
        options={questionnaireOptions}
        onChange={(e, values) => {
          handleSelectChange(values, afterPaymentData, questionnaireData, change);
        }}
      />

      {selectedQuestionnaires &&
        selectedQuestionnaires.length > 0 && (
        <div>
          <Heading as="h3">Payment</Heading>
          <Table
            headerRow={headerRow}
            renderBodyRow={props => renderBodyRow(props, change, afterPaymentData)}
            tableData={afterPaymentData}
          />
        </div>
      )}
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
};

ReleasesForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    consentTypeId: PropTypes.string,
  }).isRequired,
  questionnaireOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  questionnaires: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  questionnaireAfterPayment: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  questionnaireData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  change: PropTypes.func.isRequired,
};

ReleasesForm.defaultProps = {
  questionnaires: [],
  questionnaireAfterPayment: [],
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
