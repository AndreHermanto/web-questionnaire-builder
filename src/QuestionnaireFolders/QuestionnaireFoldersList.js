import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { Grid, Message } from 'semantic-ui-react';
import { Query, Resource, Breadcrumbs, Buttons, Table } from 'web-components';
import { questionnaireFoldersSchema } from './schemas';
import { foldersSchema, questionnairesSchema } from '../Questionnaires/schemas';

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

const renderBodyRow = ({ id, currentTitle, creatorName, lastUpdated, status }) => ({
  key: id,
  cells: [currentTitle, creatorName || '', lastUpdated || '', status || ''],
  actions: [],
});

class QuestionnaireFoldersList extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        folderId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  renderBreadcrumbs = folders => (
    <Breadcrumbs
      sections={[
        { content: 'Questionnaires', to: '/#' },
        {
          content: `${get(folders, 0) ? get(folders, 0).title : ''}`,
        },
      ]}
    />
  );

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
            content: 'Edit folder',
            to: '/#',
          },
          {
            content: 'Delete folder',
            to: '/#',
          },
        ]}
      />
    </Grid.Column>
  );

  render() {
    const {
      match: {
        params: { folderId },
      },
    } = this.props;

    return (
      <div>
        <Query
          queries={[
            {
              resourceName: 'folders',
              url: '/folders',
              schema: foldersSchema,
            },
            {
              resourceName: 'questionnaires',
              url: '/questionnaires',
              schema: questionnairesSchema,
            },
            {
              resourceName: 'questionnaireFolders',
              url: '/questionnaire-folders',
              schema: questionnaireFoldersSchema,
            },
          ]}
          render={({ loading, error }) => (
            <Resource
              resources={[
                {
                  resourceName: 'folders',
                  filter: { id: folderId },
                },
                {
                  resourceName: 'questionnaires',
                },
                {
                  resourceName: 'questionnaireFolders',
                },
              ]}
              render={({ questionnaires, questionnaireFolders, folders }) => {
                if (loading && !questionnaireFolders.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }

                if (questionnaireFolders.length === 0 || !questionnaireFolders[0]) {
                  return (
                    <Grid>
                      <Grid.Column width={12}>
                        {this.renderBreadcrumbs(folders)}
                        <Message negative>
                          <Message.Header>No questionnaire found</Message.Header>
                        </Message>
                      </Grid.Column>
                      {this.renderButtons()}
                    </Grid>
                  );
                }
                const tableData = questionnaires.reduce((result, questionnaire) => {
                  questionnaireFolders.map((questionnaireFolder) => {
                    if (questionnaireFolder.questionnaireId === questionnaire.id) {
                      result.push(questionnaire);
                    }
                    return '';
                  });
                  return result;
                }, []);

                return (
                  <Grid>
                    <Grid.Column width={12}>
                      {this.renderBreadcrumbs(folders)}
                      <Table
                        headerRow={headerRow}
                        renderBodyRow={renderBodyRow}
                        tableData={tableData}
                      />
                    </Grid.Column>
                    {this.renderButtons()}
                  </Grid>
                );
              }}
            />
          )}
        />
      </div>
    );
  }
}

export default QuestionnaireFoldersList;
