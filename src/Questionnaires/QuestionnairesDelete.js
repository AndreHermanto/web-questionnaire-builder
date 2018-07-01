import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation } from 'web-components';
import { questionnaireSchema } from './schemas';

const QuestionnairesDelete = (props) => {
  const {
    closePanel,
    history,
    match: {
      params: { id },
    },
  } = props;
  return (
    <Mutation
      resourceName="questionnaires"
      url={`/questionnaires/${id}`}
      schema={questionnaireSchema}
      post={() => history.push('/questionnaires')}
      render={({ remove, loading }) => {
        if (loading) {
          return <div>loading...</div>;
        }
        return (
          <Confirmation
            title="Delete Questionnaire?"
            content="Deleting a questionnaire will remove it from the system."
            confirmLabel="Yes"
            cancelLabel="No"
            onConfirm={() => remove(id)}
            onCancel={closePanel}
          />
        );
      }}
    />
  );
};
QuestionnairesDelete.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QuestionnairesDelete;
