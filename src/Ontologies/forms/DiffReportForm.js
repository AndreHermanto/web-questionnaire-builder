import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Query, Resource } from 'web-components';
import { diffReportsSchema } from '../schemas';
import DiffReportFormBase from './DiffReportFormBase';

/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */

function DiffReprotForm({ closePanel, match: { params: { ontologyId } }, location: { search } }) {
  const versionId = queryString.parse(search).versionId;
  return (
    <Query
      resourceName="diffReports"
      url={`/diff-reports?datasourceId=${ontologyId}&versionId=${versionId}`}
      schema={diffReportsSchema}
      render={({ loading, error }) => (
        <Resource
          resourceName="diffReports"
          render={({ diffReports }) => {
            if (loading && !diffReports.length) {
              return <div>updating...</div>;
            }
            if (error) {
              return <div>Error: {error}</div>;
            }

            // TODO: find correct diffReport
            const diffReport = diffReports[0];

            const formProps = {
              form: 'ontologies-diffReport',
              diffReport,
              onCancel: closePanel,
            };

            return <DiffReportFormBase {...formProps} />;
          }}
        />
      )}
    />
  );
}

DiffReprotForm.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      ontologyId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.shape({
      versionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DiffReprotForm;
