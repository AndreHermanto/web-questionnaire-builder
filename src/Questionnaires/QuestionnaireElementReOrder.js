import React from 'react';
import PropTypes from 'prop-types';
import QuestionnaireElementReOrderForm from './QuestionnaireElementReOrderForm';
import QuestionnaireQueryResource from './QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from '../Elements/QuestionnaireUpdaterMutation';

const QuestionnaireElementReOrder = (props) => {
  const {
    closePanel,
    history,
    match: {
      params: { id, elementId },
    },
  } = props;
  return (
    <QuestionnaireQueryResource questionnaireId={id} elementId={elementId}>
      {({ questionnaires, versions }) => {
        const version = versions[0];
        const questionnaire = questionnaires[0];
        const questions = version.body.filter(data => data.type !== 'end' || data.type !== 'start');
        const questionOptions = questions.map(value => ({
          key: value.id,
          text: value.question || value.title,
          value: value.id,
        }));
        return (
          <QuestionnaireUpdaterMutation
            questionnaire={questionnaire}
            version={version}
            post={() => history.push(`/questionnaires/${id}`)}
            render={({ move, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }
              return (
                <QuestionnaireElementReOrderForm
                  form={`elements-order-${elementId}`}
                  onSubmit={(value) => {
                    /**
                     * get question current index
                     * get move to index base on position after(+1)/before(-1)
                     * if it >= 0 or >= question length then return current index
                     */
                    const questionIndex = questions.findIndex(
                      question => question.id === value.get('question'),
                    );
                    const moveToIndex =
                      value.get('position') === 'AFTER' ? questionIndex + 1 : questionIndex - 1;

                    const newPos = Math.min(Math.max(moveToIndex, 0), questions.length - 1);

                    move(elementId, newPos);
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
  );
};
QuestionnaireElementReOrder.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      versionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QuestionnaireElementReOrder;
