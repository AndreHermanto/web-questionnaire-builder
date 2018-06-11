import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import ElementsAddSourceForm from './ElementsAddSourceForm';

import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';

function ElementsAddValidatedSource({
  closePanel,
  match: {
    params: { elementId, questionnaireId },
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
                <ElementsAddSourceForm
                  onSubmit={values =>
                    update(
                      fromJS({
                        ...element,
                        questionSource: values.get('questionSource'),
                      }),
                    )
                  }
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

ElementsAddValidatedSource.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsAddValidatedSource;
