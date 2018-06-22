import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const TagsForm = ({ handleSubmit, onCancel, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Add new tag</Heading>
    <Fields.Text name="name" label="Tag" required />
    <div>
      <Buttons
        actions={[
          {
            content: 'Add Tag',
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
    </div>
  </Form>
);
TagsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};
export default reduxForm({
  enableReinitialize: true,
})(TagsForm);
