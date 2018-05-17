import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

const MAX_FILE_SIZE = 10;
const SUPPORTED_FILE_EXTENSIONS = ['owl', 'rdf'];

/* eslint "react/require-default-props": "off" */

const UploadOntologyVersionForm = ({ handleSubmit, onCancel, file, valid }) => (
  <Form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
    <Heading size="h1">New version</Heading>
    <Fields.Text required label="Release Name" name="releaseName" />

    <Fields.FileUpload
      label="File"
      name="file"
      required
      maxFileSize={MAX_FILE_SIZE}
      supportedFileExtensions={SUPPORTED_FILE_EXTENSIONS}
    />

    <Buttons
      actions={[
        {
          content: 'Create',
          type: 'submit',
          disabled: !valid || !file,
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
UploadOntologyVersionForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  file: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    fileType: PropTypes.string.isRequired,
  }),
};

const form = 'ontologies-version-upload';
const selector = formValueSelector(form);

export default connect(state => ({
  file: selector(state, 'file'),
}))(
  reduxForm({
    enableReinitialize: true,
    form,
  })(UploadOntologyVersionForm),
);
