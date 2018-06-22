import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import { questionnaireSchema, versionSchema } from '../schemas';
import QuestionnaireQueryResource from '../QuestionnaireQueryResource';
import QuestionnairesEditTitleForm from './QuestionnairesEditTitleForm';

export default function QuestionnairesEditTitle({
  closePanel,
  match: {
    params: { questionnaireId },
  },
}) {
  return (
    <QuestionnaireQueryResource questionnaireId={questionnaireId}>
      {({ questionnaires, versions }) => {
        const version = versions[0];
        const questionnaire = questionnaires[0];

        return (
          <Mutation
            resourceName="versions"
            url={`/questionnaires/${questionnaireId}/versions`}
            schema={versionSchema}
            post={async (mutationResponse, actions) => {
              const versionPayload =
                mutationResponse.payload.entities.versions[mutationResponse.payload.result];
              const questionnairePayload = {
                ...questionnaire,
                currentTitle: versionPayload.title,
                currentVersionId: versionPayload.id,
              };

              const updateQuestionnaireMutation = {
                resourceName: 'questionnaires',
                url: `/questionnaires/${questionnaireId}`,
                schema: questionnaireSchema,
              };

              await actions.update(updateQuestionnaireMutation, questionnairePayload);

              return closePanel();
            }}
            render={({ create, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }
              return (
                <QuestionnairesEditTitleForm
                  initialValues={version}
                  onSubmit={create}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QuestionnaireQueryResource>
  );
}

QuestionnairesEditTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
