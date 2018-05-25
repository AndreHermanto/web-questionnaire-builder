import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation, QueryResource } from 'web-components';
import moment from 'moment';
import queryString from 'query-string';
import {
  questionnairesSchema,
  questionnaireSchema,
  versionSchema,
  versionsSchema,
} from '../schemas';

/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */
const currentTime = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');

function QuestionnaireDuplicateForm({
  history,
  closePanel,
  match: {
    params: { currentVersionId, id },
  },
}) {
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'questionnaires',
          url: '/questionnaires',
          schema: questionnairesSchema,
          filter: { id },
        },
      ]}
    >
      {({ questionnaires }) => {
        if (!questionnaires) {
          return <div>No questionnaires</div>;
        }
        const questionnaire = questionnaires[0];
        const currentTitle = `Copy of ${questionnaire.currentTitle} at ${currentTime}`;

        return (
          <Mutation
            resourceName="questionnaires"
            url={'/questionnaires'}
            schema={questionnaireSchema}
            post={() =>
              history.push(
                `/questionnaires/${id}/versions/${currentVersionId}/duplicate?currentTitle=${currentTitle}`,
              )
            }
            render={({ create, loading }) => {
              if (loading) {
                return <div>loading...</div>;
              }

              return (
                <Confirmation
                  title="Questionnaires"
                  content="Are you sure you want to duplicate this questionnaire?"
                  confirmLabel="Yes"
                  cancelLabel="No"
                  onConfirm={() => create({ currentTitle })}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QueryResource>
  );
}

function versionDuplicateForm({
  history,
  closePanel,
  currentTitle,
  match: {
    params: { currentVersionId, id },
  },
}) {
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'questionnaires',
          url: '/questionnaires',
          schema: questionnairesSchema,
          filter: { currentTitle },
        },
      ]}
    >
      {({ questionnaires }) => {
        if (!questionnaires.length) {
          return <div>No questionnaires</div>;
        }
        const questionnaire = questionnaires[0];

        return (
          <Mutation
            resourceName="versions"
            url={`/questionnaires/${questionnaire.id}/versions`}
            post={() => {
              history.push(
                `/questionnaires/${id}/versions/${currentVersionId}/duplicate?currentTitle=${currentTitle}&readyToUpdate=${true}`,
              );
            }}
            schema={versionSchema}
            render={({ create, loading }) => {
              if (loading) {
                return <div>loading...</div>;
              }
              return (
                <Confirmation
                  title="Versions"
                  content="Are you sure you want to create a new version for this questionnaire?"
                  confirmLabel="Yes"
                  cancelLabel="No"
                  onConfirm={() => create(questionnaire)}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QueryResource>
  );
}

function QuestionnaireUpdateForm({ history, closePanel, currentTitle }) {
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'questionnaires',
          url: '/questionnaires',
          schema: questionnairesSchema,
          filter: { currentTitle },
        },
        {
          resourceName: 'versions',
          url: '/versions',
          schema: versionsSchema,
          filter: { currentTitle },
        },
      ]}
    >
      {({ questionnaires, versions }) => {
        if (!questionnaires.length || !versions.length) {
          return <div>No questionnaires or versions</div>;
        }
        const questionnaire = questionnaires[0];
        const { id: currentVersionId } = versions[0];

        return (
          <Mutation
            resourceName="questionnaires"
            url={`/questionnaires/${questionnaire.id}`}
            post={() => {
              history.push('/questionnaires');
            }}
            schema={versionSchema}
            render={({ update, loading }) => {
              if (loading) {
                return <div>loading...</div>;
              }
              return (
                <Confirmation
                  title="Questionnaires"
                  content="Are you sure you want to update questionnaire with created versionId?"
                  confirmLabel="Yes"
                  cancelLabel="No"
                  onConfirm={() => update({ ...questionnaire, currentVersionId })}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QueryResource>
  );
}

function QuestionnairesDuplicateForm(props) {
  const {
    location: { search },
  } = props;
  const { currentTitle, readyToUpdate } = queryString.parse(search);

  if (currentTitle && readyToUpdate) return QuestionnaireUpdateForm({ ...props, currentTitle });

  if (currentTitle) return versionDuplicateForm({ ...props, currentTitle });

  return QuestionnaireDuplicateForm({ ...props });
}

QuestionnaireDuplicateForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      versionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

versionDuplicateForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      versionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  currentTitle: PropTypes.string.isRequired,
};

QuestionnaireUpdateForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  currentTitle: PropTypes.string.isRequired,
};

export default QuestionnairesDuplicateForm;
