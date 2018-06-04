import { schema } from 'web-components';

export const consentTypeSchema = new schema.Entity('consentTypes');
export const consentTypesSchema = [consentTypeSchema];

export const releaseSchema = new schema.Entity('releases');
export const releasesSchema = [releaseSchema];
