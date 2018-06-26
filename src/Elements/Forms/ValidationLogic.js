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
import ValidationLogicUOMsForm from './ValidationLogicUOMsForm';

function getNumericValidationLogic(element, answerId, propertyName) {
  const { validationLogic } = element.answers.find(answer => answer.id === answerId);
  return validationLogic && validationLogic[propertyName]
    ? convertNumericValidationLogicToForm(validationLogic[propertyName])
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
              switch (element.type) {
                case 'text': {
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
                case 'number': {
                  const validationLogic = getNumericValidationLogic(element, answerId, 'number');
                  return (
                    <ValidationLogicNumericForm
                      initialValues={validationLogic}
                      onSubmit={(values) => {
                        const answerValidation = buildValidationLogicFromForm(
                          'number',
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
                }
                case 'uom': {
                  const validationLogic = getNumericValidationLogic(element, answerId, 'uom1');
                  return (
                    <ValidationLogicNumericForm
                      initialValues={validationLogic}
                      onSubmit={(values) => {
                        const answerValidation = buildValidationLogicFromForm(
                          'uom1',
                          values.toJS(),
                        );
                        const payload = updateValidationLogic(element, answerId, {
                          uom1: answerValidation,
                        });
                        update(payload);
                      }}
                      onCancel={closePanel}
                    />
                  );
                }
                case 'uoms': {
                  const validationLogic = {
                    uom1: getNumericValidationLogic(element, answerId, 'uom1') || {},
                    uom2: getNumericValidationLogic(element, answerId, 'uom2') || {},
                  };
                  return (
                    <ValidationLogicUOMsForm
                      initialValues={validationLogic}
                      onSubmit={(values) => {
                        const answerValidationUom1 = buildValidationLogicFromForm(
                          'uom1',
                          values.get('uom1').toJS(),
                        );
                        const answerValidationUom2 = buildValidationLogicFromForm(
                          'uom2',
                          values.get('uom2').toJS(),
                        );
                        const payload = updateValidationLogic(element, answerId, {
                          uom1: answerValidationUom1,
                          uom2: answerValidationUom2,
                        });
                        update(payload);
                      }}
                      onCancel={closePanel}
                    />
                  );
                }
                default:
                  return <div>ERROR: The element type is not supported to add validations.</div>;
              }
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
