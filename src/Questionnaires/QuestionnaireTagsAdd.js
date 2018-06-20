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
  const handleTagSubmit = async (create, values, initialValues) => {
    const tags = values.get('tagId');

    tags.forEach(async (tag) => {
      if (!initialValues.includes(tag)) {
        const payload = {
          questionnaireId,
          tagId: tag,
        };

        await create(payload);
      }
    });
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
            const initialValues = questionnaireTags.map(tag => tag.tagId);

            const tagsOption = tags.map(tag => ({
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
                  return (
                    <QuestionnaireTagsForm
                      form={`tag-${questionnaireId}`}
                      options={tagsOption}
                      initialValues={{ tagId: initialValues }}
                      onSubmit={(values) => {
                        handleTagSubmit(create, values, initialValues);
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
