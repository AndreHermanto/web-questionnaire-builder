import { schema } from 'normalizr';

export const questionnaireFolderSchema = new schema.Entity('questionnaireFolders');
export const questionnaireFoldersSchema = [questionnaireFolderSchema];
