import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Query, Resource, Table, Heading, Buttons } from 'web-components';
import { questionnaireSchema, questionnairesSchema, folderSchema, foldersSchema } from './schemas';

const CustomLink = styled(Link)`
  i {
    vertical-align: bottom;
  }
  .folder {
    font-weight: 600;
  }
`;
const headerRow = [
  {
    label: 'Title',
    propName: 'currentTitle',
  },
  {
    label: 'Created by',
    propName: 'creatorName',
  },
  {
    label: 'Last modified',
    propName: 'lastUpdated',
  },
  {
    label: 'Status',
    propName: 'status',
  },
];

const renderBodyRow = ({
  id,
  type,
  currentTitle,
  creatorName,
  lastUpdated,
  status,
  currentVersionId,
}) => ({
  key: id,
  cells: [
    <span>
      {type === 'folder' ? (
        <CustomLink to={`/folders/${id}`}>
          <i className="material-icons">folder_open </i>
          <span className={type}>{currentTitle}</span>
        </CustomLink>
      ) : (
        <CustomLink to={`/questionnaires/${id}/versions/${currentVersionId}`}>
          <span className={type}>{currentTitle}</span>
        </CustomLink>
      )}
    </span>,
    creatorName || '',
    lastUpdated || '',
    status || '',
  ],
  actions: [],
});

class QuestionnairesList extends React.Component {
  static propTypes = {};
  renderButtons = () => (
    <Grid.Column width={4}>
      <Buttons
        actions={[
          {
            content: 'New Questionnaire',
            to: {
              pathname: '/#',
              state: { modal: true },
            },
          },
          {
            content: 'Import',
            to: '/#',
          },
          {
            content: 'Import from file',
            to: '/#',
          },
        ]}
      />
    </Grid.Column>
  );

  render() {
    return (
      <div>
        <Query
          queries={[
            {
              resourceName: 'questionnaires',
              url: '/questionnaires',
              schema: questionnairesSchema,
            },
            {
              resourceName: 'folders',
              url: '/folders',
              schema: foldersSchema,
            },
          ]}
          render={({ loading, error }) => (
            <Resource
              resources={[
                {
                  resourceName: 'questionnaires',
                  schema: questionnaireSchema,
                },
                {
                  resourceName: 'folders',
                  schema: folderSchema,
                },
              ]}
              render={({ questionnaires, folders }) => {
                if (loading && !questionnaires.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (questionnaires.length === 0 || !questionnaires[0]) {
                  return (
                    <Grid>
                      <Grid.Column width={12}>
                        <Message negative>
                          <Message.Header>No questionnaire found</Message.Header>
                        </Message>
                      </Grid.Column>
                      {this.renderButtons()}
                    </Grid>
                  );
                }

                const tableData = folders
                  .map(folder => ({
                    type: 'folder',
                    currentTitle: folder.title,
                    ...folder,
                  }))
                  .map(folder => ({ type: 'folder', currentTitle: folder.title, ...folder }))
                  .concat(
                    questionnaires.map(questionnaire => ({
                      type: 'questionnaire',
                      ...questionnaire,
                    })),
                  );
                return (
                  <div>
                    <Heading size="h1">Questionnaires</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={tableData}
                        />
                      </Grid.Column>
                      {this.renderButtons()}
                    </Grid>
                  </div>
                );
              }}
            />
          )}
        />
      </div>
    );
  }
}

export default QuestionnairesList;
