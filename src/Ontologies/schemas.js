import { schema } from 'normalizr';

export const ontologySchema = new schema.Entity('ontologies');
export const ontologiesSchema = [ontologySchema];

export const ontologyVersionSchema = new schema.Entity('ontologyVersions');
export const ontologyVersionsSchema = [ontologyVersionSchema];
