import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { Mutation, Query, Resource } from 'web-components';
import { ontologySchema } from './schemas';
import Create from './forms/Create';

/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */

function OntologyForm({ closePanel, match: { params: { ontologyId } } }) {
  return (
    <Query
      resourceName="ontologies"
      url={`/datasources/${ontologyId}`}
      schema={ontologySchema}
      render={({ loading, error }) => (
        <Resource
          resourceName="ontologies"
          filter={{ id: ontologyId }}
          render={({ ontologies }) => {
            if (loading && !ontologies.length) {
              return <div>updating...</div>;
            }
            if (error) {
              return <div>Error: {error}</div>;
            }
            const ontology = ontologies[0];

            return (
              <div>
                <Create />{' '}
              </div>
            );
          }}
        />
      )}
    />
  );
}

OntologyForm.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      ontologyId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default OntologyForm;
