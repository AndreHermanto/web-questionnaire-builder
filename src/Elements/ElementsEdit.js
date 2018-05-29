import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation } from 'web-components';
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
      <QueryResource
        queries={[
          {
            resourceName: 'elements',
            url: `/elements/${elementId}`,
            schema: elementSchema,
            filter: { id: elementId },
          },
        ]}
      >
        {({ elements }) => {
          if (!elements.length) {
            return <div>No Elements</div>;
          }
          const element = elements[0];
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
                  initialValues: element,
                  onSubmit: update,
                  onCancel: closePanel,
                };
                return <ElementsForm {...formProps} />;
              }}
            />
          );
        }}
      </QueryResource>
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
