import React from 'react';
import PropTypes from 'prop-types';
import { Query, Resource, Mutation } from 'web-components';
import { elementSchema } from './schemas';
import ElementsForm from './ElementsForm';

export default function ElementsEdit({
  closePanel,
  match: {
    params: { elementId },
  },
}) {
  return (
    <div>
      <Query
        resourceName="elements"
        url={`/elements/${elementId}`}
        schema={elementSchema}
        render={({ loading, error }) => (
          <Resource
            resourceName="elements"
            filter={{ id: elementId }}
            render={({ elements }) => {
              if (loading && !elements.length) {
                return <div>Updating...</div>;
              }
              if (error) {
                return <div>Error: {error}</div>;
              }

              return (
                <Mutation
                  resourceName="elements"
                  url={`/elements/${elementId}`}
                  schema={elementSchema}
                  post={closePanel}
                  render={({ update, loading: pending }) => {
                    if (pending) {
                      return <div>loading...</div>;
                    }
                    const formProps = {
                      form: 'elements-form',
                      initialValues: elements[0],
                      onSubmit: update,
                      onCancel: closePanel,
                    };
                    return <ElementsForm {...formProps} />;
                  }}
                />
              );
            }}
          />
        )}
      />
    </div>
  );
}

ElementsEdit.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
