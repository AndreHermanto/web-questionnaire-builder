import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Query, Resource, Table, Buttons, Heading } from 'web-components';
import { examplesSchema } from './schemas';

const headerRow = [
  {
    label: 'ID',
    propName: 'id',
  },
  {
    label: 'Title',
    propName: 'title',
  },
  {
    label: 'Age',
    propName: 'age',
  },
  {
    label: 'Category',
    propName: 'category',
  },
  {
    label: 'Date',
    propName: 'timestamp',
  },
];

const renderBodyRow = ({ id, title, age, category, timestamp }) => ({
  key: id,
  cells: [<Link to={`/examples/${id}`}>{id}</Link>, title, age, category, timestamp],
  actions: [
    {
      content: 'Edit',
      to: { pathname: `/examples/${id}/edit`, state: { modal: true } },
    },
  ],
});

class ExamplesList extends React.Component {
  static propTypes = {};
  render() {
    return (
      <div>
        <Query
          resourceName="examples"
          url="/examples"
          schema={examplesSchema}
          render={({ loading, error }) => (
            <Resource
              resourceName="examples"
              render={({ examples }) => {
                if (loading && !examples.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                return (
                  <div>
                    <Heading size="h1">web-components-authentication Demo</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={examples}
                        />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            {
                              content: 'Add Example',
                              to: { pathname: '/examples/create', state: { modal: true } },
                            },
                            {
                              content: 'Second Button',
                              onClick: () => window.alert('hello world!'),
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

export default ExamplesList;
