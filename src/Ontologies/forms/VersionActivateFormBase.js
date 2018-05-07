import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';
import { Heading, Buttons, DefinitionList } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

/* eslint max-len: */

const renderProperty = (propertyName, value) => ({
  label: 'Version ID',
  value,
});

const VersionActivateForm = ({ versionId, handleSubmit, onCancel }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Activate</Heading>
    <DefinitionList listData={{ versionId }} renderProperty={renderProperty} />
    <Message color="yellow">
      <p>
        Activating a new ontology version may lead to data loss due to concepts being retired. Do
        you want to proceed?
      </p>
    </Message>

    <Buttons
      actions={[
        {
          content: 'Apply',
          type: 'submit',
          onClick: () => {},
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
VersionActivateForm.propTypes = {
  versionId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(VersionActivateForm);
