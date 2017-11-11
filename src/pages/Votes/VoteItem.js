import React from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import PieChart from './PieChart';
import { PARTY_COLORS } from '../../styles';
import { getPartisanRating } from '../../math/partisanVote';

const VoteItemContainer = styled.div`
  padding: 16px;
  border-bottom: #ccc 1px solid;
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

const BodyContainer = styled.div`
  grid-area: body;
  max-width: 800px;
`;

const MetaHeader = styled.div`
  text-transform: uppercase;
  color: #999999;
  font-size: 0.75em;
  margin-bottom: 0.25em;
`;

const BillHeader = styled.div`margin-bottom: 1em;`;

const VoteDescription = styled.div`margin-bottom: 0.25em;`;
const VoteResult = styled.div``;
const VoteQuestion = styled.abbr`
  text-decoration: none;
  border-bottom: black 1px dotted;
`;

const formatPercent = num =>
  num.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 1 });

const VoteItem = ({ vote }) => {
  const passed = vote.result !== 'Failed' && vote.result !== 'Rejected';
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
    ratingView = passed ? 'Bipartisan' : 'Non-partisan';
  }

  const voteTime = moment.tz(`${vote.date} ${vote.time}`, 'America/New_York');

  let header = null;
  let body = null;
  if (vote.bill && vote.bill.title) {
    header = (
      <BillHeader>
        {vote.bill.number} - {vote.bill.title}
      </BillHeader>
    );
  }

  let questionDescription = null;
  switch (vote.question) {
    case 'On Approving the Journal':
      questionDescription =
        "This vote really doesn't matter. Congresspeople " +
        'will often use it to skew their own statistics of voting with/against the party. ' +
        'I may filter these out in the future.';
      break;
    case 'On the Cloture Motion':
      questionDescription =
        'A motion to limit debate to 30 additional hours. Usually ' +
        'intended to block a filibuster.';
      break;
    case 'On Motion to Recommit with Instructions':
      questionDescription =
        'This vote, taken just before the final ' +
        'vote on a bill, gives the House (usually the minority party) one last chance ' +
        'to amend the bill.';
      break;
    // - (Recommit without Instructions? Haven't seen this): This vote, taken just before
    // the final vote on the bill, gives the House (usually the minority party) one last
    // chance to send the bill back for further debate and consideration.
  }

  body = (
    <div>
      {vote.description && (
        <VoteDescription>{vote.description}</VoteDescription>
      )}
      <VoteResult>
        {questionDescription ? (
          <VoteQuestion title={questionDescription}>
            {vote.question}
          </VoteQuestion>
        ) : (
          vote.question
        )}{' '}
        - <strong>{vote.result}</strong>
        <i
          className={`fa fa-${passed ? 'check' : 'times'}`}
          style={{ marginLeft: '0.25em' }}
        />
      </VoteResult>
    </div>
  );

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
      <BodyContainer>
        <MetaHeader>
          {vote.chamber} -{' '}
          <span title={voteTime.format('l LT z')}>{voteTime.fromNow()}</span>
        </MetaHeader>
        {header}
        {body}
      </BodyContainer>
    </VoteItemContainer>
  );
};

export default VoteItem;
