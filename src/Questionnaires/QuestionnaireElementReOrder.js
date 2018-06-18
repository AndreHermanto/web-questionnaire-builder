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
      params: { questionnaireId, elementId },
    },
  } = props;
  return (
    <QuestionnaireQueryResource questionnaireId={questionnaireId}>
      {({ questionnaires, versions }) => {
        const version = versions[0];
        const questionnaire = questionnaires[0];
        const questions = version.body.filter(data => data.type !== 'end' || data.type !== 'start');

        const questionOptions = questions.reduce((previousValue, element, index) => {
          if (element.type === 'end' || element.type === 'start' || element.id === elementId) {
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
            questionnaire={questionnaire}
            version={version}
            post={() => history.push(`/questionnaires/${questionnaireId}`)}
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
                    const moveToIndex = value.get('index') + value.get('position');
                    const newPos = Math.min(Math.max(moveToIndex, 0), questions.length);
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
