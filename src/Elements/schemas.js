import { schema } from 'web-components';

export const answerSchema = new schema.Entity('answers');
export const answersScehma = [answerSchema];

export const elementSchema = new schema.Entity('elements', { answers: [answerSchema] });
export const elementsSchema = [elementSchema];
