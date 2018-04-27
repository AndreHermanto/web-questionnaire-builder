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
import { Date } from 'web-components/lib/components/UiComponent';
import { ontologySchema, ontologyVersionsSchema, ontologyVersionSchema } from './schemas';

const headerRow = [
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

const renderBodyRow = ({ id, status, active, dateCreated }) => ({
  key: id,
  positive: active,
  disabled: status !== 'OK',
  cells: [<Date date={dateCreated} format={'MMMM Do YYYY'} />, status || '', active ? 'Yes' : 'No'],
  actions: [
    {
      content: 'Activate',
      to: `/ontologies/${id}/edit`,
      state: { modal: true },
    },
    {
      content: 'Diff report',
      to: `/ontologies/${id}/edit`,
      state: { modal: true },
    },
  ],
});

// const renderFamilyontologies
const renderProperty = (propertyName, value) => {
  switch (propertyName) {
    case 'id':
      return {
        label: 'Ontology ID',
        value,
      };
    case 'acronym':
      return {
        label: 'Acronym',
        value,
      };
    case 'category':
      return {
        label: 'Category',
        value,
      };
    case 'notificationActive':
      return {
        label: 'Notification Active',
        value: value ? 'Yes' : 'No',
      };
    case 'notificationEmail':
      return {
        label: 'Notification Email',
        value,
      };
    case 'managementType':
      return {
        label: 'Management Type',
        value,
      };
    case 'description':
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value),
      };
    default:
      return null;
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
    const { match: { params: { ontologyId } } } = this.props;

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
              render={({ ontologies = [], ontologyVersions = [] }) => {
                if (loading) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (ontologies.length === 0) {
                  return <div>ontologies not found</div>;
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
                          renderBodyRow={renderBodyRow}
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
