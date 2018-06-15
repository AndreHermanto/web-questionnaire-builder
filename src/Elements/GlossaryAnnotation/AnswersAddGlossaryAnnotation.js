import React from 'react';
import PropTypes from 'prop-types';
import QuestionnaireUpdaterMutation from './../QuestionnaireUpdaterMutation';
import QuestionnaireQueryResource from '../../Questionnaires/QuestionnaireQueryResource';
import GlossaryAnnotationForm from './GlossaryAnnotationForm';

export default function AnswersAddGlossaryAnnotation({
  closePanel,
  match: {
    params: { questionnaireId, elementId, answerId },
  },
}) {
  return (
    <div>
      <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
        {({ questionnaires, versions, elements }) => {
          const questionnaire = questionnaires[0];
          const version = versions[0];
          const element = elements[0];
          return (
            <QuestionnaireUpdaterMutation
              version={version}
              questionnaire={questionnaire}
              post={closePanel}
              render={({ update, loading: pending }) => {
                if (pending) {
                  return <div>loading...</div>;
                }
                return (
                  <GlossaryAnnotationForm
                    answerId={answerId}
                    initialValues={element}
                    onSubmit={update}
                    onCancel={closePanel}
                  />
                );
              }}
            />
          );
        }}
      </QuestionnaireQueryResource>
    </div>
  );
}

AnswersAddGlossaryAnnotation.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      elementId: PropTypes.string.isRequired,
      answerId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
