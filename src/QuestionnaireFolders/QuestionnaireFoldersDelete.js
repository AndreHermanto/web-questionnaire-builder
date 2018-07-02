import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation, QueryResource } from 'web-components';
import { questionnaireFoldersSchema } from './schemas';

export default function QuestionnaireFoldersDelete({
  closePanel,
  history,
  match: {
    params: { folderId },
  },
}) {
  // We load all the questionnaireFolders so we acn delete them from
  // cache after we delete the folder from the backend
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'questionnaireFolders',
          url: '/questionnaire-folders',
          schema: questionnaireFoldersSchema,
          filter: {
            folderId,
          },
        },
      ]}
    >
      {({ questionnaireFolders }) => (
        <Mutation
          resourceName="folders"
          url={`/folders/${folderId}`}
          schema={questionnaireFoldersSchema}
          update={({ remove }) =>
            Promise.all(
              questionnaireFolders.map(questionnaireFolder =>
                remove({
                  resourceName: 'questionnaireFolders',
                  resourceId: questionnaireFolder.id,
                }),
              ),
            )
          }
          post={() => {
            history.push('/questionnaires');
          }}
          render={({ remove, loading: pending }) => {
            if (pending) {
              return <div>Deleting folder...</div>;
            }
            return (
              <Confirmation
                title="Are you sure you want to delete this folder?"
                content="This only deletes this folder, all questionnaires inside this folder will be moved to the Home section, and will not be deleted."
                confirmLabel="Yes"
                cancelLabel="No"
                onConfirm={() => remove(folderId)}
                onCancel={closePanel}
              />
            );
          }}
        />
      )}
    </QueryResource>
  );
}

QuestionnaireFoldersDelete.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      folderId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
};
