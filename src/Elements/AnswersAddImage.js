import React from 'react';
import PropTypes from 'prop-types';
import ElementsAddImageForm from './ElementsAddImageForm';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';

const AnswersAddImage = (props) => {
  const {
    closePanel,
    match: {
      params: { questionnaireId, elementId, answerId },
    },
  } = props;
  const handleSubmit = (update, values, element, ansId) => {
    const answer = element.answers.filter(ans => ans.id === ansId);

    const newAnswer = Object.assign(answer[0], {
      image: `${process.env.REACT_APP_BASE_URL}/download?id=${values.get('file').id}`,
    });

    const newElementAnswers = element.answers.map((ans) => {
      if (ansId === ans.id) {
        return newAnswer;
      }
      return ans;
    });

    update({
      ...element,
      answers: newElementAnswers,
    });
  };
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
                  onSubmit={values => handleSubmit(update, values, element, answerId)}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QuestionnaireQueryResource>
  );
};

AnswersAddImage.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AnswersAddImage;
