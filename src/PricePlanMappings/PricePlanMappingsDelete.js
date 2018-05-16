import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation } from 'web-components';
import { pricePlanMappingSchema } from './schemas';

export default function PricePlanMappingsDelete({
  closePanel,
  history,
  match: {
    params: { pricePlanMappingId },
  },
}) {
  return (
    <div>
      <Mutation
        resourceName="pricePlanMappings"
        url={`/price-plan-mappings/${pricePlanMappingId}`}
        schema={pricePlanMappingSchema}
        post={() => {
          history.push('/price-plans');
        }}
        render={({ remove, loading: pending }) => {
          if (pending) {
            return <div>Deleting price plan...</div>;
          }
          return (
            <Confirmation
              title="Delete price plan mapping"
              content="Are you sure you want to delete this mapping (including all versions)?"
              confirmLabel="Yes"
              cancelLabel="No"
              onConfirm={() => remove(pricePlanMappingId)}
              onCancel={closePanel}
            />
          );
        }}
      />
    </div>
  );
}

PricePlanMappingsDelete.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      pricePlanMappingId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
};
