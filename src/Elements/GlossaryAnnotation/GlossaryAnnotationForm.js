import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading, QueryResource } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { glossaryTermsSchema } from '../../GlossaryTerms/schemas';

/* eslint "react/require-default-props": "off" */
const GlossaryAnnotationForm = ({
  handleSubmit,
  onCancel,
  glossaryTermAnnotations,
  submitting,
  answerId,
  initialValues,
}) => {
  const answerIndex = initialValues
    .get('answers')
    .findIndex(answer => answer.get('id') === answerId);
  return (
    <Form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <Heading size="h1">Glossary Annotation</Heading>
      <Heading size="h3">{answerId ? 'Answer' : 'Question'}</Heading>
      <p>
        {answerId
          ? initialValues.getIn(['answers', answerIndex, 'text'])
          : initialValues.get('question')}
      </p>
      <Heading size="h3">Edit glossary</Heading>
      <QueryResource
        queries={[
          {
            resourceName: 'glossaryTerms',
            url: '/glossary-terms',
            schema: glossaryTermsSchema,
          },
        ]}
      >
        {({ glossaryTerms }) => (
          <Fields.Array
            name={
              answerId
                ? `answers.${answerIndex}.glossaryTermAnnotations`
                : 'glossaryTermAnnotations'
            }
            header="Glossary"
            required
            components={
              <div>
                <Fields.Text name="text" required />
                <Fields.Select
                  name="glossaryTerm"
                  label="Glossary term"
                  options={glossaryTerms.map(value => ({
                    key: value.id,
                    value,
                    text: value.name,
                  }))}
                  required
                />
              </div>
            }
          />
        )}
      </QueryResource>

      <Buttons
        actions={[
          {
            content: 'Create',
            type: 'submit',
            disabled: !glossaryTermAnnotations || submitting,
          },
          {
            content: 'Cancel',
            onClick: onCancel,
            type: 'button',
          },
        ]}
      />
    </Form>
  );
};
GlossaryAnnotationForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf({
      id: PropTypes.string.isRequired,
      glossaryTermAnnotations: PropTypes.arrayOf({
        text: PropTypes.string.isRequired,
        term: PropTypes.arrayOf({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      }),
    }),
  }),
  answerId: PropTypes.string,
  glossaryTermAnnotations: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

GlossaryAnnotationForm.defaultProps = {
  glossaryTermAnnotations: null,
  question: null,
  answer: null,
};

const form = 'glossary-annotation-form';

const selector = formValueSelector(form);

export default connect(state => ({
  question: selector(state, 'question'),
  glossaryTermAnnotations: selector(state, 'glossaryTermAnnotations'),
  isSearched: selector(state, 'isSearched'),
  searchTerm: selector(state, 'searchTerm'),
  answer: selector(state, 'text'),
}))(
  reduxForm({
    enableReinitialize: true,
    form,
  })(GlossaryAnnotationForm),
);
