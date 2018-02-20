import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query, Resource } from 'web-components';
import ExamplesForm from './ExamplesForm';
import { exampleSchema } from './schemas';

const ExamplesEdit = (props) => {
  const { closePanel, match: { params: { exampleId } } } = props;
  return (
    <Query
      url={`/examples/${exampleId}`}
      schema={exampleSchema}
      resourceName="examples"
      render={({ loading, error }) => (
        <Resource
          resourceName="examples"
          filter={{ id: exampleId }}
          render={({ examples }) => {
            if (loading && !examples.length) {
              return <div>loading...</div>;
            }
            if (error) {
              return <div>Error: {error}</div>;
            }
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
        />
      )}
    />
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
