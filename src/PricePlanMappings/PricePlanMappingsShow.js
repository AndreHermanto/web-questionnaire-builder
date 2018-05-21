import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { Grid, Message } from 'semantic-ui-react';
import {
  Query,
  DefinitionList,
  Resource,
  Helpers,
  Buttons,
  Breadcrumbs,
  rest,
} from 'web-components';
import { pricePlansSchema, pricePlanMappingsSchema } from './schemas';
import { consentTypesSchema } from '../LandingPage/schemas';

const renderAttachmentProperty = (propertyName, value) => {
  switch (propertyName) {
    case 'consentTitle':
      return {
        label: 'Consent title',
        value,
      };
    case 'consentDescription':
      return {
        label: 'Consent description',
        value,
      };
    case 'pricePlanTitle':
      return {
        label: 'Price Plan title',
        value,
      };
    case 'creatorName':
      return {
        label: 'Created by',
        value,
      };
    case 'timestamp':
      return {
        label: Helpers.renderLabel('created'),
        value: Helpers.renderContent(propertyName, value),
      };
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value),
      };
  }
};

class PricePlanMappingsShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        pricePlanMappingId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: {
        params: { pricePlanMappingId },
      },
    } = this.props;

    return (
      <div>
        <Query
          queries={[
            {
              resourceName: 'pricePlanMappings',
              url: '/price-plan-mappings',
              schema: pricePlanMappingsSchema,
            },
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
          ]}
          render={({ loading, error }) => (
            <Resource
              resources={[
                {
                  resourceName: 'pricePlanMappings',
                  filter: { id: pricePlanMappingId },
                },
                {
                  resourceName: 'pricePlans',
                },
                {
                  resourceName: 'consentTypes',
                },
              ]}
              render={({ pricePlanMappings, pricePlans, consentTypes }) => {
                if (loading && (!pricePlans.length || !consentTypes.length)) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (pricePlanMappings.length === 0 || !pricePlanMappings[0]) {
                  return (
                    <Grid>
                      <Grid.Column width={12}>
                        <Message negative>
                          <Message.Header>No price plan found</Message.Header>
                        </Message>
                      </Grid.Column>
                    </Grid>
                  );
                }
                const pricePlanMapping = pricePlanMappings[0];
                const consentType = get(
                  consentTypes.filter(value => value.id === pricePlanMapping.consentTypeId),
                  0,
                );
                const pricePlan = get(
                  pricePlans.filter(value => value.id === pricePlanMapping.pricePlanId),
                  0,
                );
                const listData = Object.assign(
                  {},
                  {
                    id: pricePlanMappingId,
                    consentTitle: consentType.title,
                    consentDescription: consentType.description,
                    pricePlanTitle: pricePlan.title,
                    timestamp: pricePlanMapping.timestamp,
                    creatorName: pricePlanMapping.creatorName,
                  },
                );

                return (
                  <Grid>
                    <Grid.Column width={12}>
                      <Breadcrumbs
                        sections={[
                          { content: 'Price Plan Mappings', to: '/price-plan-mappings' },

                          {
                            content: `${pricePlanMappingId}`,
                          },
                        ]}
                      />
                      <DefinitionList
                        listData={listData}
                        renderProperty={renderAttachmentProperty}
                      />
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <Buttons
                        actions={[
                          {
                            content: 'Preview Price Plan',
                            onClick: () => {
                              window.location.assign(
                                `${
                                  process.env.REACT_APP_PAYMENTS_URL
                                }/admin/price-plans/${encodeURIComponent(
                                  pricePlan.id,
                                )}?jwt=${rest.getAccessToken()}`,
                              );
                            },
                          },
                          {
                            content: 'Delete',
                            to: {
                              pathname: `/price-plan-mappings/${pricePlanMappingId}/delete`,
                              state: { modal: true },
                            },
                          },
                        ]}
                      />
                    </Grid.Column>
                  </Grid>
                );
              }}
            />
          )}
        />
      </div>
    );
  }
}

export default PricePlanMappingsShow;
