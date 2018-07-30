import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Button, Message } from 'semantic-ui-react';
import { Fields, Buttons, Heading, Table } from 'web-components';
import { reduxForm } from 'redux-form/immutable';
import CopyToClipboard from 'react-copy-to-clipboard';

const headerRow = [
  {
    propName: 'url',
  },
  {
    propName: 'url',
    label: 'Copy to Clipboard',
  },
  {
    propName: 'url',
    label: 'Navigate To',
  },
];

const renderBodyRow = ({ url }) => ({
  key: url,
  cells: [
    <input type="text" disabled value={url} />,
    <CopyToClipboard text={url}>
      <Button circular icon="clipboard" />
    </CopyToClipboard>,
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Icon name="external" />
    </a>,
  ],
  actions: [],
});

const ReleasesGenerateURLsForm = ({
  releaseUrls,
  errorMessage,
  consentTypeTitle,
  handleSubmit,
  onCancel,
  submitting,
}) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Generate Release URLs</Heading>
    <Heading as="h3">Consent: {consentTypeTitle}</Heading>
    <Fields.Number required name="count" label="Count" />
    <Buttons
      actions={[
        {
          content: 'Generate',
          type: 'submit',
          disabled: submitting,
        },
        {
          content: 'Cancel',
          onClick: onCancel,
          type: 'button',
        },
      ]}
    />
    {errorMessage && <Message negative>{errorMessage}</Message>}
    {releaseUrls &&
      releaseUrls.length > 0 && (
      <div style={{ marginTop: 25 }}>
        <Table
          headerRow={headerRow}
          renderBodyRow={props => renderBodyRow(props)}
          tableData={releaseUrls}
        />
      </div>
    )}
  </Form>
);

ReleasesGenerateURLsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  consentTypeTitle: PropTypes.string.isRequired,
  releaseUrls: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  errorMessage: PropTypes.string.isRequired,
};

const form = 'releases-generate-urls-form';

export default reduxForm({
  enableReinitialize: true,
  form,
})(ReleasesGenerateURLsForm);
