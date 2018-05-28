import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

/* eslint "react/require-default-props": "off" */

const QuestionnairesMoveToFolderForm = ({ handleSubmit, onCancel, folders, valid }) => (
  <Form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
    <Heading size="h1">Move to Folder</Heading>
    <Fields.Select
      name="folder"
      label="Folders"
      required
      options={folders.map(folder => ({
        key: folder.id,
        value: folder.id,
        text: folder.title,
      }))}
    />

    <Buttons
      actions={[
        {
          content: 'Update',
          type: 'submit',
          disabled: !valid,
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
QuestionnairesMoveToFolderForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  folders: PropTypes.arrayOf({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

const form = 'questionnaire-move-folder-form';
export default reduxForm({
  enableReinitialize: true,
  form,
})(QuestionnairesMoveToFolderForm);
