import React from 'react';
import PropTypes from 'prop-types';
import ElementsForm from './ElementsForm';
import ElementStartEndPageForm from './Forms/ElementStartEndPageForm';
import ElementsSectionForm from './ElementsSectionForm';

import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';

const renderFormByType = (type, formProps) => {
  switch (type) {
    case 'start':
    case 'end':
      return <ElementStartEndPageForm {...formProps} />;
    case 'section':
      return <ElementsSectionForm {...formProps} />;
    default:
      return <ElementsForm {...formProps} />;
  }
};
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
                const formProps = {
                  form: 'elements-form',
                  initialValues: element,
                  questionOptions: [],
                  onSubmit: update,
                  onCancel: closePanel,
                };
                return renderFormByType(element.type, formProps);
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
