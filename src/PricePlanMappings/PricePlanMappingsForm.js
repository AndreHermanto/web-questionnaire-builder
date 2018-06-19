import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Fields, Buttons, Heading } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const PricePlanMappingsForm = ({
  handleSubmit,
  onCancel,
  submitting,
  pricePlanOptions,
  consentTypeOptions,
}) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Create price plan</Heading>
    {consentTypeOptions.length > 0 && pricePlanOptions.length > 0 ? (
      <div>
        <Fields.Select
          options={consentTypeOptions}
          name="consentTypeId"
          label="Consent Type"
          required
        />
        <Fields.Select options={pricePlanOptions} name="pricePlanId" label="Price Plan" required />
      </div>
    ) : (
      <div>No Consent or Price Plan Available</div>
    )}

    <Buttons
      actions={[
        {
          content: 'Create',
          type: 'submit',
          disabled: submitting || consentTypeOptions.length === 0,
        },
        {
          content: 'Go back',
          onClick: onCancel,
          type: 'button',
        },
      ]}
    />
  </Form>
);

PricePlanMappingsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pricePlanOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  consentTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
};

export default reduxForm({
  enableReinitialize: true,
})(PricePlanMappingsForm);
