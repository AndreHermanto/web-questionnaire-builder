import { schema } from 'web-components';

export const questionnaireSchema = new schema.Entity('questionnaires');
export const questionnairesSchema = [questionnaireSchema];

export const versionSchema = new schema.Entity('versions');

export const folderSchema = new schema.Entity('folders');
export const foldersSchema = [folderSchema];
