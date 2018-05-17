import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, QueryResource } from 'web-components';
import ExamplesForm from './ExamplesForm';
import { exampleSchema } from './schemas';

const ExamplesEdit = (props) => {
  const {
    closePanel,
    match: {
      params: { exampleId },
    },
  } = props;
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'examples',
          url: `/examples/${exampleId}`,
          schema: exampleSchema,
          filter: { id: exampleId },
        },
      ]}
    >
      {({ examples }) => {
        const example = examples[0];
        return (
          <Mutation
            resourceName="examples"
            url={`/examples/${exampleId}`}
            schema={exampleSchema}
            post={closePanel}
            render={({ update, loading: updateLoading }) => {
              if (updateLoading) {
                return <div>loading...</div>;
              }
              return (
                <ExamplesForm
                  form={`examples-${exampleId}`}
                  initialValues={example}
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
ExamplesEdit.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      exampleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ExamplesEdit;
