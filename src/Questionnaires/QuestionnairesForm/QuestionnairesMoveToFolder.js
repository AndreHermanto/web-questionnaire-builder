import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation } from 'web-components';
import { foldersSchema } from '../schemas';
import { questionnaireFoldersSchema } from '../../QuestionnaireFolders/schemas';
import QuestionnairesMoveToFolderForm from './QuestionnairesMoveToFolderForm';

function QuestionnairesMoveToFolder({
  closePanel,
  match: {
    params: { questionnaireId },
  },
}) {
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'folders',
          url: '/folders',
          schema: foldersSchema,
        },
        {
          resourceName: 'questionnaireFolders',
          url: '/questionnaire-folders',
          schema: questionnaireFoldersSchema,
          filter: { questionnaireId },
        },
      ]}
      render={({ folders, questionnaireFolders }) => {
        let questionnaireFolder = { folderId: 'home' };
        if (questionnaireFolders.length > 0) {
          questionnaireFolder = questionnaireFolders[0];
        }

        const foldersPlusHome = [{ id: 'home', title: 'Home' }, ...folders];
        return (
          <Mutation
            resourceName="questionnaireFolders"
            url={'/questionnaire-folders'}
            schema={questionnaireFoldersSchema}
            post={closePanel}
            render={({ create, loading: pending }) => {
              if (pending) {
                return <div>loading...</div>;
              }
              return (
                <Mutation
                  resourceName="questionnaireFolders"
                  url={`/questionnaire-folders/${questionnaireFolder.id}`}
                  schema={questionnaireFoldersSchema}
                  post={closePanel}
                  render={({ remove }) => (
                    <QuestionnairesMoveToFolderForm
                      initialValues={{ folder: questionnaireFolder.folderId }}
                      folders={foldersPlusHome}
                      onSubmit={(values) => {
                        const newFolderId = values.get('folder');
                        if (newFolderId !== questionnaireFolder.folderId) {
                          if (questionnaireFolder.folderId !== 'home') {
                            remove(questionnaireFolder.id);
                          }
                          if (newFolderId !== 'home') {
                            create({ folderId: newFolderId, questionnaireId });
                          }
                        }
                      }}
                      onCancel={closePanel}
                    />
                  )}
                />
              );
            }}
          />
        );
      }}
    />
  );
}

QuestionnairesMoveToFolder.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QuestionnairesMoveToFolder;
