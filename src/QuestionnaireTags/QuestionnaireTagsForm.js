import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm } from 'redux-form/immutable';

const TagsForm = ({ handleSubmit, onCancel, submitting, options, questionnaireId }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Add Tags</Heading>
    <Heading size="h3">
      If desired tag does not exist, please{' '}
      <Link
        to={{
          pathname: '/tags/create',
          state: { modal: true },
        }}
      >
        create a new tag
      </Link>{' '}
      first
    </Heading>
    <Fields.Select name="tagId" label="Tags" options={options} />
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
            to: `/questionnaires/${questionnaireId}/addNewTag`,
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
};
TagsForm.defaultProps = {
  options: undefined,
};

export default reduxForm({
  enableReinitialize: true,
})(TagsForm);
