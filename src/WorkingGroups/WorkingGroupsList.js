import React from 'react';
import { Grid } from 'semantic-ui-react';
import { QueryResource, Table, Heading } from 'web-components';
import { userSchema } from '../Questionnaires/schemas';

const headerRow = [
  {
    propName: 'title',
  },
  {
    propName: 'description',
  },
];

const renderBodyRow = ({ id, title, description }, currentGroupId) => ({
  key: id,
  cells: [
    <p style={id === currentGroupId ? { color: '#1ebc30' } : null}>{title}</p>,
    description || '',
  ],
  actions:
    id === currentGroupId
      ? []
      : [
        {
          content: 'Switch',
          to: { pathname: `/working-groups/${id}/switch`, state: { modal: true } },
        },
      ],
});

class WorkingGroupsList extends React.Component {
  static propTypes = {};
  render() {
    return (
      <QueryResource
        queries={[
          {
            resourceName: 'users',
            url: '/me',
            schema: userSchema,
            one: true,
            name: 'user',
          },
        ]}
      >
        {({ user }) => (
          <div>
            <Heading size="h1">Working Groups</Heading>
            <Grid>
              <Grid.Column width={12}>
                <Table
                  headerRow={headerRow}
                  renderBodyRow={props => renderBodyRow(props, user.currentGroupId)}
                  tableData={user.groups}
                />
              </Grid.Column>
            </Grid>
          </div>
        )}
      </QueryResource>
    );
  }
}

export default WorkingGroupsList;
