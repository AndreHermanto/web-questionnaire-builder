import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Mutation, Confirmation, switchJwt } from 'web-components';
import { contextSchema } from './schemas';
import { userSchema } from '../Questionnaires/schemas';

const WorkingGroupsSwitch = (props) => {
  const {
    closePanel,
    match: {
      params: { workingGroupId },
    },
  } = props;
  return (
    <QueryResource
      queries={[
        {
          resourceName: 'users',
          url: '/me',
          schema: userSchema,
          delay: true,
        },
      ]}
    >
      {({ loader }) => (
        <Mutation
          resourceName="context"
          url={'/change-context'}
          schema={contextSchema}
          post={async (mutationResponse) => {
            const newJwt = await mutationResponse.payload.text();
            await switchJwt(newJwt);
            await loader.users.load();
            return closePanel();
          }}
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
      )}
    </QueryResource>
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
