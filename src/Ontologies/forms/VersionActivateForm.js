import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Mutation } from 'web-components';
import { ontologySchema } from '../schemas';
import VersionActivateFormBase from './VersionActivateFormBase';

/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */
function VersionActivateForm({
  closePanel,
  match: { params: { ontologyId } },
  location: { search },
}) {
  const versionId = queryString.parse(search).versionId;

  return (
    <Mutation
      resourceName="ontologies"
      url={`/datasources/${ontologyId}/activeVersion`}
      schema={ontologySchema}
      post={closePanel}
      render={({ update, loading: updateLoading }) => {
        if (updateLoading) {
          return <div>loading...</div>;
        }
        const formProps = {
          form: 'ontologies-version-activate',
          versionId,
          onSubmit: () => update({ versionId }),
          onCancel: closePanel,
        };
        return <VersionActivateFormBase {...formProps} />;
      }}
    />
  );
}

VersionActivateForm.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      versionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.shape({
      versionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default VersionActivateForm;
