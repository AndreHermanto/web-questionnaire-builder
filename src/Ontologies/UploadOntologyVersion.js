import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation } from 'web-components';
import { ontologySchema } from './schemas';
import UploadOntologyVersionForm from './forms/UploadOntologyVersionForm';

function UploadOntologyVersion({
  closePanel,
  match: {
    params: { ontologyId },
  },
}) {
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'ontologies',
          url: `/datasources/${ontologyId}`,
          schema: ontologySchema,
          filter: { id: ontologyId },
        },
      ]}
      render={({ ontologies }) => {
        if (!ontologies.length) {
          return <div>No result...</div>;
        }
        const ontology = ontologies[0];
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
              return (
                <UploadOntologyVersionForm
                  initialValues={{ releaseName: ontology.activeVersion.releaseVersion }}
                  onSubmit={create}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
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
