import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { QueryResource, Breadcrumbs, Date, Table } from 'web-components';
import { releasesSchema, consentTypesSchema } from './schemas';
import { questionnairesSchema } from '../Questionnaires/schemas';

const headerRow = [
  {
    propName: 'title',
  },
  {
    propName: 'afterPayment',
    label: 'Requires Payment',
  },
];

const renderBodyRow = ({ id, title, versionPublished, afterPayment }) => ({
  key: id,
  cells: [
    <Link to={`/questionnaires/${id}/versions/${versionPublished}`}>{title}</Link>,
    afterPayment ? 'Yes' : 'No',
  ],
  actions: [],
});

class ReleasesQuestionnairesShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        releaseId: PropTypes.string.isRequired,
        consentTypeId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: {
        params: { releaseId, consentTypeId },
      },
    } = this.props;
    return (
      <div>
        <QueryResource
          queries={[
            {
              resourceName: 'releases',
              url: '/releases',
              schema: releasesSchema,
              filter: { id: releaseId },
            },
            {
              resourceName: 'consentTypes',
              url: '/consent-types',
              schema: consentTypesSchema,
              filter: { id: consentTypeId },
            },
            {
              resourceName: 'questionnaires',
              url: '/questionnaires',
              schema: questionnairesSchema,
            },
          ]}
        >
          {({ releases, consentTypes, questionnaires }) => {
            if (!releases.length) {
              return <div>No release found.</div>;
            }
            const release = releases[0];
            const consentType = consentTypes[0];
            const tableData = questionnaires.reduce((result, questionnaire) => {
              release.questionnaires.map((releaseQuestionnaire) => {
                if (releaseQuestionnaire.questionnaireId === questionnaire.id) {
                  return result.push({
                    id: questionnaire.id,
                    title: questionnaire.currentTitle,
                    afterPayment: releaseQuestionnaire.afterPayment,
                    versionPublished: releaseQuestionnaire.versionPublished,
                  });
                }
                return '';
              });
              return result;
            }, []);

            return (
              <div>
                <Breadcrumbs
                  sections={[
                    { content: 'Release', to: '/releases' },
                    {
                      content: `${consentType.title}`,
                      to: `/releases/consents/${consentTypeId}`,
                    },
                    {
                      content: <Date date={release.dateCreated} format={'MMMM Do YYYY, h:mm a'} />,
                    },
                  ]}
                />
                <Grid>
                  <Grid.Column width={12}>
                    <Table
                      headerRow={headerRow}
                      renderBodyRow={renderBodyRow}
                      tableData={tableData}
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

export default ReleasesQuestionnairesShow;
