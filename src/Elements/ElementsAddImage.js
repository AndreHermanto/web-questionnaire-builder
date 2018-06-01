import React from 'react';
import PropTypes from 'prop-types';
import ElementsAddImageForm from './ElementsAddImageForm';

import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';

function ElementsAddImage({
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
                <ElementsAddImageForm
                  onSubmit={values =>
                    update({
                      ...element,
                      image: `${process.env.REACT_APP_BASE_URL}/download?id=${
                        values.get('file').id
                      }`,
                    })
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

ElementsAddImage.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsAddImage;
