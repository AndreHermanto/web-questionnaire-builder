import React from 'react';
import { QueryResource, StatisticsRow, DualGraphDisplay, Buttons } from 'web-components';
import { Grid } from 'semantic-ui-react';
import statSchema from './schemas';

const renderNumericStats = (stats) => {
  const numericStats = [
    { label: 'Number Of Questionnaires', value: stats.numberOfQuestionnaires },
    { label: 'Number Of Responses Completed', value: stats.numberOfResponsesCompleted },
    { label: 'Number Of Responses Open', value: stats.numberOfResponsesOpen },
    { label: 'Number Of Releases', value: stats.numberOfReleases },
  ];
  return <StatisticsRow items={numericStats} />;
};

const renderGraphs = stats =>
  [...stats.responses].map(item => <DualGraphDisplay color="#143963" key={item.title} {...item} />);

class Dashboard extends React.Component {
  render() {
    return (
      <QueryResource
        queries={[
          {
            resourceName: 'stats',
            url: '/stats',
            schema: statSchema,
            one: true,
            name: 'stats',
          },
        ]}
      >
        {({ stats }) => (
          <Grid>
            <Grid.Column width={12}>
              {renderNumericStats(stats)}
              {renderGraphs(stats)}
            </Grid.Column>
            <Grid.Column width={4}>
              <Buttons
                actions={[
                  {
                    content: 'Download',
                    href: `${process.env.REACT_APP_BASE_URL}/download-stats`,
                  },
                ]}
              />
            </Grid.Column>
          </Grid>
        )}
      </QueryResource>
    );
  }
}

export default Dashboard;
