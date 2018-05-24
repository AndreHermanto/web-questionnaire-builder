import React from 'react';
import PropTypes from 'prop-types';
import { Query, Resource, Mutation } from 'web-components';
import { foldersSchema, folderSchema } from './schemas';
import QuestionnaireFoldersForm from './QuestionnaireFoldersForm';

export default function QuestionnaireFoldersCreate({
  closePanel,
  match: {
    params: { folderId },
  },
}) {
  return (
    <div>
      <Query
        resourceName="folders"
        url={'/folders'}
        schema={foldersSchema}
        render={({ loading, error }) => (
          <Resource
            resourceName="folders"
            filter={{ id: folderId }}
            render={({ folders }) => {
              if (loading && !folders.length) {
                return <div>Updating...</div>;
              }
              if (error) {
                return <div>Error: {error}</div>;
              }
              const folder = folders[0];
              return (
                <Mutation
                  resourceName="folders"
                  url={`/folders/${folderId}`}
                  schema={folderSchema}
                  post={closePanel}
                  render={({ update, loading: pending, error: updateError }) => {
                    if (pending) {
                      return <div>Creating folder...</div>;
                    }
                    if (updateError) {
                      return <div>Error: {updateError}</div>;
                    }

                    return (
                      <QuestionnaireFoldersForm
                        onSubmit={update}
                        onCancel={closePanel}
                        initialValues={folder}
                      />
                    );
                  }}
                />
              );
            }}
          />
        )}
      />
    </div>
  );
}

QuestionnaireFoldersCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      orderId: PropTypes.string.isRequired,
      notesId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
