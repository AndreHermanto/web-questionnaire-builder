import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, QueryResource } from 'web-components';
import QuestionnaireTagsForm from './QuestionnaireTagsForm';
import { questionnaireTagSchema, questionnaireTagsSchema } from './schemas';
import { tagsSchema } from '../Tags/schemas';

const QuestionnaireTagsEdit = (props) => {
  const {
    closePanel,
    match: {
      params: { questionnaireId, currentVersionId },
    },
  } = props;
  const handleTagSubmit = async (create, values, initialValues) => {
    const tagIds = values.get('tagId');
    tagIds.forEach(async (tag) => {
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
    <QueryResource
      queries={[
        {
          resourceName: 'questionnaireTags',
          url: `/questionnaire-tags?questionnaireId=${questionnaireId}`,
          schema: questionnaireTagsSchema,
          filter: { questionnaireId },
        },
        {
          resourceName: 'tags',
          url: '/tags',
          schema: tagsSchema,
        },
      ]}
    >
      {({ questionnaireTags, tags }) => {
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
            render={({ create, loading: updateLoadingQuestionnaireTags }) => {
              if (updateLoadingQuestionnaireTags) {
                return <div>loading...</div>;
              }
              return (
                <QuestionnaireTagsForm
                  form={`tag-${questionnaireId}`}
                  options={tagsOption}
                  initialValues={{
                    tagId: initialValues || [],
                  }}
                  onSubmit={(values) => {
                    handleTagSubmit(create, values, initialValues);
                  }}
                  questionnaireId={questionnaireId}
                  currentVersionId={currentVersionId}
                  onCancel={closePanel}
                />
              );
            }}
          />
        );
      }}
    </QueryResource>
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
