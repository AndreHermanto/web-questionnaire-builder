import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Resource, Query } from 'web-components';
import QuestionnaireTagsForm from './QuestionnaireTagsForm';
import { questionnaireTagSchema } from './schemas';

const QuestionnaireTagsEdit = (props) => {
  const {
    closePanel,
    match: {
      params: { questionnaireId },
    },
  } = props;
  const handleTagSubmit = (create, values) => {
    const payload = {
      questionnaireId,
      tagId: values.get('tagId'),
    };
    create(payload);
  };
  return (
    <Query
      queries={[
        {
          resourceName: 'questionnaireTags',
          url: `/questionnaire-tags?questionnaireId=${questionnaireId}`,
          schema: questionnaireTagSchema,
        },
      ]}
      render={({ error }) => (
        <Resource
          resources={[
            {
              resourceName: 'questionnaireTags',
              filter: { questionnaireId },
            },
            {
              resourceName: 'tags',
            },
          ]}
          render={({ questionnaireTags, tags }) => {
            if (error) {
              return <div>Error: {error}</div>;
            }
            const filteredTags = tags.filter(
              tag =>
                !questionnaireTags.map(questionnareTag => questionnareTag.tagId).includes(tag.id),
            );
            const tagsOption = filteredTags.map(tag => ({
              key: tag.id,
              text: tag.name,
              value: tag.id,
            }));

            return (
              <Mutation
                resourceName="questionnaireTags"
                url={'/questionnaire-tags'}
                schema={questionnaireTagSchema}
                post={closePanel}
                render={({ create, loading: updateLoading }) => {
                  if (updateLoading) {
                    return <div>loading...</div>;
                  }
                  if (tagsOption.length < 1) {
                    return <div>You cannot add any more tags</div>;
                  }
                  return (
                    <QuestionnaireTagsForm
                      form={`tag-${questionnaireId}`}
                      options={tagsOption}
                      onSubmit={(values) => {
                        handleTagSubmit(create, values);
                      }}
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
QuestionnaireTagsEdit.propTypes = {
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      exampleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QuestionnaireTagsEdit;
