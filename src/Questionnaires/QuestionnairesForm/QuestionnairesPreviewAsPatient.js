import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation, Buttons } from 'web-components';
import { previewResponsesSchema, previewResponseSchema, encryptedTokenSchema } from '../schemas';

function QuestionnairesPreviewAsPatient({
  closePanel,
  match: {
    params: { questionnaireId, userId },
  },
}) {
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'previewResponses',
          url: `/preview-responses?userId=${userId}&questionnaireId=${questionnaireId}`,
          schema: previewResponsesSchema,
        },
      ]}
      render={({ previewResponses }) => (
        <Mutation
          resourceName="encryptedToken"
          url={'/secure'}
          schema={encryptedTokenSchema}
          post={async (mutationResponse, actions) => {
            if (Array.isArray(previewResponses) && previewResponses.length > 0) {
              previewResponses.forEach(async (response) => {
                const removeResponsesMutation = {
                  resourceName: 'previewResponses',
                  url: `/preview-responses/${response.id}`,
                  schema: previewResponseSchema,
                };
                await actions.remove(removeResponsesMutation, response.id);
              });
            }

            const token =
              mutationResponse.payload.entities.encryptedToken[mutationResponse.payload.result];
            window.location.assign(
              `${process.env.REACT_APP_QUESTIONNAIRE_FORM_URL}/users/${token.userId}/${
                token.consentTypeId
              }/${questionnaireId}/preview?timestamp=${token.timestamp}`,
            );
          }}
          render={({ create, loading: pending, error }) => {
            if (pending) {
              return <div>Moving to patient...</div>;
            }
            if (error) {
              return <div>Error: {error}</div>;
            }
            return (
              <Buttons
                actions={[
                  {
                    content: 'Go to Patient',
                    type: 'button',
                    onClick: () => create({ userId }),
                  },
                  {
                    content: 'Cancel',
                    onClick: closePanel,
                    type: 'button',
                  },
                ]}
              />
            );
          }}
        />
      )}
    />
  );
}

QuestionnairesPreviewAsPatient.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QuestionnairesPreviewAsPatient;
