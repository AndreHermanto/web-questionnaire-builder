import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Icon } from 'semantic-ui-react';
import { Heading, Fields, Buttons, Resource, resourceActions } from 'web-components';
import { reduxForm } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { conceptsSchema } from '../schemas';

export const HPO = styled.label`
  margin-right: 4px;
  margin-bottom: 5px;
  display: -webkit-inline-box !important;
  padding: 8px !important;
  font-weight: 300 !important;
  background-color: #fff !important;
  color: #333 !important;
  border: 1px solid #eee;
`;

export const TrashButton = styled(Icon)`
  margin-left: 6px !important;
  color: #d66 !important;
  cursor: pointer;
`;
// eslint-disable-next-line import/no-mutable-exports
let ElementsOntologyTaggingForm = ({
  onCancel,
  onDelete,
  fetchResource,
  handleSubmit,
  initialValues,
}) => {
  const renderConcept = (label, id) => {
    if (label && label.length <= 35) {
      return `${label} (${id})`;
    }
    return `${label.substring(0, 35).concat('...')} (${id})`;
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Heading size="h1">Find a Concept</Heading>
      <Resource
        resources={[
          {
            resourceName: 'conceptTerms',
            schema: conceptsSchema,
          },
        ]}
        render={({ conceptTerms }) => {
          const setTypeOfSearching = (e, { searchQuery }) => {
            const url =
              searchQuery.slice(0, 3) === 'HP:' || searchQuery.slice(0, 3) === 'hp:'
                ? `/concepts/${searchQuery.toUpperCase()}`
                : `/prefix-search/concepts?prefix=${searchQuery}&category=PHENOTYPING`;

            return fetchResource({
              url,
              resourceName: 'conceptTerms',
              schema: conceptsSchema,
            });
          };

          return (
            <Fields.Select
              label="Search ontology"
              name="concepts"
              options={conceptTerms.map(concept => ({
                key: concept.uri,
                value: concept,
                text: `${concept.displayLabel || concept.label} (${concept.uri})`,
              }))}
              onSearchChange={setTypeOfSearching}
              multiple
              search
              required
              placeholder="Concept ID (e.g. HPO ID)"
            />
          );
        }}
      />
      {initialValues &&
        initialValues.get('concepts').size > 0 && (
        <div>
          {initialValues.get('concepts').map(concept => (
            <HPO key={concept.get('id')}>
              {renderConcept(concept.get('label'), concept.get('id'))}
              <TrashButton name="trash" onClick={() => onDelete(concept.get('id'))} />
            </HPO>
          ))}
        </div>
      )}

      <Buttons
        actions={[
          {
            content: 'Save',
            type: 'submit',
          },
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
  handleSubmit: PropTypes.func.isRequired,
  fetchResource: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    concepts: PropTypes.arrayOf({
      id: PropTypes.string.isRequired,
      displayLabel: PropTypes.string.isRequired,
    }).isRequired,
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

ElementsOntologyTaggingForm = reduxForm({
  enableReinitialize: true,
  form: 'ontology-tagging-form',
})(ElementsOntologyTaggingForm);

ElementsOntologyTaggingForm = connect(
  () => {},
  dispatch => bindActionCreators(resourceActions, dispatch),
)(ElementsOntologyTaggingForm);

export default ElementsOntologyTaggingForm;
