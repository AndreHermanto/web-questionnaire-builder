import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { Mutation } from 'web-components';
import { questionnaireSchema, versionSchema } from '../schemas';
import QuestionnairesFileImportForm from './QuestionnairesFileImportForm';

export default function QuestionnairesFileImport({ closePanel, history }) {
  let versionData;

  return (
    <div>
      <Mutation
        resourceName="questionnaires"
        url={'/questionnaires'}
        schema={questionnaireSchema}
        post={async (mutationResponse, actions) => {
          const newQuestionnaire = get(
            mutationResponse.payload.entities.questionnaires,
            mutationResponse.payload.result,
          );
          const versionResponse = await actions.create(
            {
              url: `/questionnaires/${newQuestionnaire.id}/versions`,
              schema: versionSchema,
              resourceName: 'versions',
            },
            { ...versionData, questionnaireId: newQuestionnaire.id },
          );

          const version = get(
            versionResponse.payload.entities.versions,
            versionResponse.payload.result,
          );

          await actions.update(
            {
              url: `/questionnaires/${newQuestionnaire.id}`,
              schema: questionnaireSchema,
              resourceName: 'questionnaires',
            },
            {
              ...versionData,
              id: version.questionnaireId,
              currentTitle: version.title,
              currentVersionId: version.id,
            },
          );
          return history.push(`/questionnaires/${newQuestionnaire.id}`);
        }}
        render={({ create: createNewQuestionnaire, loading: pending, error }) => {
          if (pending) {
            return <div>Importing questionnaire...</div>;
          }
          if (error) {
            return <div>Error: {error}</div>;
          }

          return (
            <QuestionnairesFileImportForm
              onSubmit={(values) => {
                versionData = values.get('fileJsonData');
                delete versionData.id;
                createNewQuestionnaire({ currentTitle: 'New Questionnaire' });
              }}
              onCancel={closePanel}
            />
          );
        }}
      />
    </div>
  );
}

QuestionnairesFileImport.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
};
