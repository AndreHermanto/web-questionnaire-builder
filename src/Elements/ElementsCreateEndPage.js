import React from 'react';
import PropTypes from 'prop-types';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import ElementStartEndPageForm from './Forms/ElementStartEndPageForm';

export default function ElementsCreateEndPage({
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
                  <ElementStartEndPageForm
                    initialValues={{
                      type: 'end',
                    }}
                    onCancel={closePanel}
                    onSubmit={value => create(value, version.body.length)}
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

ElementsCreateEndPage.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
