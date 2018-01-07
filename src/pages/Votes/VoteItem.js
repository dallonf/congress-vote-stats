import React from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import PieChart from './PieChart';
import { getPartisanRatingForVote } from '../../math/partisanVote';

const VoteItemContainer = styled.div`
  padding: 32px 16px;
  display: grid;
  grid-template-areas: 'header' 'chart' 'body';
  border-bottom: 1px #ccc solid;

  @media screen and (min-width: 700px) {
    border-bottom: none;
    grid-template-columns: 150px 16px 1fr;
    grid-template-areas: 'chart . header' 'chart . body' '. . body';
  }
`;

const ChartContainer = styled.div`
  grid-area: chart;
  justify-self: center;
  align-self: center;
  text-align: center;
  margin-bottom: 1em;

  @media screen and (min-width: 700px) {
    margin-bottom: 0;
  }
`;

const RatingContainer = styled.div`
  margin-top: 0.25em;
`;

const HeaderContainer = styled.div`
  grid-area: header;
  margin-bottom: 1em;
  max-width: 800px;
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

const BillHeader = styled.div``;

const VoteDescription = styled.div`
  margin-bottom: 0.25em;
`;
const VoteResult = styled.div``;
const VoteQuestion = styled.abbr`
  text-decoration: none;
  border-bottom: black 1px dotted;
`;

const formatPercent = num =>
  num.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 1 });

const VoteItem = ({ vote }) => {
  const passed =
    vote.result !== 'Failed' &&
    vote.result.indexOf('Rejected') === -1 &&
    vote.result !== 'Point of Order Not Well Taken';
  const rating = getPartisanRatingForVote(vote);
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
    default:
      break;
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

  const formattedVoteTime = voteTime.format('l LT z');
  const glanceVoteTime = voteTime.isAfter(moment().subtract(1, 'month'))
    ? voteTime.fromNow()
    : voteTime.format('MMMM D');

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
        <RatingContainer>{ratingView}</RatingContainer>
      </ChartContainer>
      <HeaderContainer>
        <MetaHeader>
          {vote.chamber} -{' '}
          <span title={formattedVoteTime}>{glanceVoteTime}</span>
        </MetaHeader>
        {header}
      </HeaderContainer>
      <BodyContainer>{body}</BodyContainer>
    </VoteItemContainer>
  );
};

export default VoteItem;
