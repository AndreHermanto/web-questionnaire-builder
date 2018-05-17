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
  Table,
} from 'web-components';
import { Link } from 'react-router-dom';
import { Date } from 'web-components/lib/components/UiComponent';
import { ontologySchema, ontologyVersionsSchema, ontologyVersionSchema } from './schemas';

const headerRow = [
  {
    label: 'Version',
    propName: 'version',
  },
  {
    label: 'Date Created',
    propName: 'dateCreated',
  },
  {
    label: 'Status',
    propName: 'status',
  },
  {
    label: 'Active',
    propName: 'active',
  },
];

const renderBodyRow = ontologyId => ({ id, status, active, dateCreated }) => ({
  key: id,
  positive: active,
  disabled: status !== 'OK',
  cells: [
    <Link to={`/ontologies/${ontologyId}/versions/${id}`}>{Helpers.renderContent('id', id)}</Link>,
    <Date date={dateCreated} format={'MMMM Do YYYY'} />,
    Helpers.renderContent('status', status),
    Helpers.renderContent('active', active),
  ],
  actions: [],
});

// const renderFamilyontologies
const renderProperty = (propertyName, value) => {
  switch (propertyName) {
    case 'id':
      return {
        label: 'Ontology ID',
        value,
      };
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value),
      };
  }
};

class ontologiesShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        ontologyId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: {
        params: { ontologyId },
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
                  schema: ontologyVersionSchema,
                },
              ]}
              render={({ ontologies, ontologyVersions }) => {
                if (loading && !ontologies.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (!ontologies.length) {
                  return <div>No ontologies</div>;
                }

                const ontology = ontologies[0];

                return (
                  <div>
                    <Grid>
                      <Grid.Column width={12}>
                        <Breadcrumbs
                          sections={[
                            { content: 'Ontologies', to: '/ontologies' },
                            {
                              content: `${ontology.title}`,
                              to: `/ontologies/${ontology.id}`,
                            },
                          ]}
                        />
                        <Heading
                          size="h1"
                          subtitle={moment(ontology.dateCreated).format('MMMM Do YYYY, h:mm:ss a')}
                        >
                          {ontology.title}
                        </Heading>
                        <DefinitionList listData={ontology} renderProperty={renderProperty} />

                        <Heading size="h2">Versions</Heading>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow(ontology.id)}
                          tableData={ontologyVersions}
                        />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            {
                              content: 'Edit',
                              to: `/ontologies/${ontology.id}/Edit`,
                            },
                            {
                              content: 'Delete',
                              to: `/ontologies/${ontology.id}/Delete`,
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

export default ontologiesShow;
