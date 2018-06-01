import { schema } from 'web-components';

export const answerSchema = new schema.Entity('answers');
export const answersScehma = [answerSchema];

export const elementSchema = new schema.Entity('elements', { answers: [answerSchema] });
export const elementsSchema = [elementSchema];

export const conceptSchema = new schema.Entity('conceptTerms');
export const conceptsSchema = [conceptSchema];

export const prefixTermSchema = new schema.Entity('prefixTerms', {}, { idAttribute: 'uri' });
export const prefixTermsSchema = [prefixTermSchema];
