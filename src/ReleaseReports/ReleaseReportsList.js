import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { QueryResource, Table, Heading, Helpers } from 'web-components';
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
  cells: [<Link to={`/release-reports/${id}`}>{Helpers.renderContent('id', id)}</Link>],
  actions: [
    {
      content: 'Edit',
      to: { pathname: `/release-reports/${id}/edit`, state: { modal: true } },
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
      <QueryResource
        queries={[
          {
            name: 'releaseReports',
            resourceName: 'releaseReports',
            url: '/release-reports',
            schema: releaseReportsSchema,
            paginate: true,
            page: 1,
            itemsPerPage: 10,
          },
        ]}
      >
        {({
          releaseReports,
          paginator: {
            releaseReports: { LoadMoreButton },
          },
        }) => {
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
                  <LoadMoreButton />
                </Grid.Column>
              </Grid>
            </div>
          );
        }}
      </QueryResource>
    );
  }
}

export default ReleaseReportsList;
