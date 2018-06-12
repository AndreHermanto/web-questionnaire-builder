import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { Heading, Fields, Buttons } from 'web-components';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const MAX_FILE_SIZE = 1;
const SUPPORTED_FILE_EXTENSIONS = ['png', 'gif', 'jpg', 'jpeg'];
const ElementStartEndPageForm = ({
  change,
  handleSubmit,
  onCancel,
  type,
  submitting,
  initialValues,
  image,
}) => (
  <Form onSubmit={handleSubmit}>
    <Heading size="h1" style={{ textTransform: 'capitalize' }}>
      {type} page
    </Heading>
    <Fields.Text name="text" required />
    {(!initialValues.get('image') || !image) && (
      <Fields.FileUpload
        label="Image"
        name="image"
        required
        maxFileSize={MAX_FILE_SIZE}
        supportedFileExtensions={SUPPORTED_FILE_EXTENSIONS}
      />
    )}
    {initialValues.get('image') &&
      image && (
      <ImageContainer>
        <Button type="button" negative icon="trash" onClick={() => change('image', null)} />
        <p style={{ color: '#1A531B', marginLeft: 5 }}>
          {image && image.size ? image.get('fileName') : image.fileName}
        </p>
      </ImageContainer>
    )}
    <Buttons
      actions={[
        {
          content: 'Save',
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
  </Form>
);

ElementStartEndPageForm.propTypes = {
  change: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  type: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    image: PropTypes.shape({
      id: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      fileType: PropTypes.string.isRequired,
    }),
  }),
  image: PropTypes.shape({
    id: PropTypes.string,
    fileName: PropTypes.string,
    fileType: PropTypes.string,
  }),
};

ElementStartEndPageForm.defaultProps = {
  type: null,
  initialValues: null,
  image: null,
};
const form = 'element-start-end-page-form';
const selector = formValueSelector(form);

export default connect(state => ({
  type: selector(state, 'type'),
  image: selector(state, 'image'),
}))(
  reduxForm({
    enableReinitialize: true,
    form,
  })(ElementStartEndPageForm),
);
