import React from 'react';
import PropTypes from 'prop-types';
import { Query, Resource, Fields } from 'web-components';
import { conceptsSchema } from './../schemas';

class Uomfields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      searchQuery: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSearchChange = (e, { searchQuery }) => {
    this.setState({
      searchQuery,
      url: `/prefix-search/concepts?prefix=${searchQuery}&category=uom`,
    });
  };
  handleChange = (e, { searchQuery, searchValue }) => this.setState({ searchQuery, searchValue });

  render() {
    const { url } = this.state;
    const { change, label, name } = this.props;
    return (
      <Query
        resourceName="concepts"
        url={url}
        schema={conceptsSchema}
        render={() => (
          <Resource
            resourceName="concepts"
            render={({ concepts }) => {
              const options = concepts.map(value => ({
                key: value.uri,
                value: {
                  id: value.uri,
                  label: value.label,
                },
                text: value.label,
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
