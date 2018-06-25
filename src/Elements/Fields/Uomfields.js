import React from 'react';
import PropTypes from 'prop-types';
import { Query, Resource, Fields } from 'web-components';
import { prefixTermsSchema } from './../schemas';

class Uomfields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '/prefix-search/concepts?prefix=&category=uom', // this is to avoid the 404 api error on initial mounting
      searchQuery: '',
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange = (e, { searchQuery }) => {
    this.setState({
      searchQuery,
      url: `/prefix-search/concepts?prefix=${searchQuery}&category=uom`,
    });
  };

  render() {
    const { url } = this.state;
    const { change, label, name } = this.props;
    return (
      <Query
        resourceName="prefixTerms"
        url={url}
        schema={prefixTermsSchema}
        render={() => (
          <Resource
            resourceName="prefixTerms"
            render={({ prefixTerms }) => {
              const options = prefixTerms.map(value => ({
                key: value.uri,
                value: {
                  id: value.uri,
                  label: value.displayLabel,
                },
                text: value.displayLabel,
              }));

              return (
                <Fields.Select
                  search
                  onSearchChange={this.handleSearchChange}
                  name={name}
                  label={label}
                  options={options}
                  onChange={(e, newValue) => {
                    change(name, newValue);
                  }}
                />
              );
            }}
          />
        )}
      />
    );
  }
}

Uomfields.propTypes = {
  change: PropTypes.func.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
};

Uomfields.defaultProps = {
  label: 'Unit of Measurement',
};

export default Uomfields;
