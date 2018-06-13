import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import QuestionnaireUpdaterMutation from './../QuestionnaireUpdaterMutation';
import QuestionnaireQueryResource from '../../Questionnaires/QuestionnaireQueryResource';
import GlossaryAnnotationForm from './GlossaryAnnotationForm';

export default function AnswersAddGlossaryAnnotation({
  closePanel,
  match: {
    params: { questionnaireId, elementId, answerId },
  },
}) {
  return (
    <div>
      <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
        {({ questionnaires, versions, elements }) => {
          const questionnaire = questionnaires[0];
          const version = versions[0];
          const element = elements[0];
          const answer = element.answers.filter(ans => ans.id === answerId);
          return (
            <QuestionnaireUpdaterMutation
              version={version}
              questionnaire={questionnaire}
              post={closePanel}
              render={({ update, loading: pending }) => {
                if (pending) {
                  return <div>loading...</div>;
                }
                return (
                  <GlossaryAnnotationForm
                    formType="answer"
                    initialValues={
                      answer[0].glossaryTermAnnotations
                        ? Object.assign(answer[0], {
                          glossaryTermAnnotations: answer[0].glossaryTermAnnotations.map(
                            glossaryTermAnnotation =>
                              Object.assign(glossaryTermAnnotation, {
                                term: glossaryTermAnnotation.glossaryTerm.id,
                              }),
                          ),
                        })
                        : answer[0]
                    }
                    onSubmit={(values) => {
                      update(
                        fromJS(
                          Object.assign(element, {
                            answers: element.answers.map((ans) => {
                              if (ans.id === answerId) {
                                return values.set(
                                  'glossaryTermAnnotations',
                                  values
                                    .get('glossaryTermAnnotations')
                                    .map(glossaryTermAnnotation =>
                                      glossaryTermAnnotation.delete('term'),
                                    ),
                                );
                              }
                              return ans;
                            }),
                          }),
                        ),
                      );
                    }}
                    onCancel={closePanel}
                  />
                );
              }}
            />
          );
        }}
      </QuestionnaireQueryResource>
    </div>
  );
}

AnswersAddGlossaryAnnotation.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      elementId: PropTypes.string.isRequired,
      answerId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
