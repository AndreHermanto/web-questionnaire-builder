import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import ExamplesForm from './ExamplesForm';
import { exampleSchema } from './schemas';

const ExamplesCreate = (props) => {
  const { closePanel, history } = props;
  return (
    <Mutation
      resourceName="examples"
      url={'/examples'}
      schema={exampleSchema}
      post={mutationResponse => history.push(`/examples/${mutationResponse.payload.result}`)}
      render={({ create, loading }) => {
        if (loading) {
          return <div>loading...</div>;
        }
        return <ExamplesForm form={'examples-create'} onSubmit={create} onCancel={closePanel} />;
      }}
    />
  );
};
ExamplesCreate.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
};

export default ExamplesCreate;
