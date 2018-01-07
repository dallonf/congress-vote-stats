import React from 'react';
import { getPartisanRatingForVote } from '../../math/partisanVote';

const avg = list =>
  list.length
    ? list.reduce((prev, x) => prev + x.score, 0) / list.length
    : 'N/A';

const AggregateStats = ({ votes }) => {
  const stats = votes.map(v => ({
    chamber: v.chamber,
    score: getPartisanRatingForVote(v).value,
  }));
  const overall = avg(stats);
  const house = avg(stats.filter(x => x.chamber === 'House'));
  const senate = avg(stats.filter(x => x.chamber === 'Senate'));
  return (
    <span>
      <strong style={{ marginRight: 4 }}>Average Partisanship:</strong>
      <span style={{ marginRight: 8 }}>
        {overall.toLocaleString(undefined, { style: 'percent' })}
      </span>
      <span style={{ marginRight: 4 }}>House:</span>
      <span style={{ marginRight: 8 }}>
        {house.toLocaleString(undefined, { style: 'percent' })}
      </span>
      <span style={{ marginRight: 4 }}>Senate:</span>
      <span>{senate.toLocaleString(undefined, { style: 'percent' })}</span>
    </span>
  );
};

export default AggregateStats;
