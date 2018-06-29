import React from 'react';
import PropTypes from 'prop-types';
import { Confirmation } from 'web-components';
import QuestionnaireQueryResource from '../../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from '../QuestionnaireUpdaterMutation';

/* eslint no-param-reassign: 0 */
const DeleteValidationLogic = (props) => {
  const {
    closePanel,
    match: {
      params: { elementId, questionnaireId, answerId },
    },
  } = props;
  return (
    <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
      {({ questionnaires, versions, elements }) => {
        const questionnaire = questionnaires[0];
        const version = versions[0];
        const element = elements[0];

        const newElement = {
          ...element,
          answers: element.answers.map((answer) => {
            const { validationLogic, ...restOfAnswer } = answer;
            if (answer.id === answerId) {
              return restOfAnswer;
            }
            return answer;
          }),
        };

        return (
          <QuestionnaireUpdaterMutation
            version={version}
            questionnaire={questionnaire}
            post={closePanel}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }

              return (
                <Confirmation
                  title="Delete validation logic?"
                  content="Deleting an validation logic will remove it from the system forever"
                  confirmLabel="Yes, Delete validation logic"
                  cancelLabel="No"
                  onConfirm={() => update(newElement)}
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
DeleteValidationLogic.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
      answerId: PropTypes.string.isRequired,
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DeleteValidationLogic;
