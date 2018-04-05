import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Query, Resource, Table, Buttons, Heading, Helpers } from 'web-components';
import { examplesSchema } from './schemas';

const headerRow = [
  {
    propName: 'id',
  },
  {
    propName: 'title',
  },
  {
    propName: 'age',
  },
  {
    propName: 'category',
  },
  {
    propName: 'timestamp',
  },
];

const renderBodyRow = ({ id }) => ({
  key: id,
  cells: [<Link to={`/examples/${id}`}>{Helpers.renderContent('id', id)}</Link>],
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
          pagination
          page={1}
          itemsPerPage={2}
          render={({ loading, error, examples: exampleReports }) => (
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
                    <Heading size="h1">Examples</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={examples}
                        />
                        {exampleReports.isLastPage ? (
                          ''
                        ) : (
                          <Button floated="right" onClick={exampleReports.loadMore}>
                            More
                          </Button>
                        )}
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons actions={[]} />
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
