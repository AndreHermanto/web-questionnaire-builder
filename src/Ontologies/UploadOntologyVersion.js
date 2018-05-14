import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import { ontologySchema } from './schemas';
import UploadOntologyVersionForm from './forms/UploadOntologyVersionForm';

function UploadOntologyVersion({
  closePanel,
  match: {
    params: { ontologyId },
  },
}) {
  return (
    <Mutation
      resourceName="ontologies"
      url={`/datasources/${ontologyId}/upload`}
      schema={ontologySchema}
      post={closePanel}
      render={({ create, loading: pending }) => {
        if (pending) {
          return <div>loading...</div>;
        }
        return <UploadOntologyVersionForm onSubmit={create} onCancel={closePanel} />;
      }}
    />
  );
}

UploadOntologyVersion.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      versionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default UploadOntologyVersion;
