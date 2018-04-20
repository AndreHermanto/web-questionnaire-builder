import { schema } from 'normalizr';

export const questionnaireSchema = new schema.Entity('questionnaires');
export const questionnairesSchema = [questionnaireSchema];

export const folderSchema = new schema.Entity('folders');
export const foldersSchema = [folderSchema];
