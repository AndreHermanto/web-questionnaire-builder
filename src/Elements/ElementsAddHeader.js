import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import ElementsAddHeaderForm from './ElementsAddHeaderForm';
import { elementSchema } from './schemas';

const ElementsAddHeader = (props) => {
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
        return (
          <ElementsAddHeaderForm
            form={'elements-header-create'}
            onSubmit={element => create(element.set('type', 'section'))}
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
