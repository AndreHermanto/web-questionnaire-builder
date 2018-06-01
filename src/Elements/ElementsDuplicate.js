import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation, QueryResource } from 'web-components';
import { elementSchema } from './schemas';

const ElementsDuplicate = (props) => {
  const {
    closePanel,
    history,
    match: {
      params: { elementId, questionnaireId },
    },
  } = props;
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'elements',
          url: `/questionnaires/${questionnaireId}/elements/${elementId}`,
          schema: elementSchema,
          filter: { id: elementId },
        },
      ]}
    >
      {({ elements }) => {
        const element = elements[0];
        delete element.id;
        return (
          <Mutation
            resourceName="elements"
            url={'/elements'}
            schema={elementSchema}
            post={() => history.push(`/questionnaires/${questionnaireId}`)}
            render={({ create, loading }) => {
              if (loading) {
                return <div>loading...</div>;
              }
              return (
                <Confirmation
                  title="Duplicate element?"
                  content="Do you want to duplicate this element?"
                  confirmLabel="Yes, duplicate element"
                  cancelLabel="No"
                  onConfirm={() => create(element)}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QueryResource>
  );
};
ElementsDuplicate.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsDuplicate;
