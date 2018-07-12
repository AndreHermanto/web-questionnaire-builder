import { schema } from 'web-components';

const statSchema = new schema.Entity('stats', {}, { idAttribute: 'numberOfQuestionnaires' });

export default statSchema;
