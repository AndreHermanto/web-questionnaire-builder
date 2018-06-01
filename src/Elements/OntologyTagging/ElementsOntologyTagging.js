import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';
import ElementsOntologyTaggingForm from './ElementsOntologyTaggingForm';
import QuestionnaireQueryResource from '../../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from '../QuestionnaireUpdaterMutation';

export default function ElementsOntologyTagging({
  closePanel,
  match: {
    params: { elementId, questionnaireId, answerId },
  },
}) {
  const handleSubmit = (update, concept, element) => {
    const answer = element.answers.filter(ans => ans.id === answerId);
    const newConcept = {
      id: concept.uri,
      label: concept.label ? concept.label : concept.displayLabel,
      datasource: concept.datasource.acronym,
      datasourceVersion: concept.dataSourceVersion
        ? concept.dataSourceVersion.id
        : concept.datasource.version,
    };

    const newAnswer = Object.assign(answer[0], {
      concepts: uniqBy(answer[0].concepts.concat(newConcept), 'id'),
    });

    const newElementAnswers = element.answers.map((ans) => {
      if (answerId === ans.id) {
        return newAnswer;
      }
      return ans;
    });

    update({
      ...element,
      answers: newElementAnswers,
    });
  };
  return (
    <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
      {({ questionnaires, versions, elements }) => {
        const element = elements[0];
        const questionnaire = questionnaires[0];
        const version = versions[0];
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
                <ElementsOntologyTaggingForm
                  onAddOntology={concept => handleSubmit(update, concept, element)}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QuestionnaireQueryResource>
  );
}

ElementsOntologyTagging.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
