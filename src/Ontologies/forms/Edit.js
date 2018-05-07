import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query, Resource } from 'web-components';
import { ontologySchema } from '../schemas';
import CreateEditFormBase from './CreateEditFormBase';

/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */
function Edit({ closePanel, match: { params: { ontologyId } } }) {
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
              <Mutation
                resourceName="ontologies"
                url={`/datasources/${ontologyId}`}
                schema={ontologySchema}
                post={closePanel}
                render={({ update, loading: updateLoading }) => {
                  if (updateLoading) {
                    return <div>loading...</div>;
                  }
                  const formProps = {
                    form: `ontologies-edit-${ontologyId}`,
                    initialValues: ontology,
                    onSubmit: update,
                    onCancel: closePanel,
                  };
                  return <CreateEditFormBase {...formProps} />;
                }}
              />
            );
          }}
        />
      )}
    />
  );
}

Edit.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      ontologyId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Edit;
