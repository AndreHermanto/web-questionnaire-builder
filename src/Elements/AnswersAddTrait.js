import React from 'react';
import PropTypes from 'prop-types';
import AnswersAddTraitForm from './AnswersAddTraitForm';

import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';

function AnswersAddTrait({
  closePanel,
  match: {
    params: { elementId, questionnaireId, answerId },
  },
}) {
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
                <AnswersAddTraitForm
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
}

AnswersAddTrait.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AnswersAddTrait;
