import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation, redirectToLogout } from 'web-components';
import { userSchema } from '../Questionnaires/schemas';

const WorkingGroupsSwitch = (props) => {
  const {
    closePanel,
    match: {
      params: { workingGroupId },
    },
  } = props;
  return (
    <Mutation
      resourceName="users"
      url={'/change-context'}
      schema={userSchema}
      post={() => redirectToLogout()}
      render={({ create, loading }) => {
        if (loading) {
          return <div>Switching...</div>;
        }
        return (
          <Confirmation
            title="Switch Group?"
            content="Do you want to switch this group?"
            confirmLabel="Yes, switch group"
            cancelLabel="No"
            onConfirm={() => create({ workingGroupId })}
            onCancel={closePanel}
          />
        );
      }}
    />
  );
};
WorkingGroupsSwitch.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      workingGroupId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default WorkingGroupsSwitch;
