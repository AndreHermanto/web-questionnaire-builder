import React from 'react';
import PropTypes from 'prop-types';
import { Query, Resource, Mutation } from 'web-components';
import { pricePlanMappingSchema, pricePlansSchema, pricePlanMappingsSchema } from './schemas';
import PricePlanMappingsForm from './PricePlanMappingsForm';
import { consentTypesSchema } from '../LandingPage/schemas';

export default function PricePlanMappingsCreate({ closePanel }) {
  return (
    <div>
      <Query
        queries={[
          {
            resourceName: 'consentTypes',
            url: '/consent-types',
            schema: consentTypesSchema,
          },
          {
            resourceName: 'pricePlans',
            url: '/price-plans',
            schema: pricePlansSchema,
          },
          {
            resourceName: 'pricePlanMappings',
            url: '/price-plan-mappings',
            schema: pricePlanMappingsSchema,
          },
        ]}
        render={({ loading, error }) => (
          <Resource
            resources={[
              {
                resourceName: 'pricePlans',
              },
              {
                resourceName: 'consentTypes',
              },
              {
                resourceName: 'pricePlanMappings',
              },
            ]}
            render={({ pricePlans, consentTypes, pricePlanMappings }) => {
              if (loading && (!pricePlans.length || !consentTypes.length)) {
                return <div>loading...</div>;
              }
              if (error) {
                return <div>Error: {error}</div>;
              }

              return (
                <Mutation
                  resourceName="pricePlanMappings"
                  url={'/price-plan-mappings'}
                  schema={pricePlanMappingSchema}
                  post={closePanel}
                  render={({ create, loading: pending }) => {
                    if (pending) {
                      return <div>loading...</div>;
                    }
                    const consentTypeIds = pricePlanMappings.map(
                      pricePlanMapping => pricePlanMapping.consentTypeId,
                    );
                    const consentTypeOptions = consentTypes
                      .filter(consentType => !consentTypeIds.includes(consentType.id))
                      .map(consentType => ({
                        key: consentType.id,
                        value: consentType.id,
                        text: consentType.title,
                      }));

                    const pricePlanIds = pricePlanMappings.map(
                      pricePlanMapping => pricePlanMapping.pricePlanId,
                    );
                    const pricePlanOptions = pricePlans
                      .filter(pricePlan => !pricePlanIds.includes(pricePlan.id))
                      .map(pricePlan => ({
                        key: pricePlan.id,
                        value: pricePlan.id,
                        text: pricePlan.title,
                      }));
                    return (
                      <PricePlanMappingsForm
                        form="price-plans-form"
                        onSubmit={create}
                        onCancel={closePanel}
                        consentTypeOptions={consentTypeOptions}
                        pricePlanOptions={pricePlanOptions}
                      />
                    );
                  }}
                />
              );
            }}
          />
        )}
      />
    </div>
  );
}

PricePlanMappingsCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
};
