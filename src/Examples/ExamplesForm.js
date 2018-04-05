import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const ExamplesForm = ({ initialValues, handleSubmit, onCancel, valid }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">{initialValues ? 'Update Example' : 'Create Example'}</Heading>
    <Fields.Text name="title" required />
    <Fields.Text name="age" required />
    <Fields.Select
      required
      name="category"
      options={[
        { key: 'user', text: 'User', value: 'User' },
        { key: 'patient', text: 'Patient', value: 'Patient' },
      ]}
    />
    <div>
      <Buttons
        actions={[
          {
            content: initialValues ? 'Update Example' : 'Create Example',
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
    </div>
  </Form>
);
ExamplesForm.propTypes = {
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    age: PropTypes.number,
    category: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
};
ExamplesForm.defaultProps = {
  initialValues: undefined,
};
export default reduxForm({
  enableReinitialize: true,
})(ExamplesForm);
