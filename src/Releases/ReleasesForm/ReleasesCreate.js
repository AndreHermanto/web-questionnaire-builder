import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { QueryResource, Mutation } from 'web-components';
import { releasesSchema, releaseSchema } from '../schemas';
import { questionnairesSchema, userSchema } from '../../Questionnaires/schemas';
import ReleasesForm from './ReleasesForm';

export default function ReleasesCreate({
  closePanel,
  match: {
    params: { consentTypeId },
  },
}) {
  const getReleaseData = (releases) => {
    const latestDate = new Date(
      Math.max.apply(null, releases.map(release => new Date(release.dateCreated))),
    );
    return releases.filter(
      release => moment(release.dateCreated).format() === moment(latestDate).format(),
    );
  };
  const getQuestionnaireAfterPayment = (releaseData, questionnaires) =>
    releaseData[0].questionnaires.reduce((result, releaseQuestionnaire) => {
      questionnaires.map((questionnaire) => {
        if (questionnaire.id === releaseQuestionnaire.questionnaireId) {
          return result.push({
            id: questionnaire.id,
            afterPayment: releaseQuestionnaire.afterPayment,
            title: questionnaire.currentTitle,
            versionPublished: questionnaire.currentVersionId,
          });
        }
        return '';
      });
      return result;
    }, []);
  return (
    <div>
      <QueryResource
        queries={[
          {
            resourceName: 'releases',
            url: '/releases',
            schema: releasesSchema,
            filter: { consentTypeId },
          },
          {
            resourceName: 'questionnaires',
            url: '/questionnaires',
            schema: questionnairesSchema,
          },
          {
            resourceName: 'users',
            url: '/me',
            schema: userSchema,
          },
        ]}
      >
        {({ releases, questionnaires, users }) => {
          let releaseData;
          let questionnaireAfterPayment;
          if (releases.length > 0) {
            releaseData = getReleaseData(releases);
            questionnaireAfterPayment = getQuestionnaireAfterPayment(releaseData, questionnaires);
          }

          const questionnaireOptions = questionnaires.map(questionnaire => ({
            key: questionnaire.id,
            value: questionnaire.id,
            text: questionnaire.currentTitle,
          }));

          return (
            <Mutation
              resourceName="releases"
              url={'/releases'}
              schema={releaseSchema}
              post={closePanel}
              render={({ create, loading }) => {
                if (loading) {
                  return <div>loading...</div>;
                }
                return (
                  <ReleasesForm
                    questionnaireData={questionnaires}
                    questionnaireOptions={questionnaireOptions}
                    initialValues={{
                      consentTypeId: releaseData ? releaseData[0].consentTypeId : '',
                      questionnaires: releaseData
                        ? releaseData[0].questionnaires.map(
                          questionnaire => questionnaire.questionnaireId,
                        )
                        : [],
                      notificationEmail: releaseData ? releaseData[0].notificationEmail : '',
                      notificationFrequency: releaseData
                        ? releaseData[0].notificationFrequency
                        : '',
                      questionnaireAfterPayment: questionnaireAfterPayment || [],
                    }}
                    onSubmit={(values) => {
                      const data = values.toJS();

                      const questionnairesData = data.questionnaireAfterPayment.map(questionnaire =>
                        Object.assign(
                          {},
                          {
                            questionnaireId: questionnaire.id,
                            afterPayment: questionnaire.afterPayment,
                            versionPublished: questionnaire.versionPublished,
                          },
                        ),
                      );

                      const payload = {
                        consentTypeId,
                        creatorName: `${users[0].lastName} ${users[0].firstName}`,
                        dateCreated: new Date(),
                        notificationEmail: data.notificationEmail,
                        notificationFrequency: data.notificationFrequency,
                        questionnaires: questionnairesData,
                      };

                      create(payload);
                    }}
                    onCancel={closePanel}
                  />
                );
              }}
            />
          );
        }}
      </QueryResource>
    </div>
  );
}

ReleasesCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      consentTypeId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
