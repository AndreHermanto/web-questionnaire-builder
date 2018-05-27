import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Query, Resource, Table, Buttons, Heading, Helpers } from 'web-components';
import { elementsSchema } from './schemas';

const headerRow = [
  {
    propName: 'id',
  },
  {
    propName: 'type',
  },
  {
    propName: 'question',
  },
];

const renderBodyRow = ({ id }) => ({
  key: id,
  cells: [<Link to={`/elements/${id}`}>{Helpers.renderContent('id', id)}</Link>],
  actions: [
    {
      content: 'Edit',
      to: { pathname: `/elements/${id}/edit`, state: { modal: true } },
    },
    {
      content: 'Delete',
      to: { pathname: `/elements/${id}/delete`, state: { modal: true } },
    },
  ],
});

class ElementsList extends React.Component {
  static propTypes = {};
  render() {
    return (
      <div>
        <Query
          resourceName="elements"
          url="/elements"
          schema={elementsSchema}
          pagination
          page={1}
          itemsPerPage={10}
          render={({ loading, error, elements: elementReports }) => (
            <Resource
              resourceName="elements"
              render={({ elements }) => {
                if (loading && !elements.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                return (
                  <div>
                    <Heading size="h1">Elements</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={elements}
                        />
                        {elementReports.isLastPage ? (
                          ''
                        ) : (
                          <Button floated="right" onClick={elementReports.loadMore}>
                            More
                          </Button>
                        )}
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            {
                              content: 'Add Element',
                              to: { pathname: '/elements/create', state: { modal: true } },
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

export default ElementsList;
