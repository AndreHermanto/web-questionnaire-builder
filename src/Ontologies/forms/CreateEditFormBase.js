import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons, Helpers } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

/* eslint-disable */
let CreateEditFormBase = ({
  initialValues,
  handleSubmit,
  onCancel,
  submitting,
  managementType,
}) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Ontology</Heading>
    <Fields.Text name="acronym" label="Acronym" required />
    <Fields.Text name="title" required />
    <Fields.Text name="description" />
    <Fields.Text name="filterByPrefix" label="Filter By Prefix" />
    <Fields.Select
      required
      name="category"
      label="category"
      multiple
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
        { key: 'ONLINE', text: 'Online', value: 'ONLINE' },
        { key: 'OFFLINE', text: 'Offline', value: 'OFFLINE' },
      ]}
    />

    {managementType === 'ONLINE' && <Fields.Text name="url" label="URL" />}

    <Fields.Email name="notificationEmail" label="Notification email" />

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
CreateEditFormBase.propTypes = {
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    age: PropTypes.number,
    category: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};
CreateEditFormBase.defaultProps = {
  initialValues: undefined,
  submitting: false,
};

CreateEditFormBase = reduxForm({
  enableReinitialize: true,
})(CreateEditFormBase);

CreateEditFormBase = connect((state, props) => {
  const selector = formValueSelector(props.form);
  const managementType = selector(state, 'managementType');
  return {
    managementType,
  };
})(CreateEditFormBase);

export default CreateEditFormBase;
