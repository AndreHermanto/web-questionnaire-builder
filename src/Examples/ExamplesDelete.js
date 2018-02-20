import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Button } from 'web-components';
import { exampleSchema } from './schemas';

const ExamplesDelete = (props) => {
  const { closePanel, history, match: { params: { exampleId } } } = props;
  return (
    <Mutation
      resourceName="examples"
      url={`/examples/${exampleId}`}
      schema={exampleSchema}
      post={() => history.push('/examples')}
      render={({ remove, loading }) => {
        if (loading) {
          return <div>loading...</div>;
        }
        return (
          <div>
            <p>Are you sure you want to delete this?</p>
            <Button primary onClick={remove}>
              Delete
            </Button>
            <Button onClick={closePanel}>Cancel</Button>
          </div>
        );
      }}
    />
  );
};
ExamplesDelete.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      exampleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ExamplesDelete;
