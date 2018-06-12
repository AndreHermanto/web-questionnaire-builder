import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { QueryResource, Heading, Table, Buttons, Breadcrumbs, Date } from 'web-components';
import { releasesSchema, consentTypesSchema } from './schemas';

const headerRow = [
  {
    propName: 'dateCreated',
  },
  {
    propName: 'creatorName',
  },
];

const renderBodyRow = ({ id, consentTypeId, dateCreated }) => ({
  key: id,
  cells: [
    <Link to={`/releases/${id}/consents/${consentTypeId}`}>
      <Date date={dateCreated} format={'MMMM Do YYYY, h:mm a'} />
    </Link>,
  ],
  actions: [],
});

class ReleasesShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        consentTypeId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  render() {
    const {
      match: {
        params: { consentTypeId },
      },
    } = this.props;

    return (
      <div>
        <QueryResource
          queries={[
            {
              resourceName: 'releases',
              url: '/releases',
              schema: releasesSchema,
              filter: { consentTypeId },
            },
            {
              resourceName: 'consentTypes',
              url: '/consent-types',
              schema: consentTypesSchema,
              filter: { id: consentTypeId },
            },
          ]}
        >
          {({ releases, consentTypes }) => (
            <div>
              <Breadcrumbs
                sections={[
                  { content: 'Releases', to: '/releases' },
                  {
                    content: `${consentTypes[0].title}`,
                  },
                ]}
              />
              <Heading size="h1">{consentTypes[0].title}</Heading>
              <Grid>
                <Grid.Column width={12}>
                  <Table headerRow={headerRow} renderBodyRow={renderBodyRow} tableData={releases} />
                </Grid.Column>
                <Grid.Column width={4}>
                  <Buttons
                    actions={[
                      {
                        content: 'Create release',
                        to: {
                          pathname: `/releases/${consentTypeId}/create`,
                          state: { modal: true },
                        },
                      },
                    ]}
                  />
                </Grid.Column>
              </Grid>
            </div>
          )}
        </QueryResource>
      </div>
    );
  }
}

export default ReleasesShow;
