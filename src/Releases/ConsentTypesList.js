import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { QueryResource, Heading, Table } from 'web-components';
import { consentTypesSchema } from './schemas';

const headerRow = [
  {
    propName: 'title',
  },
];

const renderBodyRow = ({ id, title }) => ({
  key: id,
  cells: [<Link to={`/releases/consents/${id}`}>{title}</Link>],
  actions: [],
});

class ConsentTypesList extends React.Component {
  render() {
    return (
      <div>
        <QueryResource
          queries={[
            {
              resourceName: 'consentTypes',
              url: '/consent-types',
              schema: consentTypesSchema,
            },
          ]}
        >
          {({ consentTypes }) => {
            if (!consentTypes.length) {
              return <div>No consent found.</div>;
            }

            return (
              <div>
                <Heading size="h1">Releases</Heading>
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
        </QueryResource>
      </div>
    );
  }
}

export default ConsentTypesList;
