import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const TagsForm = ({ handleSubmit, onCancel, submitting, options }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Update Tags</Heading>
    <Fields.Select name="tagId" header="Tags" options={options} />
    <div>
      <Buttons
        actions={[
          {
            content: 'Add Tags',
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
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      text: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
};
TagsForm.defaultProps = {
  initialValues: undefined,
};
export default reduxForm({
  enableReinitialize: true,
})(TagsForm);
