import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import { ontologySchema } from '../schemas';
import CreateEditFormBase from './CreateEditFormBase';

/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */
function OntologyEdit({ closePanel }) {
  return (
    <Mutation
      resourceName="ontologies"
      url={'/datasources/'}
      schema={ontologySchema}
      post={closePanel}
      render={({ create, loading: updateLoading }) => {
        if (updateLoading) {
          return <div>loading...</div>;
        }
        const formProps = {
          form: 'ontologies-create',
          onSubmit: create,
          onCancel: closePanel,
        };
        return <CreateEditFormBase {...formProps} />;
      }}
    />
  );
}

OntologyEdit.propTypes = {
  closePanel: PropTypes.func.isRequired,
};

export default OntologyEdit;
