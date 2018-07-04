import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';
import ElementsOntologyTaggingForm from './ElementsOntologyTaggingForm';
import QuestionnaireQueryResource from '../../Questionnaires/QuestionnaireQueryResource';
import QuestionnaireUpdaterMutation from '../QuestionnaireUpdaterMutation';

export default function ElementsOntologyTagging({
  history,
  closePanel,
  match: {
    params: { elementId, questionnaireId, answerId },
  },
}) {
  const handleSubmit = (update, values, element, answer) => {
    const newConcepts = values
      .get('concepts')
      .toJS()
      .map(concept => ({
        id: concept.uri,
        label: concept.label ? concept.label : concept.displayLabel,
        datasource: concept.datasource.acronym,
        datasourceVersion: concept.dataSourceVersion
          ? concept.dataSourceVersion.id
          : concept.datasource.version,
      }));

    const newAnswer = Object.assign(answer[0], {
      concepts: uniqBy(answer[0].concepts.concat(newConcepts), 'id'),
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

  const handleDelete = (update, answer, element, conceptId) => {
    const newAnswer = Object.assign(answer, {
      concepts: answer.concepts.filter(concept => concept.id !== conceptId),
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
        const answer = element.answers.filter(ans => ans.id === answerId);

        return (
          <QuestionnaireUpdaterMutation
            questionnaire={questionnaire}
            version={version}
            post={() => history.push(`/questionnaires/${questionnaireId}/elements/${elementId}`)}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>Updating...</div>;
              }
              return (
                <ElementsOntologyTaggingForm
                  onSubmit={values => handleSubmit(update, values, element, answer)}
                  onCancel={closePanel}
                  initialValues={answer[0]}
                  onDelete={conceptId => handleDelete(update, answer[0], element, conceptId)}
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
