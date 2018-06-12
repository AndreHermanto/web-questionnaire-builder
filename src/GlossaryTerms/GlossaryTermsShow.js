import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { QueryResource, Buttons, Breadcrumbs, DefinitionList, Helpers } from 'web-components';
import { glossaryTermSchema } from './schemas';

// const renderFamilyontologies
const renderProperty = (propertyName, value) => {
  switch (propertyName) {
    case 'id':
      return null;
    default:
      return {
        label: Helpers.renderLabel(propertyName),
        value: Helpers.renderContent(propertyName, value),
      };
  }
};

class GlossaryTermsShow extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        glossaryTermId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const {
      match: {
        params: { glossaryTermId },
      },
    } = this.props;

    return (
      <div>
        <QueryResource
          queries={[
            {
              resourceName: 'glossaryTerms',
              url: `/glossary-terms/${glossaryTermId}`,
              schema: glossaryTermSchema,
            },
          ]}
          render={({ glossaryTerms }) => {
            const glossaryTerm = glossaryTerms[0];
            return (
              <div>
                <Grid>
                  <Grid.Column width={12}>
                    <Breadcrumbs
                      sections={[
                        { content: 'Glossary terms', to: '/glossary-terms' },
                        {
                          content: `${glossaryTerm.name}`,
                        },
                      ]}
                    />
                    <DefinitionList listData={glossaryTerm} renderProperty={renderProperty} />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Buttons
                      actions={[
                        {
                          content: 'Edit',
                          to: {
                            pathname: `/glossary-terms/${glossaryTermId}/edit`,
                            state: { modal: true },
                          },
                        },
                        {
                          content: 'Delete',
                          to: {
                            pathname: `/glossary-terms/${glossaryTermId}/delete`,
                            state: { modal: true },
                          },
                        },
                      ]}
                    />
                  </Grid.Column>
                </Grid>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

export default GlossaryTermsShow;
