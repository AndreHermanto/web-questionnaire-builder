import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Query, Resource, Table, Heading, Buttons } from 'web-components';
import { ontologiesSchema, ontologySchema } from './schemas';

const headerRow = [
  {
    label: 'Title',
    propName: 'title',
  },
  {
    label: 'Created by',
    propName: 'creatorName',
  },
];

const renderBodyRow = ({ id, title, creatorName }) => ({
  key: id,
  cells: [<Link to={`/ontologies/${id}`}>{title}</Link>, creatorName || ''],
  actions: [],
});

class OntologiesList extends React.Component {
  static propTypes = {};

  render() {
    return (
      <div>
        <Query
          queries={[
            {
              resourceName: 'ontologies',
              url: '/datasources',
              schema: ontologiesSchema,
            },
          ]}
          render={({ loading, error }) => (
            <Resource
              resources={[
                {
                  resourceName: 'ontologies',
                  schema: ontologySchema,
                },
              ]}
              render={({ ontologies }) => {
                if (loading && !ontologies.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }

                if (ontologies.length === 0 || !ontologies[0]) {
                  return (
                    <Grid>
                      <Grid.Column width={12}>
                        <Message negative>
                          <Message.Header>No ontology found</Message.Header>
                        </Message>
                      </Grid.Column>
                    </Grid>
                  );
                }

                const tableData = ontologies.map(ontology => ({
                  type: 'ontology',
                  ...ontology,
                }));

                return (
                  <div>
                    <Heading size="h1">Ontologies</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={tableData}
                        />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            {
                              content: 'New ontology',
                              to: {
                                pathname: '/ontologies/create',
                                state: { modal: true },
                              },
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

export default OntologiesList;
