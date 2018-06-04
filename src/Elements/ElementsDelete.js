import React from 'react';
import PropTypes from 'prop-types';
import { Confirmation } from 'web-components';
import QuestionnaireQueryResource from './../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';

const ElementsDelete = (props) => {
  const {
    closePanel,
    history,
    match: {
      params: { elementId, questionnaireId },
    },
  } = props;
  return (
    <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
      {({ questionnaires, versions }) => {
        const questionnaire = questionnaires[0];
        const version = versions[0];
        return (
          <QuestionnaireUpdaterMutation
            questionnaire={questionnaire}
            version={version}
            post={() => history.push(`/questionnaires/${questionnaireId}`)}
            render={({ remove, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }
              return (
                <Confirmation
                  title="Delete Element?"
                  content="Deleting an element will remove it from the system forever"
                  confirmLabel="Yes, Delete Element"
                  cancelLabel="No"
                  onConfirm={() => remove(elementId)}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QuestionnaireQueryResource>
  );
};
ElementsDelete.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsDelete;
