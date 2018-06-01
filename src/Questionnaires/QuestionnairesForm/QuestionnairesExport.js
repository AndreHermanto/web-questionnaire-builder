import React from 'react';
import PropTypes from 'prop-types';
import yamlJS from 'js-yaml';
import FileSaver from 'file-saver';
import { Query, Resource } from 'web-components';
import { versionSchema } from '../schemas';
import QuestionnairesExportForm from './QuestionnairesExportForm';

export default function PricePlanMappingsCreate({
  closePanel,
  match: {
    params: { questionnaireId, currentVersionId },
  },
}) {
  const handleDownload = (yamlData, closeExport) => {
    const blob = new Blob([yamlData], {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(blob, 'download.yml');
    closeExport();
  };
  return (
    <div>
      <Query
        resourceName="versions"
        url={`/questionnaires/${questionnaireId}/versions/${currentVersionId}`}
        schema={versionSchema}
        render={({ loading, error }) => (
          <Resource
            resourceName="versions"
            filter={{ id: currentVersionId }}
            schema={versionSchema}
            render={({ versions }) => {
              if (loading && !versions.length) {
                return <div>loading...</div>;
              }
              if (error) {
                return <div>Error: {error}</div>;
              }
              if (versions.length === 0) {
                return <div>No version found.</div>;
              }
              const yamlVersion = yamlJS.safeDump(versions[0]);
              return (
                <QuestionnairesExportForm
                  onCancel={closePanel}
                  form={`questionnaire-${questionnaireId}-export-form`}
                  initialValues={{ yamlData: yamlVersion }}
                  onSubmit={values => handleDownload(values.get('yamlData'), closePanel)}
                />
              );
            }}
          />
        )}
      />
    </div>
  );
}

PricePlanMappingsCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
