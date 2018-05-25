import { schema } from 'web-components';
import { elementSchema } from '../Elements/schemas';

export const questionnaireSchema = new schema.Entity('questionnaires');
export const importedQuestionnaireSchema = new schema.Entity('importedQuestionnaire');
export const questionnairesSchema = [questionnaireSchema];

export const versionSchema = new schema.Entity('versions', {
  body: [elementSchema],
});

export const versionsSchema = [versionSchema];

export const folderSchema = new schema.Entity('folders');
export const foldersSchema = [folderSchema];
