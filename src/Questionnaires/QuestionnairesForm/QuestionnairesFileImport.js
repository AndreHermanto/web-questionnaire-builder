import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { Button, Message } from 'semantic-ui-react';
import styled from 'styled-components';
import { Mutation, Resource } from 'web-components';
import { questionnaireSchema, versionSchema, importedQuestionnaireSchema } from '../schemas';
import QuestionnairesFileImportForm from './QuestionnairesFileImportForm';

const CreateButton = styled(Button)`
  background: ${props => props.theme.appColor} !important;
  color: white !important;
`;

const createQuestionnaireVersion = (versionData, closePanel) => (
  <Resource
    resourceName="importedQuestionnaire"
    render={({ importedQuestionnaire }) => {
      if (!importedQuestionnaire.length) {
        return <div>Error: imported questionnaire not found...</div>;
      }
      const questionnaire = importedQuestionnaire[0];
      return (
        <Mutation
          resourceName="questionnaires"
          url={`/questionnaires/${questionnaire.id}`}
          schema={questionnaireSchema}
          post={() => {
            closePanel();
          }}
          render={({ update, loading: updatePending, error: updateVersion }) => {
            if (updatePending) {
              return <div>Importing questionnaire...</div>;
            }
            if (updateVersion) {
              return <div>Error: {updateVersion}</div>;
            }
            return (
              <Mutation
                resourceName="versions"
                url={`/questionnaires/${questionnaire.id}/versions`}
                schema={versionSchema}
                post={(mutationResponse) => {
                  const version = get(
                    mutationResponse.payload.entities.versions,
                    mutationResponse.payload.result,
                  );
                  return update(
                    Object.assign({}, questionnaire, {
                      id: version.questionnaireId,
                      currentTitle: version.title,
                      currentVersionId: version.id,
                    }),
                  );
                }}
                render={({
                  create: createVersion,
                  loading: versionPending,
                  error: versionError,
                }) => {
                  if (versionPending) {
                    return <div>Importing questionnaire...</div>;
                  }
                  if (versionError) {
                    return <div>Error: {versionError}</div>;
                  }

                  return (
                    <CreateButton
                      onClick={() =>
                        createVersion(
                          Object.assign({}, versionData, {
                            questionnaireId: questionnaire.id,
                          }),
                        )
                      }
                    >
                      Create Questionnaire
                    </CreateButton>
                  );
                }}
              />
            );
          }}
        />
      );
    }}
  />
);
export default function QuestionnairesFileImport({ closePanel }) {
  let versionData;

  return (
    <div>
      <Mutation
        resourceName="importedQuestionnaire"
        url={'/questionnaires'}
        schema={importedQuestionnaireSchema}
        render={({ create: createNewQuestionnaire, loading: pending, error }) => {
          if (pending) {
            return <div>Importing questionnaire...</div>;
          }
          if (error) {
            return <div>Error: {error}</div>;
          }

          if (versionData) {
            return (
              <div>
                <Message positive>Imported questionnaire</Message>
                {createQuestionnaireVersion(versionData, closePanel)}
              </div>
            );
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
  closePanel: PropTypes.func.isRequired,
};
