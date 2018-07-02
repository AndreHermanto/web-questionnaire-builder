import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Table, Heading, Buttons, QueryResource } from 'web-components';
import { ontologiesSchema } from './schemas';

const headerRow = [
  {
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
        <QueryResource
          queries={[
            {
              resourceName: 'ontologies',
              url: '/datasources',
              schema: ontologiesSchema,
            },
          ]}
        >
          {({ ontologies }) => {
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
        </QueryResource>
      </div>
    );
  }
}

export default OntologiesList;
