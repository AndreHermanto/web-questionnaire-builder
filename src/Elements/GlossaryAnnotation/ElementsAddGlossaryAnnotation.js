import React from 'react';
import PropTypes from 'prop-types';
import QuestionnaireUpdaterMutation from './../QuestionnaireUpdaterMutation';
import QuestionnaireQueryResource from '../../Questionnaires/QuestionnaireQueryResource';
import GlossaryAnnotationForm from './GlossaryAnnotationForm';

export default function ElementsAddGlossaryAnnotation({
  closePanel,
  match: {
    params: { questionnaireId, elementId },
  },
}) {
  return (
    <div>
      <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
        {({ questionnaires, versions, elements }) => {
          const questionnaire = questionnaires[0];
          const version = versions[0];
          const element = elements[0];
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
                    onSubmit={(values) => {
                      update(
                        values.set(
                          'glossaryTermAnnotations',
                          values
                            .get('glossaryTermAnnotations')
                            .map(glossaryTermAnnotation => glossaryTermAnnotation.delete('term')),
                        ),
                      );
                    }}
                    formType="question"
                    initialValues={
                      element.glossaryTermAnnotations
                        ? Object.assign(element, {
                          glossaryTermAnnotations: element.glossaryTermAnnotations.map(
                            glossaryTermAnnotation =>
                              Object.assign(glossaryTermAnnotation, {
                                term: glossaryTermAnnotation.glossaryTerm.id,
                              }),
                          ),
                        })
                        : element
                    }
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

ElementsAddGlossaryAnnotation.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
