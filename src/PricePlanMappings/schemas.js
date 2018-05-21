import { schema } from 'web-components';

export const pricePlanSchema = new schema.Entity('pricePlans');
export const pricePlansSchema = [pricePlanSchema];

export const pricePlanMappingSchema = new schema.Entity('pricePlanMappings');
export const pricePlanMappingsSchema = [pricePlanMappingSchema];
