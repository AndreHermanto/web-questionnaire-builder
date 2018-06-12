import React from 'react';
import PropTypes from 'prop-types';
import ElementsSectionForm from './ElementsSectionForm';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from './QuestionnaireUpdaterMutation';

const ElementSectionCreate = (props) => {
  const {
    closePanel,
    match: {
      params: { questionnaireId },
    },
  } = props;
  return (
    <QuestionnaireQueryResource questionnaireId={questionnaireId}>
      {({ questionnaires, versions }) => {
        const questionnaire = questionnaires[0];
        const version = versions[0];
        return (
          <QuestionnaireUpdaterMutation
            questionnaire={questionnaire}
            version={version}
            post={closePanel}
            render={({ create, loading }) => {
              if (loading) {
                return <div>loading...</div>;
              }
              return (
                <ElementsSectionForm
                  form={'elements-section-form'}
                  onSubmit={value => create(value, version.body.length)}
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

ElementSectionCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementSectionCreate;
