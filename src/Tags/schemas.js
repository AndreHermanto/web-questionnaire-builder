import { schema } from 'web-components';

export const tagSchema = new schema.Entity('tags');
export const tagsSchema = new schema.Array(tagSchema);
