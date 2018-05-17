import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, QueryResource } from 'web-components';
import ElementsLogicForm from './ElementsLogicForm';
import { elementSchema } from './schemas';

const ElementsLogicEdit = (props) => {
  const {
    closePanel,
    match: {
      params: { elementId },
    },
  } = props;
  return (
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
        const element = elements[0];
        return (
          <Mutation
            resourceName="elements"
            url={`/elements/${elementId}`}
            schema={elementSchema}
            post={closePanel}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }
              return (
                <ElementsLogicForm
                  form={`element-logic-edit-${elementId}`}
                  initialValues={element}
                  onSubmit={update}
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
ElementsLogicEdit.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsLogicEdit;
