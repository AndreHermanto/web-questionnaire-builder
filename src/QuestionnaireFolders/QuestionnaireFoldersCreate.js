import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import { folderSchema } from './schemas';
import QuestionnaireFoldersForm from './QuestionnaireFoldersForm';

export default function QuestionnaireFoldersCreate({ closePanel }) {
  return (
    <div>
      <Mutation
        resourceName="folders"
        url={'/folders'}
        schema={folderSchema}
        post={closePanel}
        render={({ create, loading: pending, error }) => {
          if (pending) {
            return <div>Creating folder...</div>;
          }
          if (error) {
            return <div>Error: {error}</div>;
          }

          return <QuestionnaireFoldersForm onSubmit={create} onCancel={closePanel} />;
        }}
      />
    </div>
  );
}

QuestionnaireFoldersCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
};
