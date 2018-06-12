import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource } from 'web-components';
import ElementsAddTraitForm from './ElementsAddTraitForm';
import { traitsSchema } from './schemas';

import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';

function ElementsAddTrait({
  closePanel,
  match: {
    params: { elementId, questionnaireId },
  },
}) {
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'traits',
          url: '/traits',
          schema: traitsSchema,
        },
      ]}
    >
      {({ traits }) => (
        <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
          {({ questionnaires, versions, elements }) => {
            const element = elements[0];
            const questionnaire = questionnaires[0];
            const version = versions[0];
            const options = traits.map(trait => ({
              key: trait.id,
              text: trait.label,
              value: trait.id,
            }));
            return (
              <QuestionnaireUpdaterMutation
                questionnaire={questionnaire}
                version={version}
                post={closePanel}
                render={({ update, loading: updateLoading }) => {
                  if (updateLoading) {
                    return <div>loading...</div>;
                  }
                  return (
                    <ElementsAddTraitForm
                      traits={options}
                      initialValues={element}
                      onSubmit={update}
                      onCancel={closePanel}
                    />
                  );
                }}
              />
            );
          }}
        </QuestionnaireQueryResource>
      )}
    </QueryResource>
  );
}

ElementsAddTrait.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsAddTrait;
