import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import styled from 'styled-components';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const CustomLabel = styled.label`
  font-size: 0.92857143em;
  font-weight: 700;
  display: block;
  margin-bottom: 8px;
`;

export const validateUrl = value =>
  (value &&
  !(value || '').match(
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/i,
  )
    ? 'Invalid Url'
    : undefined);

const MAX_FILE_SIZE = 10;
const SUPPORTED_FILE_EXTENSIONS = ['png', 'gif', 'jpg', 'jpeg'];

/* eslint-disable */
let GlossaryTermsForm = ({ initialValues, handleSubmit, onCancel, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">{initialValues ? 'Update' : 'Create'} Glossary</Heading>
    <Fields.Text name="name" required />
    <Fields.Text name="displayText" required />
    <Fields.Text name="definition" required />
    <CustomLabel>Synonyms</CustomLabel>
    <Fields.Array
      name="synonyms"
      header="Synonyms"
      list
      components={<Fields.Text label="Synonym" />}
    />
    <Fields.FileUpload
      label="Image"
      name="image"
      maxFileSize={MAX_FILE_SIZE}
      supportedFileExtensions={SUPPORTED_FILE_EXTENSIONS}
    />
    <Fields.Text name="phoneticRepresentation" />
    <Fields.Text name="videoLink" validate={validateUrl} />
    <Fields.Text name="externalResourceLink" validate={validateUrl} />
    <div>
      <Buttons
        actions={[
          {
            content: `${initialValues ? 'Update' : 'Create'}`,
            onClick: () => {},
            disabled: submitting,
          },
          { content: 'Cancel', type: 'button', onClick: onCancel },
        ]}
      />
    </div>
  </Form>
);
GlossaryTermsForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

GlossaryTermsForm.defaultProps = {
  initialValues: null,
};

export default reduxForm({
  enableReinitialize: true,
  form: 'glossary-term-form',
})(GlossaryTermsForm);
