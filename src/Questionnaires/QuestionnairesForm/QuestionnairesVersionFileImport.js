import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { Mutation, QueryResource } from 'web-components';
import { questionnairesSchema, questionnaireSchema, versionSchema } from '../schemas';
import QuestionnairesVersionFileImportForm from './QuestionnairesVersionFileImportForm';

export default function QuestionnairesVersionFileImport({
  history,
  closePanel,
  match: {
    params: { questionnaireId },
  },
}) {
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'questionnaires',
          url: '/questionnaires',
          filter: { id: questionnaireId },
          schema: questionnairesSchema,
        },
      ]}
      render={({ questionnaires }) => {
        if (!questionnaires.length) {
          return <div>Error: imported questionnaire not found...</div>;
        }
        const questionnaire = questionnaires[0];
        return (
          <Mutation
            resourceName="questionnaires"
            url={`/questionnaires/${questionnaire.id}`}
            schema={questionnaireSchema}
            post={() => {
              history.push('/questionnaires');
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
                      <QuestionnairesVersionFileImportForm
                        onSubmit={(values) => {
                          const versionData = values.get('fileJsonData');
                          delete versionData.id;
                          createVersion({ ...versionData });
                        }}
                        onCancel={closePanel}
                      />
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
}

QuestionnairesVersionFileImport.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
