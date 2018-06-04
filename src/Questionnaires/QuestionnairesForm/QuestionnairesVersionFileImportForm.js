import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import styled from 'styled-components';
import yamlJS from 'js-yaml';
import { connect } from 'react-redux';

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const SUPPORTED_FILE_EXTENSIONS = /.yml/;

const ImportButton = styled(Button)`
  background: ${props => props.theme.appColor} !important;
  color: white !important;
  margin-bottom: 10px !important;
  font-weight: normal !important;
  cursor: default !important;
`;

const ImportLabel = styled.label`
  cursor: pointer !important;
`;

// eslint-disable-next-line import/no-mutable-exports
let QuestionnairesVersionFileImportForm = ({
  handleSubmit,
  onCancel,
  submitting,
  change,
  isError,
  errorMessage,
  fileName,
  fileContent,
}) => {
  const cleanFile = () => {
    change('fileContent', undefined);
    change('fileJsonData', undefined);
  };

  const setError = (status, message) => {
    change('isError', status);
    change('errorMessage', message);
  };

  const convertYamlToObject = (data) => {
    if (!data) {
      setError(false, '');
      return;
    }

    try {
      const jsonData = yamlJS.safeLoad(data);
      if (typeof jsonData === 'object') {
        setError(false, '');
        change('fileJsonData', jsonData);
      } else {
        setError(true, 'Please check your yaml data');
        cleanFile();
      }
    } catch (e) {
      setError(true, 'Please check your yaml data');
      cleanFile();
    }
  };

  const handleReadFromFile = (file) => {
    if (!file) {
      return;
    }

    change('fileName', file.name);

    if (!file.name.match(SUPPORTED_FILE_EXTENSIONS)) {
      setError(true, 'File not supported.');
      cleanFile();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(true, 'File is too big.');
      cleanFile();
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.error) {
        setError(true, reader.error);
        cleanFile();
      }
      change('fileContent', reader.result);
      convertYamlToObject(reader.result);
    };

    reader.readAsText(file);
  };

  const handleYamlFileChange = () => {
    convertYamlToObject(fileContent);
  };

  return (
    <Form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <Heading size="h1">Import Version</Heading>
      <ImportButton type="button">
        <ImportLabel>
          <input
            style={{ display: 'none' }}
            type="file"
            onChange={(e) => {
              handleReadFromFile(e.target.files[0]);
              e.target.value = null;
              e.preventDefault();
            }}
          />
          Import from file
        </ImportLabel>
      </ImportButton>
      {isError && (
        <Message negative>
          <Message.Header>Error: {fileName}</Message.Header>
          <p>{errorMessage}</p>
          <p>Supported file type: yml.</p>
        </Message>
      )}
      <div>
        <Fields.TextArea
          name="fileContent"
          label="Yaml file"
          required
          value={fileContent}
          onChange={handleYamlFileChange}
        />
        <Buttons
          actions={[
            {
              content: 'Import new Version',
              type: 'submit',
              disabled: submitting || isError,
            },
            {
              content: 'Cancel',
              onClick: onCancel,
              type: 'button',
            },
          ]}
        />
      </div>
    </Form>
  );
};
QuestionnairesVersionFileImportForm.propTypes = {
  change: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
  fileName: PropTypes.string,
  fileContent: PropTypes.string,
};

QuestionnairesVersionFileImportForm.defaultProps = {
  isError: false,
  errorMessage: undefined,
  fileName: undefined,
  fileContent: undefined,
};

const form = 'verison-file-import-form';
QuestionnairesVersionFileImportForm = reduxForm({
  enableReinitialize: true,
  form,
})(QuestionnairesVersionFileImportForm);

const selector = formValueSelector(form);
QuestionnairesVersionFileImportForm = connect(state => ({
  isError: selector(state, 'isError'),
  errorMessage: selector(state, 'errorMessage'),
  fileContent: selector(state, 'fileContent'),
  fileName: selector(state, 'fileName'),
}))(QuestionnairesVersionFileImportForm);

export default QuestionnairesVersionFileImportForm;
