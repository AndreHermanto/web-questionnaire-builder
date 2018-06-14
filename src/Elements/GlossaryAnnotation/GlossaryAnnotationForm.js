import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading, QueryResource } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { glossaryTermsSchema } from '../../GlossaryTerms/schemas';

/* eslint "react/require-default-props": "off" */
const GlossaryAnnotationForm = ({
  change,
  handleSubmit,
  onCancel,
  formType,
  question,
  answer,
  glossaryTermAnnotations,
  submitting,
}) => (
  <Form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
    <Heading size="h1">Glossary Annotation</Heading>
    <Heading size="h3">{formType === 'question' ? 'Question' : 'Answer'}</Heading>
    <p>{formType === 'question' ? question : answer}</p>
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
          name="glossaryTermAnnotations"
          header="Glossary"
          required
          components={
            <div>
              <Fields.Text name="text" required disabled />
              <Fields.Select
                name="term"
                label="Glossary term"
                options={glossaryTerms.map(value => ({
                  key: value.id,
                  value: value.id,
                  text: value.name,
                }))}
                onChange={(e, value) => {
                  const term = glossaryTerms.filter(glossaryTerm => glossaryTerm.id === value);
                  const glossaryTermAnnotationsIndex = glossaryTermAnnotations.size - 1;
                  change(
                    `glossaryTermAnnotations.${glossaryTermAnnotationsIndex}.text`,
                    term[0].name,
                  );
                  change(
                    `glossaryTermAnnotations.${glossaryTermAnnotationsIndex}.glossaryTerm`,
                    term[0],
                  );
                }}
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
GlossaryAnnotationForm.propTypes = {
  change: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  formType: PropTypes.string.isRequired,
  question: PropTypes.string,
  answer: PropTypes.string,
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
