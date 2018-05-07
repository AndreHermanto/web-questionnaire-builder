import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon } from 'semantic-ui-react';
import { Heading, Buttons, DefinitionList } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

/* eslint max-len: */
/* eslint jsx-a11y/no-static-element-interactions: off */
/* eslint jsx-a11y/anchor-is-valid: off */

const clickDownload = ({ datasourceId, fromVersionId, toVersionId }) => {
  window.open(
    `${
      process.env.REACT_APP_BASE_URL
    }/diff-reports/download?datasourceId=${datasourceId}&fromVersionId=${fromVersionId}&toVersionId=${toVersionId}`,
    '_blank',
  );
};

const renderProperty = diffReport => (propertyName, value) => {
  switch (propertyName) {
    case 'fileName':
      return {
        label: 'File Name',
        value: (
          <a download={value} onClick={() => clickDownload(diffReport)}>
            {value} <Icon name="download" />
          </a>
        ),
      };
    case 'fromVersion':
      return {
        label: 'From Version',
        value,
      };
    case 'toVersion':
      return {
        label: 'To Version',
        value,
      };
    case 'newConcepts':
      return {
        label: 'New Concepts',
        value,
      };
    case 'retiredConcepts':
      return {
        label: 'Retired Concepts',
        value,
      };
    case 'changedConcepts':
      return {
        label: 'Changed Concepts',
        value,
      };
    default:
      return null;
  }
};

const DiffReportForm = ({ diffReport, onCancel }) => (
  <Form>
    <Heading size="h1">Diff Report</Heading>
    <DefinitionList listData={diffReport} renderProperty={renderProperty(diffReport)} />

    <Buttons
      actions={[
        {
          content: 'Cancel',
          onClick: onCancel,
          type: 'button',
        },
      ]}
    />
  </Form>
);
DiffReportForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  diffReport: PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    fromVersion: PropTypes.string.isRequired,
    toVersion: PropTypes.string.isRequired,
  }).isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(DiffReportForm);
