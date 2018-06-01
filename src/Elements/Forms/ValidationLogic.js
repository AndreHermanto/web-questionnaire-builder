import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation } from 'web-components';
import { elementSchema } from '../schemas';
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
  return validationLogic ? convertNumericValidationLogicToForm(validationLogic) : null;
}
function getTextValidationLogic(element, answerId) {
  const { validationLogic } = element.answers.find(answer => answer.id === answerId);
  return validationLogic ? convertRegexValidationLogicToForm(validationLogic) : null;
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
    <QueryResource
      queries={[
        {
          resourceName: 'elements',
          url: `/questionnaires/${questionnaireId}/elements/${elementId}`,
          schema: elementSchema,
          filter: { id: elementId },
        },
      ]}
    >
      {({ elements }) => {
        const element = elements[0];
        let validationLogic = getNumericValidationLogic(element, answerId);
        return (
          <Mutation
            resourceName="elements"
            url={`/questionnaires/${questionnaireId}/elements/${elementId}`}
            schema={elementSchema}
            post={closePanel}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }

              if (element.type === 'text') {
                validationLogic = getTextValidationLogic(element, answerId);
                return (
                  <ValidationLogicTextForm
                    initialValues={validationLogic}
                    onSubmit={(values) => {
                      const answerValidation = buildTextValidationLogicFromForm(
                        element.type,
                        values.get('regex'),
                      );
                      const payload = updateValidationLogic(element, answerId, answerValidation);
                      update(payload);
                    }}
                    onCancel={closePanel}
                  />
                );
              }

              // element.type === 'number'
              return (
                <ValidationLogicNumericForm
                  initialValues={validationLogic}
                  onSubmit={(values) => {
                    const answerValidation = buildValidationLogicFromForm(
                      element.type,
                      values.toJS(),
                    );
                    const payload = updateValidationLogic(element, answerId, answerValidation);
                    update(payload);
                  }}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QueryResource>
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
