import React from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';
import { Mutation } from 'web-components';
import { versionSchema, questionnaireSchema } from '../Questionnaires/schemas';

export default function QuestionnaireUpdaterMutation({ post, render, version, questionnaire }) {
  return (
    <Mutation
      resourceName="questionnaires"
      url={`/questionnaires/${questionnaire.id}`}
      schema={questionnaireSchema}
      post={post}
      render={({ update, loading: updatingQuestionnaire }) => (
        <Mutation
          resourceName="versions"
          url={`/questionnaires/${questionnaire.id}/versions`}
          schema={versionSchema}
          post={(mutationResponse) => {
            const newVersion =
              mutationResponse.payload.entities.versions[mutationResponse.payload.result];
            return update({
              ...questionnaire,
              currentVersionId: newVersion.id,
              currentTitle: newVersion.title,
            });
          }}
          render={({ create, loading: creatingVersion }) => {
            const createQuestionnaire = (payload, insertAtIndex) => {
              const newVersion = {
                ...version,
                body: [
                  ...version.body.slice(0, insertAtIndex),
                  {
                    ...payload,
                    id: cuid(),
                  },
                  ...version.body.slice(insertAtIndex),
                ],
              };
              return create(newVersion);
            };
            const updateQuestionnaire = (payload) => {
              // find the question with the same id in the version
              // replace it
              // call create to create the new payload, and then in post
              // take the results and call update the questionnaire
              const newVersion = {
                ...version,
                body: version.body.map((element) => {
                  if (element.id === payload.get('id')) {
                    return payload.toJS();
                  }
                  return element;
                }),
              };
              return create(newVersion);
            };
            return render({
              update: updateQuestionnaire,
              create: createQuestionnaire,
              loading: updatingQuestionnaire || creatingVersion,
            });
          }}
        />
      )}
    />
  );
}

QuestionnaireUpdaterMutation.propTypes = {
  post: PropTypes.func.isRequired,
  questionnaire: PropTypes.shape({
    id: PropTypes.string.isRequired,
    currentTitle: PropTypes.string.isRequired,
    currentVersionId: PropTypes.string.isRequired,
  }).isRequired,
  version: PropTypes.shape({
    id: PropTypes.string.isRequired,
    body: PropTypes.array.isRequired,
  }).isRequired,
  render: PropTypes.func.isRequired,
};
