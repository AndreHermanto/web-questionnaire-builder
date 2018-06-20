import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const TagsForm = ({
  handleSubmit,
  onCancel,
  submitting,
  options,
  questionnaireId,
  currentVersionId,
}) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Add Tags</Heading>
    <Fields.Select name="tagId" label="Tags" options={options} multiple />
    <div>
      <Buttons
        actions={[
          {
            content: 'Add Tags to Questionnaire',
            type: 'submit',
            disabled: submitting,
          },
          {
            content: 'Add new tag',
            to: `/questionnaires/${questionnaireId}/versions/${currentVersionId}/addNewTag`,
          },
          {
            content: 'Cancel',
            onClick: onCancel,
            type: 'button',
          },
        ]}
      />
    </div>
  </Form>
);
TagsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      text: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  questionnaireId: PropTypes.string.isRequired,
  currentVersionId: PropTypes.string.isRequired,
};
TagsForm.defaultProps = {
  initialValues: undefined,
  options: undefined,
};

export default reduxForm({
  enableReinitialize: true,
})(TagsForm);
