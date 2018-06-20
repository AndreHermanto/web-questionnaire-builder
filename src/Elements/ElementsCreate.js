import React from 'react';
import PropTypes from 'prop-types';
import ElementsForm from './ElementsForm';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';

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
          const questions = version.body.filter(
            data => data.type !== 'end' || data.type !== 'start',
          );

          const questionOptions = questions.reduce((previousValue, element, index) => {
            if (element.type === 'end' || element.type === 'start') {
              return previousValue;
            }
            return previousValue.concat([
              {
                key: index,
                text: element.question || element.title,
                value: index,
              },
            ]);
          }, []);
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
                    onSubmit={(value) => {
                      const moveToIndex = value.get('index') + value.get('position');
                      const newPos = Math.min(Math.max(moveToIndex, 0), questions.length);
                      create(value, newPos);
                    }}
                    onCancel={closePanel}
                    questionOptions={questionOptions}
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
