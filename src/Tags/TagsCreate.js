import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'web-components';
import TagsForm from './TagsForm';
import { tagSchema } from './schemas';

const TagsCreate = (props) => {
  const { closePanel } = props;
  return (
    <Mutation
      resourceName="tags"
      url={'/tags'}
      schema={tagSchema}
      post={closePanel}
      render={({ create, loading }) => {
        if (loading) {
          return <div>loading...</div>;
        }
        return <TagsForm form={'tags-create'} onSubmit={create} onCancel={closePanel} />;
      }}
    />
  );
};
TagsCreate.propTypes = {
  closePanel: PropTypes.func.isRequired,
};

export default TagsCreate;
