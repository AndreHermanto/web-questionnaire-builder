import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const ElementsAddTraitForm = ({ handleSubmit, onCancel, traits, submitting }) => {
  if (!traits || traits.length === 0) {
    return (
      <div>
        <Message negative>
          <p>Sorry, this question type can&apos;t have traits associated with it.</p>
        </Message>
        <Buttons
          actions={[
            {
              content: 'Cancel',
              onClick: onCancel,
              type: 'button',
            },
          ]}
        />
      </div>
    );
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Heading size="h1">Element Trait</Heading>
      <Fields.Select label="Trait" name="trait" options={traits} required />
      <Buttons
        actions={[
          {
            content: 'Save',
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
    </Form>
  );
};
ElementsAddTraitForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  traits: PropTypes.arrayOf({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  enableReinitialize: true,
  form: 'elements-trait-form',
})(ElementsAddTraitForm);
