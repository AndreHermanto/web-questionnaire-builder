import React from 'react';
import PropTypes from 'prop-types';
import QuestionnaireQueryResource from '../Questionnaires/QuestionnaireQueryResource';
import ElementsShowStartEndPage from './ElementsShowStartEndPage';
import ElementsShowQuestionPage from './ElementsShowQuestionPage';

const renderPageByType = (type, pageProps) => {
  switch (type) {
    case 'start':
    case 'end':
      return <ElementsShowStartEndPage {...pageProps} />;
    default:
      return <ElementsShowQuestionPage {...pageProps} />;
  }
};
class ElementsShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        elementId: PropTypes.string.isRequired,
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  render() {
    const {
      match: {
        params: { elementId, questionnaireId },
      },
    } = this.props;

    return (
      <QuestionnaireQueryResource questionnaireId={questionnaireId} elementId={elementId}>
        {({ questionnaires, elements }) => {
          if (!elements.length) {
            return <div>No Elements</div>;
          }
          const element = elements[0];
          const pageProps = {
            questionnaire: questionnaires[0],
            questionnaireId,
            elementId,
            element,
          };
          return renderPageByType(element.type, pageProps);
        }}
      </QuestionnaireQueryResource>
    );
  }
}

export default ElementsShow;
