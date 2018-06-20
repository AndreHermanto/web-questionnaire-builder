import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import { questionnaireSchema } from '../schemas';
import QuestionnairesCreateForm from './QuestionnairesCreateForm';

export default function QuestionnairesCreate({ closePanel, history }) {
  return (
    <div>
      <Mutation
        resourceName="questionnaires"
        url={'/questionnaires'}
        schema={questionnaireSchema}
        post={async (mutationResponse) => {
          const questionnaire =
            mutationResponse.payload.entities.questionnaires[mutationResponse.payload.result];
          history.push(`/questionnaires/${questionnaire.id}`);
        }}
        render={({ create, loading: pending, error }) => {
          if (pending) {
            return <div>Creating questionnaire...</div>;
          }
          if (error) {
            return <div>Error: {error}</div>;
          }

          return <QuestionnairesCreateForm onSubmit={create} onCancel={closePanel} />;
        }}
      />
    </div>
  );
}

QuestionnairesCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
