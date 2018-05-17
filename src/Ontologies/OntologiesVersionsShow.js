import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
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
import { ontologySchema, ontologyVersionsSchema, ontologyVersionSchema } from './schemas';

// const renderFamilyontologies
const renderProperty = (ontologyId, versionId) => (propertyName, value) => {
  switch (propertyName) {
    case 'releaseVersion':
      return {
        label: propertyName,
        value: (
          <div>
            {value} <br />
            <Link to={`/ontologies/${ontologyId}/versions/${versionId}/diff-report`}>
              Show diff-report
            </Link>
          </div>
        ),
      };
    case 'active':
    case 'newer':
    case 'download':
      return {
        label: propertyName,
        value: value.toString(),
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
      <div>
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
              ]}
              render={({ ontologies, ontologyVersions }) => {
                if (loading && !ontologies.length && !ontologyVersions.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (!ontologies.length || !ontologyVersions.length) {
                  return <div>No ontologies</div>;
                }

                const ontology = ontologies[0];
                const ontologyVersion = ontologyVersions[0];

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
                        <DefinitionList
                          listData={ontologyVersion}
                          renderProperty={renderProperty(ontologyId, versionId)}
                        />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            {
                              content: 'Activate',
                              to: `/ontologies/${ontologyId}/versions/${versionId}/activate/`,
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
      </div>
    );
  }
}

export default OntologiesVersionsShow;
