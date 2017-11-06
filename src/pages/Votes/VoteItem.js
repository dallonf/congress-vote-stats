import React from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import PieChart from './PieChart';
import { getPartisanRating } from '../../math/partisanVote';

const VoteItemContainer = styled.div`
  margin: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-columns: 150px 16px 1fr;
  grid-template-areas: 'chart . body' 'rating . body' '. . body';
`;

const ChartContainer = styled.div`
  grid-area: chart;
  justify-self: center;
  align-self: center;
`;

const RatingContainer = styled.div`
  grid-area: rating;
  justify-self: center;
  align-self: start;
  margin-top: 0.25em;
`;

const formatPercent = num =>
  num.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 1 });

const VoteItem = ({ vote }) => {
  const rating = getPartisanRating({
    repYes: vote.republican.yes,
    repNo: vote.republican.no,
    demYes: vote.democratic.yes,
    demNo: vote.democratic.no,
  });
  let ratingView;
  if (rating.party === 'R') {
    ratingView = `${formatPercent(rating.value)} Republican`;
  } else if (rating.party === 'D') {
    ratingView = `${formatPercent(rating.value)} Democratic`;
  } else {
    ratingView = vote.result === 'Failed' ? 'Non-partisan' : 'Bipartisan';
  }

  const voteTime = moment.tz(`${vote.date} ${vote.time}`, 'America/New_York');

  let header = null;
  let body = null;
  if (vote.bill) {
    header = (
      <div>
        <div>
          {vote.bill.number} {vote.bill.title}
        </div>
        <div>{vote.description}</div>
      </div>
    );
    body = (
      <div>
        {vote.question} - {vote.result}
      </div>
    );
  } else {
    body = <pre>{JSON.stringify(vote, null, 2)}</pre>;
  }

  return (
    <VoteItemContainer>
      <ChartContainer>
        <PieChart
          style={{ gridArea: 'chart' }}
          repYes={vote.republican.yes}
          repNo={vote.republican.no}
          demYes={vote.democratic.yes}
          demNo={vote.democratic.no}
          indYes={vote.independent.yes}
          indNo={vote.independent.no}
        />
      </ChartContainer>
      <RatingContainer>{ratingView}</RatingContainer>
      <div style={{ gridArea: 'body' }}>
        <div>
          {vote.chamber} -{' '}
          <span title={voteTime.format('l LT z')}>{voteTime.fromNow()}</span>
        </div>
        {header}
        {body}
      </div>
    </VoteItemContainer>
  );
};

export default VoteItem;
