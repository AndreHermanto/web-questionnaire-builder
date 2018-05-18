import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation } from 'web-components';
import { elementSchema } from './schemas';
import ElementsAddImageForm from './ElementsAddImageForm';

function ElementsAddImage({
  closePanel,
  match: {
    params: { elementId },
  },
}) {
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
                <ElementsAddImageForm
                  onSubmit={values =>
                    update({
                      ...element,
                      image: `${process.env.REACT_APP_BASE_URL}/download?id=${
                        values.get('file').id
                      }`,
                    })
                  }
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QueryResource>
  );
}

ElementsAddImage.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsAddImage;
