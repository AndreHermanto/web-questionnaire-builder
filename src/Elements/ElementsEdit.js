import React from 'react';
import PropTypes from 'prop-types';
import ElementsForm from './ElementsForm';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';

export default function ElementsEdit({
  closePanel,
  match: {
    params: { elementId, questionnaireId },
  },
}) {
  return (
    <div>
      <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
        {({ questionnaires, versions, elements }) => {
          if (!elements.length) {
            return <div>No Elements</div>;
          }
          const element = elements[0];
          const questionnaire = questionnaires[0];
          const version = versions[0];
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
                  <ElementsForm
                    form={'elements-form'}
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

ElementsEdit.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
