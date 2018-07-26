import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Heading, Breadcrumbs, Table, Buttons, QueryResource, Helpers } from 'web-components';
import { responsesSchema } from './schemas';
import QuestionnaireQueryResource from './QuestionnaireQueryResource';

const responsesHeaderRow = [
  {
    propName: 'fileName',
  },
  {
    propName: 'creatorName',
  },
  {
    propName: 'format',
    sortBy: response => response.format[0] || '',
  },
  {
    propName: 'dateCreated',
  },
  {
    propName: 'includePartialAnswers',
  },
  {
    propName: 'includeTimestamp',
  },
];

class QuestionnairesResponsesReportList extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  downloadResponses = (questionnaireId, reportId) => {
    window.open(
      `${process.env.REACT_APP_BASE_URL}/download/responses/${questionnaireId}/reports/${reportId}`,
      '_blank',
    );
  };

  render() {
    const {
      match: {
        params: { questionnaireId },
      },
    } = this.props;
    const renderResponsesBodyRow = response => ({
      key: response.downloadResponseId,
      cells: [
        response.fileName,
        response.creatorName,
        response.format,
        response.dateCreated,
        Helpers.renderContent('includePartialAnswers', response.includePartialAnswers),
        Helpers.renderContent('includeTimestamp', response.includeTimestamp),
      ],
      actions: [
        {
          content: 'Download',
          onClick: () => {
            this.downloadResponses(questionnaireId, response.downloadResponseId);
          },
        },
      ],
    });
    return (
      <div>
        <QuestionnaireQueryResource questionnaireId={questionnaireId}>
          {({ versions }) => {
            const version = versions[0];
            return (
              <QueryResource
                queries={[
                  {
                    resourceName: 'responses',
                    url: `/download/responses/${questionnaireId}`,
                    schema: responsesSchema,
                  },
                ]}
              >
                {({ responses }) => {
                  const currentVersionId = version.id;

                  return (
                    <div>
                      <Breadcrumbs
                        sections={[
                          { content: 'Questionnaires', to: '/questionnaires' },
                          { content: version.title, to: `/questionnaires/${questionnaireId}` },
                          { content: 'Response reports' },
                        ]}
                      />
                      <Heading size="h1">Responses</Heading>
                      <Grid>
                        <Grid.Column width={12}>
                          <Table
                            headerRow={responsesHeaderRow}
                            renderBodyRow={renderResponsesBodyRow}
                            tableData={responses}
                          />
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Buttons
                            actions={[
                              {
                                content: 'Generate responses report',
                                to: {
                                  pathname: `/questionnaires/${questionnaireId}/versions/${currentVersionId}/generate-responses-report`,
                                  state: { modal: true },
                                },
                              },
                            ]}
                          />
                        </Grid.Column>
                      </Grid>
                    </div>
                  );
                }}
              </QueryResource>
            );
          }}
        </QuestionnaireQueryResource>
      </div>
    );
  }
}

export default QuestionnairesResponsesReportList;
