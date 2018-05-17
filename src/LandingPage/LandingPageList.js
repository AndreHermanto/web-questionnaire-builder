import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Query, Resource, Table, Heading } from 'web-components';
import { consentTypesSchema } from './schemas';

const headerRow = [
  {
    label: 'Landing Page',
    propName: 'title',
  },
];

const renderBodyRow = ({ id, title }) => ({
  key: id,
  cells: [<Link to={`/landing-page/consents/${id}`}> {title || ''}</Link>],
  actions: [],
});

class LandingPageList extends React.Component {
  render() {
    return (
      <div>
        <Query
          resourceName={'consentTypes'}
          url={'/consent-types'}
          schema={consentTypesSchema}
          render={({ loading, error }) => (
            <Resource
              resourceName={'consentTypes'}
              render={({ consentTypes }) => {
                if (loading && !consentTypes.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (consentTypes.length === 0 || !consentTypes[0]) {
                  return (
                    <Grid>
                      <Grid.Column width={12}>
                        <Message negative>
                          <Message.Header>No consent found</Message.Header>
                        </Message>
                      </Grid.Column>
                    </Grid>
                  );
                }

                return (
                  <div>
                    <Heading size="h1">Landing Pages</Heading>
                    <p>Select a consent to edit the title, heading and text.</p>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={consentTypes}
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

export default LandingPageList;
