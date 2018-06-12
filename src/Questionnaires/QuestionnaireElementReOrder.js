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
      params: { id, elementid },
    },
  } = props;
  return (
    <QuestionnaireQueryResource questionnaireId={id} elementId={elementid}>
      {({ questionnaires, versions }) => {
        const version = versions[0];
        const questionnaire = questionnaires[0];
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
                  form={`elements-order-${elementid}`}
                  onSubmit={value => move(elementid, value.get('index'))}
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
