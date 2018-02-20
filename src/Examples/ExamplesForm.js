import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Button } from 'web-components';
import { Field, reduxForm } from 'redux-form/immutable';

const ExamplesForm = ({ initialValues, handleSubmit, onCancel }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Example</Heading>
    <Field name="title" label="Title" component={Fields.Input} type="text" />
    <Field name="age" label="Age" component={Fields.Input} type="number" />
    <Field
      name="category"
      label="Category"
      component={Fields.Select}
      options={[
        { key: '', text: '', value: '' },
        { key: 'user', text: 'User', value: 'User' },
        { key: 'patient', text: 'Patient', value: 'Patient' },
      ]}
    />
    <div>
      <Button main style={{ marginTop: 10 }}>
        {initialValues ? 'Update' : 'Create'}
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
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
};
ExamplesForm.defaultProps = {
  initialValues: undefined,
};
export default reduxForm({
  enableReinitialize: true,
})(ExamplesForm);
