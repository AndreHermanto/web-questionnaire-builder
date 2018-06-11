import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const ElementsAddSourceForm = ({ handleSubmit, onCancel, valid }) => (
  <Form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
    <Heading size="h1">Validated Source</Heading>

    <Fields.Text name="questionSource" label="Validated Source" required />
    <Buttons
      actions={[
        {
          content: 'Add source',
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
ElementsAddSourceForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
};

const form = 'elements-add-validated-source';

export default reduxForm({
  enableReinitialize: true,
  form,
})(ElementsAddSourceForm);
