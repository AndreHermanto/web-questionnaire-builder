import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import { questionnaireSchema, versionSchema } from '../schemas';
import QuestionnairesCreateForm from './QuestionnairesCreateForm';

export default function QuestionnairesCreate({ closePanel, history }) {
  return (
    <div>
      <Mutation
        resourceName="questionnaires"
        url={'/questionnaires'}
        schema={questionnaireSchema}
        post={async (mutationResponse, actions) => {
          const questionnaire =
            mutationResponse.payload.entities.questionnaires[mutationResponse.payload.result];

          const versionPayload = {
            questionnaireId: questionnaire.id,
            title: questionnaire.currentTitle,
          };

          const createVersionMutation = {
            resourceName: 'versions',
            url: `/questionnaires/${questionnaire.id}/versions`,
            schema: versionSchema,
          };

          const updateQuestionnaireMutation = {
            resourceName: 'questionnaires',
            url: `/questionnaires/${questionnaire.id}`,
            schema: questionnaireSchema,
          };

          const versionResponse = await actions.create(createVersionMutation, versionPayload);
          const version = versionResponse.payload.entities.versions[versionResponse.payload.result];
          const questionnairePayload = Object.assign({}, questionnaire, {
            currentVersionId: version.id,
          });
          actions.update(updateQuestionnaireMutation, questionnairePayload);

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
