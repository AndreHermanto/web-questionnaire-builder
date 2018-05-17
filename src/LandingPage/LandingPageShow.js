import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import styled from 'styled-components';
import { Query, Resource, Heading, Breadcrumbs, Buttons } from 'web-components';
import { headingsSchema } from './schemas';

const MarkdownContainer = styled.div`
  margin-bottom: 10px;
  font-size: 24px;
  word-break: break-all;
`;
class LandingPageShow extends React.Component {
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
        <Query
          resourceName="headingsData"
          url={`/headingsData?consentTypeId=${consentTypeId}`}
          schema={headingsSchema}
          render={({ loading, error }) => (
            <Resource
              resourceName="headingsData"
              filter={{ consentTypeId }}
              render={({ headingsData }) => {
                if (loading) {
                  return <div>loading...</div>;
                }
                if (error) {
                  return <div>Error: {error}</div>;
                }
                if (!headingsData.length) {
                  return <div>No data found.</div>;
                }
                const data = headingsData[0];

                return (
                  <div>
                    <Breadcrumbs
                      sections={[
                        { content: 'Landing page', to: '/landing-page' },
                        { content: data.consentTypeId },
                      ]}
                    />
                    <Heading size="h1">Preview</Heading>
                    <Grid>
                      <Grid.Column width={12}>
                        <MarkdownContainer style={{ color: '#00437E' }}>
                          {data.title && (
                            <Markdown
                              source={data.title}
                              escapeHtml
                              skipHtml
                              style={{ padding: 20 }}
                            />
                          )}
                        </MarkdownContainer>
                        <MarkdownContainer
                          style={{
                            color: '#62A5DB',
                          }}
                        >
                          {data.heading && <Markdown source={data.heading} escapeHtml skipHtml />}
                        </MarkdownContainer>
                        <div style={{ wordBreak: 'break-all' }}>
                          {data.text && <Markdown source={data.text} escapeHtml skipHtml />}
                        </div>{' '}
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Buttons
                          actions={[
                            {
                              content: 'Edit',
                              to: {
                                pathname: `/landing-page/consents/${data.consentTypeId}/edit`,
                                state: { modal: true },
                              },
                            },
                          ]}
                        />
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

export default LandingPageShow;
