import React from 'react';
import PropTypes from 'prop-types';
import { rest } from 'web-components';
import QuestionnairesResponsesReportForm from './QuestionnairesResponsesReportForm';

export default function QuestionnairesResponseCollectionsReport({
  closePanel,
  match: {
    params: { questionnaireId },
  },
}) {
  const handleGenerateResponsesReport = async (values) => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/download/responses/${questionnaireId}/generate?format=${values.get(
          'format',
        )}&includeTimestamp=${values.get('includeTimestamp')}&includePartialAnswers=${values.get(
          'includePartialAnswers',
        )}`,
        {
          method: 'GET',
          headers: { jwt: rest.getAccessToken() },
        },
      );
      if (response.ok) {
        // eslint-disable-next-line no-alert
        alert(
          'A new responses report will be created and you will be notified by email when this will become available.',
        );
      } else {
        // eslint-disable-next-line no-alert
        alert(`Error generating responses report : ${response.status}`);
      }
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(`Error generating responses report : ${err}`);
    } finally {
      closePanel();
    }
  };

  return (
    <QuestionnairesResponsesReportForm
      initialValues={{ includeTimestamp: false, includePartialAnswers: false }}
      onCancel={closePanel}
      form={`questionnaire-${questionnaireId}-generate-responses-report`}
      onSubmit={handleGenerateResponsesReport}
    />
  );
}

QuestionnairesResponseCollectionsReport.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
