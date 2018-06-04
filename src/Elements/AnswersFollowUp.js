import React from 'react';
import PropTypes from 'prop-types';
import AnswersFollowUpForm from './AnswersFollowUpForm';

import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';

const AnswersFollowUp = (props) => {
  const {
    closePanel,
    match: {
      params: { elementId, questionnaireId, answerId },
    },
  } = props;
  return (
    <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
      {({ questionnaires, versions, elements }) => {
        const element = elements[0];
        const questionnaire = questionnaires[0];
        const version = versions[0];
        return (
          <QuestionnaireUpdaterMutation
            questionnaire={questionnaire}
            version={version}
            post={closePanel}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }
              return (
                <AnswersFollowUpForm
                  form={`element-answer-form-${answerId}`}
                  initialValues={element}
                  answerId={answerId}
                  onSubmit={update}
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

AnswersFollowUp.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AnswersFollowUp;
