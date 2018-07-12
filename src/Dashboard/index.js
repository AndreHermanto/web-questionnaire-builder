import React from 'react';
import { QueryResource, StatisticsRow, DualGraphDisplay } from 'web-components';
import { Container } from 'semantic-ui-react';
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
  [...stats.responses].map(item => <DualGraphDisplay key={item.title} {...item} />);

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
          <Container>
            {renderNumericStats(stats)}
            {renderGraphs(stats)}
          </Container>
        )}
      </QueryResource>
    );
  }
}

export default Dashboard;
