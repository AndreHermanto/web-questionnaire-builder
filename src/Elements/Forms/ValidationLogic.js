import React from 'react';
import PropTypes from 'prop-types';
import QuestionnaireQueryResource from '../../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from '../QuestionnaireUpdaterMutation';
import {
  buildValidationLogicFromForm,
  convertNumericValidationLogicToForm,
  buildTextValidationLogicFromForm,
  convertRegexValidationLogicToForm,
} from '../../helpers/validationLogic';
import ValidationLogicNumericForm from './ValidationLogicNumericForm';
import ValidationLogicTextForm from './ValidationLogicTextForm';

function getNumericValidationLogic(element, answerId) {
  const { validationLogic } = element.answers.find(answer => answer.id === answerId);
  return validationLogic && validationLogic.number
    ? convertNumericValidationLogicToForm(validationLogic.number)
    : null;
}
function getTextValidationLogic(element, answerId) {
  const { validationLogic } = element.answers.find(answer => answer.id === answerId);
  return validationLogic && validationLogic.text
    ? convertRegexValidationLogicToForm(validationLogic.text)
    : null;
}
function updateValidationLogic(element, answerId, validationLogic) {
  const answers = element.answers.map((answer) => {
    const updatedAnswer = answer;
    if (answer.id === answerId) updatedAnswer.validationLogic = validationLogic;
    return updatedAnswer;
  });
  return { ...element, answers };
}

function ValidationLogic({
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

              if (element.type === 'text') {
                const validationLogic = getTextValidationLogic(element, answerId);
                return (
                  <ValidationLogicTextForm
                    initialValues={validationLogic}
                    onSubmit={(values) => {
                      const answerValidation = buildTextValidationLogicFromForm(
                        element.type,
                        values.get('regex'),
                      );
                      const payload = updateValidationLogic(element, answerId, {
                        text: answerValidation,
                      });
                      update(payload);
                    }}
                    onCancel={closePanel}
                  />
                );
              }

              // element.type === 'number'
              const validationLogic = getNumericValidationLogic(element, answerId);
              return (
                <ValidationLogicNumericForm
                  initialValues={validationLogic}
                  onSubmit={(values) => {
                    const answerValidation = buildValidationLogicFromForm(
                      element.type,
                      values.toJS(),
                    );
                    const payload = updateValidationLogic(element, answerId, {
                      number: answerValidation,
                    });
                    update(payload);
                  }}
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

ValidationLogic.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ValidationLogic;
