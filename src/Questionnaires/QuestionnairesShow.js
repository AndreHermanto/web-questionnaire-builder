import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import {
  Query,
  Resource,
  Heading,
  Breadcrumbs,
  DefinitionList,
  Helpers,
  Table,
  Buttons,
} from 'web-components';
import { versionSchema } from './schemas';

const renderProperty = (propertyName, value, pricePlan) => {
  switch (propertyName) {
    case 'body':
    case 'id':
      return null;
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value, pricePlan),
      };
  }
};

const headerRow = [
  {
    label: 'Questions',
  },
  {
    label: 'Type',
  },
];

const renderBodyRow = ({ id, question, type }) => ({
  key: id,
  cells: [question, type],
  actions: [
    {
      content: 'Edit',
      to: { pathname: '' },
    },
  ],
});

class QuestionnairesShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
        currentVersionId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  downloadQuestionnaire = (questionnaireId, currentVersionId) => {
    window.open(
      `${
        process.env.REACT_APP_BASE_URL
      }/questionnaires/export?questionnaireId=${questionnaireId}&versionId=${currentVersionId}`,
      '_blank',
    );
  };
  render() {
    const {
      match: {
        params: { questionnaireId, currentVersionId },
      },
    } = this.props;

    return (
      <div>
        <Query
          resourceName="versions"
          url={`/questionnaires/${questionnaireId}/versions/${currentVersionId}`}
          schema={versionSchema}
          render={({ loading, error }) => (
            <Resource
              resourceName="versions"
              filter={{ id: currentVersionId }}
              render={({ versions }) => {
                if (loading && !versions.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (!versions.length) {
                  return <div>No Versions</div>;
                }
                const version = versions[0];
                return (
                  <div>
                    <Breadcrumbs
                      sections={[
                        { content: 'Questionnaires', to: '/questionnaires' },
                        { content: version.title },
                      ]}
                    />
                    <Heading size="h1">{version.title}</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <DefinitionList listData={version} renderProperty={renderProperty} />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            {
                              content: 'Delete',
                              to: `/questionnaires/${questionnaireId}/delete`,
                            },
                            {
                              content: 'Download',
                              onClick: () =>
                                this.downloadQuestionnaire(questionnaireId, currentVersionId),
                            },
                            {
                              content: 'Export questionnaire',
                              to: {
                                pathname: `/questionnaires/${questionnaireId}/versions/${currentVersionId}/export`,
                                state: { modal: true },
                              },
                            },
                            {
                              content: 'Move to Folder',
                              to: `/questionnaires/${version.questionnaireId}/versions/${
                                version.id
                              }/move-to-folder`,
                            },
                            {
                              content: 'Duplicate',
                              to: `/questionnaires/${questionnaireId}/versions/${currentVersionId}/duplicate`,
                            },
                          ]}
                        />
                      </Grid.Column>
                    </Grid>
                    <Grid>
                      <Grid.Column width={12}>
                        {version.body && (
                          <Table
                            headerRow={headerRow}
                            renderBodyRow={renderBodyRow}
                            tableData={version.body.filter(element => element.question)}
                          />
                        )}
                      </Grid.Column>
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

export default QuestionnairesShow;
