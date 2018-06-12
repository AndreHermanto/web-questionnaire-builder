import React from 'react';
import PropTypes from 'prop-types';
import { Confirmation, Mutation } from 'web-components';
import { glossaryTermSchema } from './schemas';

const GlossaryTermsDelete = (props) => {
  const {
    closePanel,
    history,
    match: {
      params: { glossaryTermId },
    },
  } = props;
  return (
    <Mutation
      resourceName="glossaryTerms"
      url={`/glossary-terms/${glossaryTermId}`}
      schema={glossaryTermSchema}
      post={() => {
        history.push('/glossary-terms');
      }}
      render={({ remove, loading: pending }) => {
        if (pending) {
          return <div>Deleting glossary term...</div>;
        }
        return (
          <Confirmation
            title="Delete glossary term?"
            content="Deleting an glossary term will remove it from the system forever"
            confirmLabel="Yes"
            cancelLabel="No"
            onConfirm={() => remove(glossaryTermId)}
            onCancel={closePanel}
          />
        );
      }}
    />
  );
};
GlossaryTermsDelete.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default GlossaryTermsDelete;
