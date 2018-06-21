import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation } from 'web-components';
import { questionnaireTagSchema } from './schemas';

const QuestionnaireTagsDelete = (props) => {
  const {
    closePanel,
    match: {
      params: { questionnaireTagId },
    },
  } = props;
  return (
    <Mutation
      resourceName="questionnaireTags"
      url={`/questionnaire-tags/${questionnaireTagId}`}
      schema={questionnaireTagSchema}
      post={closePanel}
      render={({ remove, loading }) => {
        if (loading) {
          return <div>loading...</div>;
        }
        return (
          <Confirmation
            title="Remove Tag?"
            content="Removing the tag stops the questionnaire from having this tag."
            confirmLabel="Yes, Remove Tag"
            cancelLabel="No, Keep Tag"
            onConfirm={() => remove(questionnaireTagId)}
            onCancel={closePanel}
          />
        );
      }}
    />
  );
};
QuestionnaireTagsDelete.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireTagId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QuestionnaireTagsDelete;
