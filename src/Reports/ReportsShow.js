import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import {
  QueryResource,
  Breadcrumbs,
  DefinitionList,
  Helpers,
  Buttons,
  Heading,
  Table,
} from 'web-components';
import { responseReportSchema } from './schemas';
import { responsesSchema } from '../Questionnaires/schemas';

const renderProperty = (propertyName, value) => {
  switch (propertyName) {
    case 'id':
      return null;
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value),
      };
  }
};

const headerRow = [
  { propName: 'mrn' },
  { propName: 'completed' },
  { propName: 'pushedToSapio' },
  { propName: 'questionnaireId' },
  { propName: 'created' },
];

const renderBodyRow = payment => ({
  key: payment.id,
  cells: [],
  actions: [],
});

class ReportsShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        responseReportId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: {
        params: { responseReportId },
      },
    } = this.props;

    return (
      <div>
        <QueryResource
          queries={[
            {
              resourceName: 'responseReports',
              url: `/responses-reports/${responseReportId}`,
              schema: responseReportSchema,
              one: true,
              name: 'report',
              filter: { id: responseReportId },
            },
            {
              resourceName: 'responses',
              url: `/responses-reports/${responseReportId}/responses`,
              schema: responsesSchema,
              paginate: true,
              page: 1,
              itemsPerPage: 10,
            },
          ]}
          render={({
            report,
            responses,
            paginator: {
              responses: { LoadMoreButton },
            },
          }) => {
            const reportResponses = responses.filter(response =>
              report.responses.includes(response.id),
            );
            return (
              <div>
                <Grid>
                  <Grid.Column width={12}>
                    <Breadcrumbs
                      sections={[
                        { content: 'Response Reports', to: '/response-reports' },
                        {
                          content: `Report id - ${responseReportId}`,
                        },
                      ]}
                    />
                    <DefinitionList listData={report.query} renderProperty={renderProperty} />
                    <Heading size="h2">Responses</Heading>
                    <Table
                      headerRow={headerRow}
                      renderBodyRow={renderBodyRow}
                      tableData={reportResponses}
                    />
                    <LoadMoreButton />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Buttons
                      actions={[
                        {
                          content: 'Download',
                          onClick: () => {
                            window.open(
                              `${
                                process.env.REACT_APP_BASE_URL
                              }/responses-reports/${responseReportId}/download`,
                              '_blank',
                            );
                          },
                        },
                      ]}
                    />
                  </Grid.Column>
                </Grid>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

export default ReportsShow;
