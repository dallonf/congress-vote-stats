import React from 'react';
import styled from 'styled-components';
import { getPartisanRatingForVote } from '../../math/partisanVote';

const AggregateStatsWrapper = styled.div`
  display: grid;
  grid-template-areas: 'summary' 'details';

  @media screen and (min-width: 700px) {
    grid-template-areas: 'summary details';
  }
`;

const AggregateStatsSummary = styled.div`
  grid-area: 'summary';
  margin-bottom: 4px;

  @media screen and (min-width: 700px) {
    margin-bottom: 0;
    margin-right: 8px;
  }
`;

const AggregateStatsDetails = styled.div`
  grid-area: 'details';
`;

const avg = list =>
  list.length
    ? list.reduce((prev, x) => prev + x.score, 0) / list.length
    : 'N/A';

const AggregateStats = ({ votes, ...props }) => {
  const stats = votes.map(v => ({
    chamber: v.chamber,
    score: getPartisanRatingForVote(v).value,
  }));
  const overall = avg(stats);
  const house = avg(stats.filter(x => x.chamber === 'House'));
  const senate = avg(stats.filter(x => x.chamber === 'Senate'));
  return (
    <AggregateStatsWrapper {...props}>
      <AggregateStatsSummary>
        <strong style={{ marginRight: 4 }}>Average Partisanship:</strong>
        <span>{overall.toLocaleString(undefined, { style: 'percent' })}</span>
      </AggregateStatsSummary>
      <AggregateStatsDetails>
        <span style={{ marginRight: 4 }}>House:</span>
        <span style={{ marginRight: 8 }}>
          {house.toLocaleString(undefined, { style: 'percent' })}
        </span>
        <span style={{ marginRight: 4 }}>Senate:</span>
        <span>{senate.toLocaleString(undefined, { style: 'percent' })}</span>
      </AggregateStatsDetails>
    </AggregateStatsWrapper>
  );
};

export default AggregateStats;
