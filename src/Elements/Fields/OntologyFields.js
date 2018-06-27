import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Fields } from 'web-components';
import { ontologiesSchema } from '../../Ontologies/schemas';

const OntologyFields = ({ name, label, ...rest }) => (
  <QueryResource
    queries={[
      {
        resourceName: 'ontologies',
        url: '/datasources',
        schema: ontologiesSchema,
      },
    ]}
  >
    {({ ontologies }) => (
      <Fields.Select
        {...rest}
        name={name}
        label={label}
        options={ontologies.map(ontology => ({
          key: ontology.id,
          value: ontology.id,
          text: ontology.title,
        }))}
      />
    )}
  </QueryResource>
);

OntologyFields.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
};

OntologyFields.defaultProps = {
  label: 'Ontology',
};

export default OntologyFields;
