import React from 'react';
import PropTypes from 'prop-types';
import { Form, Loader, Message } from 'semantic-ui-react';
import { Heading, Fields, Buttons, Table, Query, Resource } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { prefixTermsSchema, conceptsSchema } from '../schemas';

/* eslint-disable */
const headerRow = [
  {
    propName: 'uri',
    label: 'Uri',
  },
  {
    propName: 'label',
  },
];

const renderBodyRow = (ontology, onAddOntology) => ({
  key: ontology.uri,
  cells: [ontology.uri || '', ontology.displayLabel || ''],
  actions: [
    {
      content: 'Add',
      onClick: () => onAddOntology(ontology),
    },
  ],
});

const displayOntology = (ontologies, onAddOntology) => {
  return (
    <Table
      headerRow={headerRow}
      renderBodyRow={props => renderBodyRow(props, onAddOntology)}
      tableData={ontologies}
    />
  );
};
const getOntologyTermById = (conceptId, onAddOntology) => {
  return (
    <Query
      url={`/concepts/${conceptId}`}
      schema={conceptsSchema}
      render={({ loading, error, loaders }) => (
        <Resource
          resourceName="conceptTerms"
          filter={{ id: conceptId }}
          render={({ conceptTerms }) => {
            if (loading) {
              return <Loader inline="centered" content="Loading ontology" active={loading} />;
            }
            if (error) {
              return <div>Error: {error}</div>;
            }

            if (conceptTerms.length <= 0) {
              return (
                <Message negative>
                  <Message.Header>Ontology not found.</Message.Header>
                  <p>Concept Id: {conceptId}</p>
                </Message>
              );
            }

            return displayOntology(conceptTerms, onAddOntology);
          }}
        />
      )}
    />
  );
};

const getOntologyTermsStartingWith = (prefix, category, onAddOntology) => {
  return (
    <Query
      url={`/prefix-search/concepts?prefix=${prefix}&category=${category}`}
      schema={prefixTermsSchema}
      render={({ loading, error, loaders }) => (
        <Resource
          resourceName="prefixTerms"
          render={({ prefixTerms }) => {
            if (loading) {
              return <Loader inline="centered" content="Loading ontology" active={loading} />;
            }
            if (error) {
              return <div>Error: {error}</div>;
            }

            if (prefixTerms.length <= 0) {
              return (
                <Message negative>
                  <Message.Header>Ontology not found.</Message.Header>
                  <p>Prefix text: {prefix}</p>
                </Message>
              );
            }

            return displayOntology(prefixTerms, onAddOntology);
          }}
        />
      )}
    />
  );
};

let ElementsOntologyTaggingForm = ({ onAddOntology, onCancel, concept }) => {
  const getTypeOfSearching = concept => {
    if (concept.slice(0, 3) === 'HP:' || concept.slice(0, 3) === 'hp:') {
      return getOntologyTermById(concept.toUpperCase(), onAddOntology);
    } else return getOntologyTermsStartingWith(concept, 'PHENOTYPING', onAddOntology);
  };
  return (
    <Form>
      <Heading size="h1">Find a Concept</Heading>
      <Fields.Text name="concept" label="Concept ID (e.g. HPO ID)" required />
      {concept && concept !== '' && getTypeOfSearching(concept)}

      <Buttons
        actions={[
          {
            content: 'Cancel',
            onClick: onCancel,
            type: 'button',
          },
        ]}
      />
    </Form>
  );
};

ElementsOntologyTaggingForm.propTypes = {
  onAddOntology: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ElementsOntologyTaggingForm = reduxForm({
  enableReinitialize: true,
  form: 'ontology-tagging-form',
})(ElementsOntologyTaggingForm);

ElementsOntologyTaggingForm = connect((state, props) => {
  const selector = formValueSelector('ontology-tagging-form');
  const concept = selector(state, 'concept');
  return {
    concept,
  };
})(ElementsOntologyTaggingForm);

export default ElementsOntologyTaggingForm;
