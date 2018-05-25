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
        currentVersionId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  render() {
    const {
      match: {
        params: { id, currentVersionId },
      },
    } = this.props;

    return (
      <div>
        <Query
          resourceName="versions"
          url={`/versions/${currentVersionId}`}
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
                              content: 'Edit',
                              to: '/',
                            },
                            {
                              content: 'Duplicate',
                              to: `/questionnaires/${id}/versions/${currentVersionId}/duplicate`,
                            },
                          ]}
                        />
                      </Grid.Column>
                    </Grid>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={version.body.filter(element => element.question)}
                        />
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
