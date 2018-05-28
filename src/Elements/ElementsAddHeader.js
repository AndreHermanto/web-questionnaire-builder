import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import ElementsAddHeaderForm from './ElementsAddHeaderForm';
import { elementSchema } from './schemas';

const ElementsAddHeader = (props) => {
  const { closePanel } = props;
  const handleSubmit = (create, values) => {
    const payload = values.set('type', 'SECTION');
    create(payload);
  };
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
        return (
          <ElementsAddHeaderForm
            form={'elements-header-create'}
            onSubmit={element => handleSubmit(create, element)}
            onCancel={closePanel}
          />
        );
      }}
    />
  );
};
ElementsAddHeader.propTypes = {
  closePanel: PropTypes.func.isRequired,
};

export default ElementsAddHeader;
