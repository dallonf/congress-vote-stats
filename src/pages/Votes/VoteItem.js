import React from 'react';
import styled from 'styled-components';
import PieChart from './PieChart';
import { getPartisanRating } from '../../math/partisanVote';

const VoteItemContainer = styled.div`
  margin: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'chart body' 'rating body';
`;

const formatPercent = num =>
  num.toLocaleString(undefined, { style: 'percent' });

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
    ratingView = vote.result === 'Passed' ? 'Bipartisan' : 'Non-partisan';
  }
  return (
    <VoteItemContainer>
      <PieChart
        style={{ gridArea: 'chart' }}
        repYes={vote.republican.yes}
        repNo={vote.republican.no}
        demYes={vote.democratic.yes}
        demNo={vote.democratic.no}
        indYes={vote.independent.yes}
        indNo={vote.independent.no}
      />
      <div style={{ gridArea: 'rating' }}>{ratingView}</div>
      <div style={{ gridArea: 'body' }}>
        {(vote.bill && vote.bill.title) || vote.question}
      </div>
    </VoteItemContainer>
  );
};

export default VoteItem;
