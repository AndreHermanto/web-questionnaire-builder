import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { QueryResource, Table, Buttons, Heading, Helpers } from 'web-components';
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
        <QueryResource
          queries={[
            {
              resourceName: 'examples',
              url: '/examples',
              schema: examplesSchema,
              paginate: true,
              itemsPerPage: 10,
            },
          ]}
        >
          {({
            examples,
            paginator: {
              examples: { LoadMoreButton },
            },
          }) => (
            <div>
              <Heading size="h1">Examples</Heading>
              <Grid>
                <Grid.Column width={12}>
                  <Table headerRow={headerRow} renderBodyRow={renderBodyRow} tableData={examples} />
                  <LoadMoreButton />
                </Grid.Column>
                <Grid.Column width={4}>
                  <Buttons
                    actions={[
                      {
                        content: 'Add Example',
                        to: { pathname: '/examples/create', state: { modal: true } },
                        'data-test': 'add-example-button',
                      },
                      {
                        content: 'Second Button',
                        onClick: () => window.alert('hello world!'), //eslint-disable-line
                      },
                    ]}
                  />
                </Grid.Column>
              </Grid>
            </div>
          )}
        </QueryResource>
      </div>
    );
  }
}

export default ExamplesList;
