import React from 'react';
import PropTypes from 'prop-types';
import { Confirmation } from 'web-components';
import cuid from 'cuid';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';

const ElementsDuplicate = (props) => {
  const {
    closePanel,
    history,
    match: {
      params: { elementId, questionnaireId },
    },
  } = props;
  return (
    <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
      {({ questionnaires, versions, elements }) => {
        const element = elements[0];
        const questionnaire = questionnaires[0];
        const version = versions[0];
        const elementIndex = version.body.findIndex(e => e.id === element.id);

        return (
          <QuestionnaireUpdaterMutation
            questionnaire={questionnaire}
            version={version}
            post={() => history.push(`/questionnaires/${questionnaireId}`)}
            render={({ create, loading }) => {
              if (loading) {
                return <div>loading...</div>;
              }
              return (
                <Confirmation
                  title="Duplicate element?"
                  content="Do you want to duplicate this element?"
                  confirmLabel="Yes, duplicate element"
                  cancelLabel="No"
                  onConfirm={() =>
                    create(
                      {
                        ...element,
                        id: cuid(),
                      },
                      elementIndex + 1,
                    )
                  }
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QuestionnaireQueryResource>
  );
};
ElementsDuplicate.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsDuplicate;
