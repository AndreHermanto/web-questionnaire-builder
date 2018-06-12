import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { QueryResource, Table, Heading, Buttons } from 'web-components';
import { glossaryTermsSchema } from './schemas';

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
  cells: [<Link to={`/glossary-terms/${id}`}>{name}</Link>],
  actions: [],
});

class GlossaryTermsList extends React.Component {
  static propTypes = {};

  render() {
    return (
      <div>
        <QueryResource
          queries={[
            {
              resourceName: 'glossaryTerms',
              url: '/glossary-terms',
              schema: glossaryTermsSchema,
            },
          ]}
          render={({ glossaryTerms }) => (
            <div>
              <Heading size="h1">Glossary Terms</Heading>
              <Grid>
                <Grid.Column width={12}>
                  <Table
                    headerRow={headerRow}
                    renderBodyRow={renderBodyRow}
                    tableData={glossaryTerms}
                  />
                </Grid.Column>
                <Grid.Column width={4}>
                  <Buttons
                    actions={[
                      {
                        content: 'New glossary',
                        to: {
                          pathname: '/glossary-terms/create',
                          state: { modal: true },
                        },
                      },
                    ]}
                  />
                </Grid.Column>
              </Grid>
            </div>
          )}
        />
      </div>
    );
  }
}

export default GlossaryTermsList;
