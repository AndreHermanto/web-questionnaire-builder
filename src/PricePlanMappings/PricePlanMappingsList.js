import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Query, Resource, Buttons, Table, Date, Heading, rest } from 'web-components';
import { Link } from 'react-router-dom';
import { pricePlanMappingsSchema } from './schemas';
import { consentTypesSchema } from '../LandingPage/schemas';

const headerRow = [
  {
    label: 'Consent title',
    propName: 'consentType',
  },
  {
    label: 'Created by',
    propName: 'creatorName',
  },
  {
    label: 'Date created',
    propName: 'timestamp',
  },
];

const renderBodyRow = ({ id, creatorName, timestamp, consentType }) => ({
  key: id,
  cells: [
    <Link to={`/price-plan-mappings/${id}`}>{consentType.title}</Link>,
    creatorName || '',
    timestamp ? <Date date={timestamp} format={'MMMM Do YYYY'} /> : '',
  ],
  actions: [],
});

class PricePlansList extends React.Component {
  renderButtons = () => (
    <Grid.Column width={4}>
      <Buttons
        actions={[
          {
            content: 'New Price Plan Mapping',
            to: {
              pathname: '/price-plan-mappings/create',
              state: { modal: true },
            },
          },
          {
            content: 'View Price Plans',
            onClick: () => {
              window.location.assign(
                `${process.env.REACT_APP_PAYMENTS_URL}/admin?jwt=${rest.getAccessToken()}`,
              );
            },
          },
        ]}
      />
    </Grid.Column>
  );

  render() {
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
          ]}
          render={({ loading, error }) => (
            <Resource
              resources={[
                {
                  resourceName: 'pricePlanMappings',
                },
                {
                  resourceName: 'consentTypes',
                },
              ]}
              render={({ pricePlanMappings, consentTypes }) => {
                if (loading && !pricePlanMappings.length) {
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
                      {this.renderButtons()}
                    </Grid>
                  );
                }

                return (
                  <div>
                    <Heading size="h1">Price Plan Mappings</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <Table
                          headerRow={headerRow}
                          renderBodyRow={renderBodyRow}
                          tableData={pricePlanMappings.map(pricePlanMapping => ({
                            ...pricePlanMapping,
                            consentType:
                              consentTypes.find(ct => ct.id === pricePlanMapping.consentTypeId) ||
                              {},
                          }))}
                        />
                      </Grid.Column>
                      {this.renderButtons()}
                    </Grid>
                  </div>
                );
              }}
            />
          )}
        />
      </div>
    );
  }
}

export default PricePlansList;
