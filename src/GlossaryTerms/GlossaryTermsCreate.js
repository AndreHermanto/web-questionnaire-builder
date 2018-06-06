import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import { glossaryTermSchema } from './schemas';
import GlossaryTermsForm from './GlossaryTermsForm';
/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */
function GlossaryTermsCreate({ closePanel }) {
  return (
    <Mutation
      resourceName="glossaryTerms"
      url={'/glossary-terms'}
      schema={glossaryTermSchema}
      post={closePanel}
      render={({ create, loading: updateLoading }) => {
        if (updateLoading) {
          return <div>loading...</div>;
        }

        return <GlossaryTermsForm onSubmit={create} onCancel={closePanel} />;
      }}
    />
  );
}

GlossaryTermsCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
};

export default GlossaryTermsCreate;
