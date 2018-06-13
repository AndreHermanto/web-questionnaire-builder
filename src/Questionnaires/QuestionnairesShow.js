import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {
  Heading,
  Breadcrumbs,
  DefinitionList,
  Helpers,
  Table,
  Buttons,
  QueryResource,
} from 'web-components';
import { userSchema } from './schemas';
import QuestionnaireQueryResource from './QuestionnaireQueryResource';

const renderProperty = (propertyName, value, pricePlan) => {
  switch (propertyName) {
    case 'body':
    case 'id':
      return null;
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value, pricePlan),
      };
  }
};

const headerRow = [
  {
    propName: element => element.title || element.question || element.text,
    label: 'Content',
  },
  {
    propName: 'type',
  },
];

class QuestionnairesShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  downloadQuestionnaire = (questionnaireId, currentVersionId) => {
    window.open(
      `${
        process.env.REACT_APP_BASE_URL
      }/questionnaires/export?questionnaireId=${questionnaireId}&versionId=${currentVersionId}`,
      '_blank',
    );
  };
  render() {
    const {
      match: {
        params: { questionnaireId },
      },
    } = this.props;
    const renderBodyRow = ({ id, question, title, type, text }) => ({
      key: id,
      cells: [
        <Link to={`/questionnaires/${questionnaireId}/elements/${id}`}>
          {question || title || text}
        </Link>,
        type,
      ],
      actions: [
        {
          content: 'Edit',
          to: `/questionnaires/${questionnaireId}/elements/${id}/edit`,
        },
        {
          content: 'Delete',
          to: {
            pathname: `/questionnaires/${questionnaireId}/elements/${id}/delete`,
            state: { modal: true },
          },
        },
        {
          content: 'Re-Order',
          to: {
            pathname: `/questionnaires/${questionnaireId}/elements/${id}/reorder`,
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
                    resourceName: 'users',
                    url: '/me',
                    schema: userSchema,
                  },
                ]}
              >
                {({ users }) => {
                  const user = users[0];
                  const currentVersionId = version.id;

                  return (
                    <div>
                      <Breadcrumbs
                        sections={[
                          { content: 'Questionnaires', to: '/questionnaires' },
                          { content: version.title },
                        ]}
                      />
                      <Heading size="h1">{version.title}</Heading>
                      <Grid>
                        <Grid.Column width={12}>
                          <DefinitionList listData={version} renderProperty={renderProperty} />
                          {version.body && (
                            <Table
                              headerRow={headerRow}
                              renderBodyRow={props => renderBodyRow(props, currentVersionId)}
                              tableData={version.body}
                            />
                          )}
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Buttons
                            actions={[
                              {
                                content: 'Delete',
                                to: `/questionnaires/${questionnaireId}/delete`,
                              },
                              {
                                content: 'Download',
                                onClick: () =>
                                  this.downloadQuestionnaire(questionnaireId, currentVersionId),
                              },
                              {
                                content: 'Export questionnaire',
                                to: {
                                  pathname: `/questionnaires/${questionnaireId}/versions/${currentVersionId}/export`,
                                  state: { modal: true },
                                },
                              },
                              {
                                content: 'Move to Folder',
                                to: `/questionnaires/${version.questionnaireId}/versions/${
                                  version.id
                                }/move-to-folder`,
                              },
                              {
                                content: 'Duplicate',
                                to: `/questionnaires/${questionnaireId}/versions/${currentVersionId}/duplicate`,
                              },
                              {
                                content: 'Generate responses report',
                                to: {
                                  pathname: `/questionnaires/${questionnaireId}/versions/${currentVersionId}/generate-responses-report`,
                                  state: { modal: true },
                                },
                              },
                              {
                                content: 'Preview as Patient',
                                to: {
                                  pathname: `/questionnaires/${questionnaireId}/versions/${currentVersionId}/user/${
                                    user.id
                                  }/preview-patient`,
                                  state: { modal: true },
                                },
                              },
                              {
                                content: 'Import version',
                                to: `/questionnaires/${questionnaireId}/versions/${currentVersionId}/import-version`,
                              },
                              {
                                content: 'Create questions',
                                to: {
                                  pathname: `/questionnaires/${questionnaireId}/elements/create`,
                                  state: { modal: true },
                                },
                              },
                              {
                                content: 'Create Sections',
                                to: {
                                  pathname: `/questionnaires/${questionnaireId}/elements/section/create`,
                                  state: { modal: true },
                                },
                              },
                              ...(!version.body.find(element => element.type === 'start') && [
                                {
                                  content: 'Create start page',
                                  to: {
                                    pathname: `/questionnaires/${questionnaireId}/elements/create-start-page`,
                                    state: { modal: true },
                                  },
                                },
                              ]),
                              ...(!version.body.find(element => element.type === 'end') && [
                                {
                                  content: 'Create end page',
                                  to: {
                                    pathname: `/questionnaires/${questionnaireId}/elements/create-end-page`,
                                    state: { modal: true },
                                  },
                                },
                              ]),
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

export default QuestionnairesShow;
