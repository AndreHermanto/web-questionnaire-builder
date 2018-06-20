import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

let TagsForm = ({ handleSubmit, onCancel, submitting, options, tagOptions }) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1">Add Tags</Heading>
    <Fields.Radio
      name="tagOptions"
      label="Tag options"
      options={[
        { key: 'new', text: 'new tag', value: 'new' },
        { key: 'current', text: 'current tag', value: 'current' },
      ]}
    />
    {tagOptions === 'current' && (
      <Fields.Select name="tagId" label="Tags" options={options} multiple />
    )}
    {tagOptions === 'new' && <Fields.Text name="tag" label="tag" />}
    <div>
      <Buttons
        actions={[
          {
            content: 'Add Tags',
            type: 'submit',
            disabled: submitting,
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
  ).isRequired,
  tagOptions: PropTypes.string.isRequired,
};

TagsForm = connect((state, props) => {
  const selector = formValueSelector(props.form);
  const tagOptions = selector(state, 'tagOptions');
  const tagId = selector(state, 'tagId');
  return {
    tagOptions,
    tagId,
  };
})(TagsForm);

export default reduxForm({
  enableReinitialize: true,
})(TagsForm);
