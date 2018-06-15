import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { QueryResource, Mutation } from 'web-components';
import { releasesSchema, releaseSchema } from '../schemas';
import { questionnairesSchema } from '../../Questionnaires/schemas';
import ReleasesForm from './ReleasesForm';

export default function ReleasesCreate({
  closePanel,
  match: {
    params: { consentTypeId },
  },
}) {
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
        ]}
      >
        {({ releases, questionnaires }) => {
          const questionnaireOptions = questionnaires.map(questionnaire => ({
            key: questionnaire.id,
            value: questionnaire.id,
            text: questionnaire.currentTitle,
          }));

          const newestRelease = releases.reduce((previousValue, release) => {
            if (!previousValue || moment(release.dateCreated).isAfter(previousValue.dateCreated)) {
              return release;
            }
            return previousValue;
          }, undefined);

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
                    questionnaireOptions={questionnaireOptions}
                    initialValues={newestRelease}
                    onSubmit={(values) => {
                      const selectedQuestionnaires = values
                        .get('questionnaires')
                        .reduce((result, questionnaire) => {
                          questionnaires.map((q) => {
                            if (q.id === questionnaire.get('questionnaireId')) {
                              return result.push(
                                questionnaire.set('versionPublished', q.currentVersionId).toJS(),
                              );
                            }
                            return q;
                          });

                          return result;
                        }, []);

                      create(
                        values
                          .set('consentTypeId', consentTypeId)
                          .set('questionnaires', selectedQuestionnaires),
                      );
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
