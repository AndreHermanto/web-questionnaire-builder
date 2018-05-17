import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import moment from 'moment';
import {
  Query,
  Resource,
  Buttons,
  Heading,
  Breadcrumbs,
  DefinitionList,
  Helpers,
} from 'web-components';
import {
  ontologySchema,
  ontologyVersionSchema,
  ontologyVersionsSchema,
  diffReportsSchema,
} from './schemas';

/* eslint max-len: */
/* eslint jsx-a11y/no-static-element-interactions: off */
/* eslint jsx-a11y/anchor-is-valid: off */
const clickDownload = ({ datasourceId, fromVersionId, toVersionId }) => {
  window.open(
    `${
      process.env.REACT_APP_BASE_URL
    }/diff-reports/download?datasourceId=${datasourceId}&fromVersionId=${fromVersionId}&toVersionId=${toVersionId}`,
    '_blank',
  );
};
const renderProperty = (propertyName, value) => {
  switch (propertyName) {
    case 'datasourceId':
      return {
        label: 'Ontology ID',
        value,
      };
    case 'fileName':
      return {
        label: Helpers.renderLabel(propertyName),
        value,
      };
    case 'fromVersion':
    case 'fromVersionId':
    case 'toVersion':
    case 'toVersionId':
    case 'newConcepts':
    case 'changedConcepts':
    case 'retiredConcepts':
      return {
        label: propertyName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value,
      };
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value),
      };
  }
};

class OntologiesVersionsShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        ontologyId: PropTypes.string.isRequired,
        versionId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: {
        params: { ontologyId, versionId },
      },
    } = this.props;
    return (
      <Query
        queries={[
          {
            resourceName: 'ontologies',
            url: `/datasources/${ontologyId}`,
            schema: ontologySchema,
          },
          {
            resourceName: 'ontologyVersions',
            url: `/datasources/${ontologyId}/versions`,
            schema: ontologyVersionsSchema,
          },
          {
            resourceName: 'diffReports',
            url: `/diff-reports?datasourceId=${ontologyId}&versionId=${versionId}`,
            schema: diffReportsSchema,
          },
        ]}
        render={({ loading, error }) => (
          <Resource
            resources={[
              {
                resourceName: 'ontologies',
                filter: { id: ontologyId },
                schema: ontologySchema,
              },
              {
                resourceName: 'ontologyVersions',
                filter: { id: versionId },
                schema: ontologyVersionSchema,
              },
              {
                resourceName: 'diffReports',
                filter: { fromVersionId: versionId },
              },
            ]}
            render={({ ontologies, ontologyVersions, diffReports }) => {
              if (loading && !diffReports.length) {
                return <div>loading...</div>;
              }
              if (error) {
                return <div>Error: {error}</div>;
              }
              if (!diffReports.length || !ontologies.length || !ontologyVersions.length) {
                return <div>No diffReports</div>;
              }
              const ontology = ontologies[0];
              const ontologyVersion = ontologyVersions[0];
              const diffReport = diffReports[0];

              return (
                <div>
                  <Grid>
                    <Grid.Column width={12}>
                      <Breadcrumbs
                        sections={[
                          { content: 'Ontologies', to: '/ontologies' },
                          {
                            content: `${ontology.title}`,
                            to: `/ontologies/${ontologyId}`,
                          },
                          {
                            content: 'versions',
                            to: `/ontologies/${ontologyId}/versions/`,
                          },
                          {
                            content: ontologyVersion.version,
                            to: `/ontologies/${ontologyId}/versions/${versionId}`,
                          },
                          {
                            content: 'Diff Report',
                            to: `/ontologies/${ontologyId}/versions/${versionId}/diff-report`,
                          },
                        ]}
                      />
                      <Heading
                        size="h1"
                        subtitle={moment(ontologyVersion.dateCreated).format(
                          'MMMM Do YYYY, h:mm:ss a',
                        )}
                      >
                        {ontologyVersion.version}
                      </Heading>
                      <DefinitionList listData={diffReport} renderProperty={renderProperty} />
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <Buttons
                        actions={[
                          {
                            content: 'Download',
                            onClick: () => clickDownload(diffReport),
                          },
                        ]}
                      />
                    </Grid.Column>
                  </Grid>
                </div>
              );
            }}
          />
        )}
      />
    );
  }
}

export default OntologiesVersionsShow;
