import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const ElementsAddTraitForm = ({ handleSubmit, onCancel, traits }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Element Trait</Heading>
    <Fields.Select label="Traits" name="traits" options={traits} required />

    <Buttons
      actions={[
        {
          content: 'Save',
          type: 'submit',
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
ElementsAddTraitForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  traits: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default reduxForm({
  enableReinitialize: true,
  form: 'elements-trait-form',
})(ElementsAddTraitForm);
