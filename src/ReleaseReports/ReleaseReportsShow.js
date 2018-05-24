import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Reveal, Label, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { Query, Resource, Heading, Breadcrumbs, DefinitionList, Helpers } from 'web-components';
import { releaseReportsSchema } from './schemas';

const CustomReveal = styled(Reveal)`
  .hidden {
    display: block !important;
  }
`;
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */
const renderProperty = (propertyName, value, releaseReport) => {
  switch (propertyName) {
    case 'id':
      return null;
    case 'fileName':
      return {
        label: Helpers.renderLabel(propertyName),
        value: (
          <a
            style={{ cursor: 'pointer' }}
            onClick={() =>
              window.open(
                `${process.env.REACT_APP_BASE_URL}/releases/${
                  releaseReport.releaseId
                }/download?releaseReportId=${releaseReport.id}`,
                '_blank',
              )
            }
          >
            {value} <Icon name="download" />
          </a>
        ),
      };
    case 'password':
      return {
        label: Helpers.renderLabel(propertyName),
        value: (
          <CustomReveal animated="move">
            <Reveal.Content visible>
              <Label
                tag
                color="teal"
                style={{
                  width: `${value >= 20 ? value * 15 : value * 20}px`,
                }}
              >
                <Icon name="protect" /> Hover to reveal the password
              </Label>
            </Reveal.Content>
            <Reveal.Content hidden>
              <Label tag color="blue">
                {value}
              </Label>
            </Reveal.Content>
          </CustomReveal>
        ),
      };
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value),
      };
  }
};

class ReleaseReportsShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        releaseReportId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  render() {
    const {
      match: {
        params: { releaseReportId },
      },
    } = this.props;

    return (
      <div>
        <Query
          resourceName="releaseReports"
          url="/release-reports"
          schema={releaseReportsSchema}
          render={({ loading, error }) => (
            <Resource
              resourceName="releaseReports"
              filter={{ id: releaseReportId }}
              render={({ releaseReports }) => {
                if (loading && !releaseReports.length) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (!releaseReports.length) {
                  return <div>No releaseReports</div>;
                }
                const releaseReport = releaseReports[0];

                return (
                  <div>
                    <Breadcrumbs
                      sections={[
                        { content: 'Release reports', to: '/release-reports' },
                        { content: releaseReport.id },
                      ]}
                    />
                    <Heading size="h1">Report: {releaseReport.id}</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <DefinitionList listData={releaseReport} renderProperty={renderProperty} />
                      </Grid.Column>
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

export default ReleaseReportsShow;
