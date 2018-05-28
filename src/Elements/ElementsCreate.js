import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import ElementsForm from './ElementsForm';
import { elementSchema } from './schemas';

const ElementsCreate = (props) => {
  const { closePanel } = props;
  return (
    <Mutation
      resourceName="elements"
      url={'/elements'}
      schema={elementSchema}
      post={closePanel}
      render={({ create, loading }) => {
        if (loading) {
          return <div>loading...</div>;
        }
        return <ElementsForm form={'elements-create'} onSubmit={create} onCancel={closePanel} />;
      }}
    />
  );
};
ElementsCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
};

export default ElementsCreate;
