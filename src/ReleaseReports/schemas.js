import { schema } from 'normalizr';

export const releaseReportSchema = new schema.Entity('releaseReports');
export const releaseReportsSchema = [releaseReportSchema];
