import { schema } from 'web-components';
import { elementSchema } from '../Elements/schemas';

export const questionnaireSchema = new schema.Entity('questionnaires');
export const importedQuestionnaireSchema = new schema.Entity('importedQuestionnaire');
export const questionnairesSchema = [questionnaireSchema];

export const versionSchema = new schema.Entity('versions', {
  body: [elementSchema],
});

export const versionsSchema = [versionSchema];

export const userSchema = new schema.Entity('users');
export const usersSchema = [userSchema];

export const previewResponseSchema = new schema.Entity('previewResponses');
export const previewResponsesSchema = [previewResponseSchema];

export const encryptedTokenSchema = new schema.Entity(
  'encryptedToken',
  {},
  { idAttribute: 'consentTypeId' },
);

export const questionnaireTagSchema = new schema.Entity('questionnaireTags');
export const questionnaireTagsSchema = [questionnaireTagSchema];
