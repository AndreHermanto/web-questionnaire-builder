import React from 'react';
import PropTypes from 'prop-types';
import { QueryResource, Resource } from 'web-components';
import { versionSchema, questionnaireSchema } from './schemas';
import { elementSchema } from '../Elements/schemas';

class QuestionnaireQueryResource extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    questionnaireId: PropTypes.string.isRequired,
    elementId: PropTypes.string, // eslint-disable-line react/require-default-props
  };
  render() {
    const { questionnaireId, elementId, children } = this.props;
    return (
      <div>
        <QueryResource
          queries={[
            {
              resourceName: 'questionnaires',
              url: `/questionnaires/${questionnaireId}`,
              schema: questionnaireSchema,
              filter: { id: questionnaireId },
            },
          ]}
        >
          {({ questionnaires }) => {
            const questionnaire = questionnaires[0];
            return (
              <QueryResource
                queries={[
                  {
                    resourceName: 'versions',
                    url: `/questionnaires/${questionnaireId}/versions/${
                      questionnaire.currentVersionId
                    }`,
                    schema: versionSchema,
                    filter: {
                      id: questionnaire.currentVersionId,
                    },
                  },
                ]}
              >
                {({ versions }) => {
                  if (elementId) {
                    return (
                      <Resource
                        resources={[
                          {
                            resourceName: 'elements',
                            schema: elementSchema,
                            filter: { id: elementId },
                          },
                        ]}
                        render={({ elements }) =>
                          children({
                            elements,
                            versions,
                            questionnaires,
                          })
                        }
                      />
                    );
                  }
                  return children({ versions, questionnaires });
                }}
              </QueryResource>
            );
          }}
        </QueryResource>
      </div>
    );
  }
}

export default QuestionnaireQueryResource;
