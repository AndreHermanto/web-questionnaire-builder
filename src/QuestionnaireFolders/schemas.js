import { schema } from 'web-components';

export const folderSchema = new schema.Entity('folders');
export const foldersSchema = [folderSchema];

export const questionnaireFolderSchema = new schema.Entity('questionnaireFolders');
export const questionnaireFoldersSchema = [questionnaireFolderSchema];
