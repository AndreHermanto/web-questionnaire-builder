import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { QueryResource, rest } from 'web-components';
import { consentTypesSchema } from './schemas';
import ReleasesGenerateURLsForm from './ReleasesForm/ReleasesGenerateURLsForm';

class ReleasesGenerateURLs extends Component {
  static propTypes = {
    closePanel: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        consentTypeId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = { releaseUrls: [], errorMessage: '' };

  generateUrls = ({ baseURL, urls }) => {
    if (!baseURL || !Array.isArray(urls) || urls.length === 0) return [];
    return urls.map(url => ({
      url: `${baseURL}/#/home/${encodeURIComponent(url.userId)}/${encodeURIComponent(
        url.consentTypeId,
      )}?timestamp=${encodeURIComponent(url.timestamp)}`,
    }));
  };

  handleGenerateUrls = async (values) => {
    try {
      const response = await rest.post(`${process.env.REACT_APP_BASE_URL}/secure/generate/`, {
        consentTypeId: this.props.match.params.consentTypeId,
        count: values.get('count'),
      });
      if (response.ok) {
        const data = await response.json();
        this.setState({ releaseUrls: this.generateUrls(data) });
      } else {
        this.setState({
          releaseUrls: [],
          errorMessage: `Error generating urls : ${response.status}`,
        });
      }
    } catch (err) {
      this.setState({ releaseUrls: [], errorMessage: `Error generating urls : ${err}` });
    }
  };

  render() {
    const {
      closePanel,
      match: {
        params: { consentTypeId },
      },
    } = this.props;
    return (
      <QueryResource
        queries={[
          {
            resourceName: 'consentTypes',
            url: '/consent-types',
            schema: consentTypesSchema,
            filter: { id: consentTypeId },
          },
        ]}
      >
        {({ consentTypes }) => (
          <ReleasesGenerateURLsForm
            consentTypeTitle={consentTypes[0].title}
            releaseUrls={this.state.releaseUrls}
            errorMessage={this.state.errorMessage}
            onSubmit={this.handleGenerateUrls}
            onCancel={closePanel}
          />
        )}
      </QueryResource>
    );
  }
}

export default ReleasesGenerateURLs;
