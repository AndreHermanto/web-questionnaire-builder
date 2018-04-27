import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons, Helpers } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const OntologyCreate = ({ initialValues, handleSubmit, onCancel, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Ontology</Heading>
    <Fields.Text name="acronym" required />
    <Fields.Text name="title" required />
    <Fields.Text name="description" />
    <Fields.Text name="filterByPrefix" />
    <Fields.Select
      required
      name="category"
      options={['UOM', 'PHENOTYPING'].map(value => ({
        key: value,
        value,
        text: Helpers.renderContent('category', value),
      }))}
    />
    <Fields.Radio
      name="managementType"
      label="Management Type"
      options={[
        { key: 'Online', text: 'Online', value: true },
        { key: 'Offline', text: 'Offline', value: false },
      ]}
    />

    <Fields.Email name="email" label="Notification email" />

    <div>
      <Buttons
        actions={[
          {
            content: `${initialValues ? 'Update' : 'Create'}`,
            onClick: () => {},
            disabled: submitting,
          },
          { content: 'Cancel', type: 'button', onClick: onCancel },
        ]}
      />
    </div>
  </Form>
);
OntologyCreate.propTypes = {
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    age: PropTypes.number,
    category: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};
OntologyCreate.defaultProps = {
  initialValues: undefined,
};
export default reduxForm({
  enableReinitialize: true,
})(OntologyCreate);
