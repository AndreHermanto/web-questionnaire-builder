import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const ElementsSectionForm = ({ handleSubmit, onCancel }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Sections</Heading>
    <Heading size="h3">Remember: All headings must be uniquely named.</Heading>
    <Fields.Text name="title" required />
    <Fields.Radio
      name="size"
      label="Heading Size"
      options={['1', '2', '3'].map(value => ({
        key: value,
        value,
        text: `Heading ${value}`,
      }))}
    />

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
ElementsSectionForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

ElementsSectionForm.defaultProps = {};

export default reduxForm({
  enableReinitialize: true,
})(ElementsSectionForm);
