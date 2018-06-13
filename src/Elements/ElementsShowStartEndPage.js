import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { Buttons, Heading, Breadcrumbs, DefinitionList, Helpers } from 'web-components';

const renderProperty = (propertyName, value, element) => {
  switch (propertyName) {
    case 'id':
    case 'color':
    case 'buttonText':
    case 'fontSize':
    case 'isBold':
    case 'isColor':
    case 'isItalic':
      return null;
    case 'text': {
      return {
        label: 'Text',
        value: <Markdown source={value} escapeHtml skipHtml />,
      };
    }
    case 'image': {
      return {
        label: 'Image',
        value: value.fileName,
      };
    }
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value, element),
      };
  }
};

class ElementsShowStartEndPage extends React.Component {
  static propTypes = {
    element: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    questionnaireId: PropTypes.string.isRequired,
    elementId: PropTypes.string.isRequired,
    questionnaire: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  };
  render() {
    const { questionnaireId, questionnaire, element, elementId } = this.props;

    return (
      <div>
        <Breadcrumbs
          sections={[
            { content: 'Questionnaires', to: '/questionnaires' },
            {
              content: questionnaire.currentTitle,
              to: `/questionnaires/${questionnaireId}`,
            },
            { content: element.text },
          ]}
        />
        <Heading size="h1">{element.text}</Heading>
        <Grid>
          <Grid.Column width={12}>
            <DefinitionList listData={element} renderProperty={renderProperty} />
          </Grid.Column>
          <Grid.Column width={4}>
            <Buttons
              actions={[
                {
                  content: 'Edit',
                  to: {
                    pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/edit/${
                      element.type
                    }`,
                    state: { modal: true },
                  },
                },
                {
                  content: 'Delete',
                  to: {
                    pathname: `/questionnaires/${questionnaireId}/elements/${elementId}/delete`,
                    state: { modal: true },
                  },
                },
              ]}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default ElementsShowStartEndPage;
