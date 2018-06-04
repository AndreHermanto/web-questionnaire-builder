import React from 'react';
import PropTypes from 'prop-types';
import ElementsForm from './ElementsForm';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';

const INSERTATINDEX = 0;

export default function ElementsCreate({
  closePanel,
  match: {
    params: { questionnaireId },
  },
}) {
  return (
    <div>
      <QuestionnaireQueryResource questionnaireId={questionnaireId}>
        {({ questionnaires, versions }) => {
          const questionnaire = questionnaires[0];
          const version = versions[0];
          return (
            <QuestionnaireUpdaterMutation
              version={version}
              questionnaire={questionnaire}
              post={closePanel}
              render={({ create, loading: pending }) => {
                if (pending) {
                  return <div>loading...</div>;
                }
                return (
                  <ElementsForm
                    form={'elements-form'}
                    onSubmit={value => create(value, INSERTATINDEX)}
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

ElementsCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
