import { schema } from 'web-components';

export const ontologySchema = new schema.Entity('ontologies');
export const ontologiesSchema = [ontologySchema];

export const ontologyVersionSchema = new schema.Entity('ontologyVersions');
export const ontologyVersionsSchema = [ontologyVersionSchema];

export const diffReportSchema = new schema.Entity(
  'diffReports',
  {},
  { idAttribute: 'datasourceId' },
);
export const diffReportsSchema = [diffReportSchema];
