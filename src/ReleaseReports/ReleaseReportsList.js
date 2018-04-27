import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Query, Resource, Table, Buttons, Heading, Helpers } from 'web-components';
import { releaseReportsSchema } from './schemas';

const headerRow = [
  {
    propName: 'id',
  },
  {
    propName: 'releaseId',
  },
  {
    propName: 'questionnaireId',
  },
  {
    propName: 'fileName',
  },
  {
    propName: 'password',
  },
  {
    propName: 'dateCreated',
  },
  {
    propName: 'totalResponses',
  },
  {
    propName: 'totalReceivedSinceLastReport',
  },
  {
    propName: 'totalCompletedSinceLastReport',
  },
];

const renderBodyRow = ({ id, releaseId }) => ({
  key: id,
  cells: [<Link to={`/releases/${id}`}>{Helpers.renderContent('id', id)}</Link>],
  actions: [
    {
      content: 'Edit',
      to: { pathname: `/releases/${id}/edit`, state: { modal: true } },
    },
    {
      content: (
        <a
          href={`${
            process.env.REACT_APP_BASE_URL
          }/releases/${releaseId}/download?releaseReportId=${id}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Download
        </a>
      ),
    },
  ],
});

class ReleaseReportsList extends React.Component {
  static propTypes = {};
  render() {
    return (
      <div>
        <Query
          resourceName="releaseReports"
          url="/release-reports"
          schema={releaseReportsSchema}
          render={({ loading, error }) => (
            <Resource
              resourceName="releaseReports"
              render={({ releaseReports }) => {
                if (loading && !releaseReports.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (releaseReports.length === 0 || !releaseReports[0]) {
                  return (
                    <Grid>
                      <Grid.Column width={12}>
                        <Message negative>
                          <Message.Header>No questionnaire found</Message.Header>
                        </Message>
                      </Grid.Column>
                    </Grid>
                  );
                }
                return (
                  <div>
                    <Heading size="h1">Release Reports</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={releaseReports}
                        />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            {
                              content: 'Add Release Report',
                              to: { pathname: '/releases/create', state: { modal: true } },
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

export default ReleaseReportsList;
