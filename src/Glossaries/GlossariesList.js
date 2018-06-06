import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Query, Resource, Table, Heading, Buttons } from 'web-components';
import { glossariesSchema, glossarySchema } from './schemas';

const headerRow = [
  {
    propName: 'name',
    label: 'Glossary Term',
  },
  {
    propName: 'definition',
  },
  {
    propName: 'displayText',
  },
  {
    propName: 'created',
  },
];

const renderBodyRow = ({ id, name }) => ({
  key: id,
  cells: [<Link to={`/glossaries/${id}`}>{name}</Link>],
  actions: [],
});

class GlossariesList extends React.Component {
  static propTypes = {};

  render() {
    return (
      <div>
        <Query
          queries={[
            {
              resourceName: 'glossaries',
              url: '/glossaries',
              schema: glossariesSchema,
            },
          ]}
          render={({ loading, error }) => (
            <Resource
              resources={[
                {
                  resourceName: 'glossaries',
                  schema: glossarySchema,
                },
              ]}
              render={({ glossaries }) => {
                if (loading && !glossaries.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }

                if (glossaries.length === 0 || !glossaries[0]) {
                  return (
                    <Grid>
                      <Grid.Column width={12}>
                        <Message negative>
                          <Message.Header>No glossaries found</Message.Header>
                        </Message>
                      </Grid.Column>
                    </Grid>
                  );
                }

                return (
                  <div>
                    <Heading size="h1">Glossaries</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={glossaries}
                        />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            {
                              content: 'New glossary',
                              to: {
                                pathname: '/glossaries/create',
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

export default GlossariesList;
