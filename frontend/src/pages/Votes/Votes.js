import React from 'react';
import styled from 'styled-components';
import VoteItem from './VoteItem';

const LoadingWrapper = styled.div`
  opacity: ${props => (props.loading ? '0.6' : '1')};
`;

const LoadingView = styled.div`
  padding: 16px;
  font-size: 2em;
  text-align: center;
`;

const EmptyView = styled.div`
  padding: 16px;
  margin-top: 16px;
  font-size: 1.5em;
  text-align: center;
  color: #cccccc;
`;

const Error = styled.div`
  padding: 16px;
  text-align: left;
`;

const ErrorHeading = styled.h2`
  line-height: 1;
  margin-top: 0;
  font-size: 2em;
  color: orange;
`;

const VotesView = ({ data, loading, error }) => {
  if (error) {
    return (
      <LoadingWrapper loading={loading}>
        <Error>
          <ErrorHeading>Error</ErrorHeading>
          {error.response ? (
            <p>Some months have bad data, unfortunately. Try another month.</p>
          ) : (
            <p>
              Couldn't load votes.{' '}
              <a
                href={window.location.href}
                onClick={e => {
                  e.preventDefault();
                  this.fetch();
                }}
              >
                Try again
              </a>
            </p>
          )}
        </Error>
      </LoadingWrapper>
    );
  } else if (data && (!loading || data.results.votes.length)) {
    // special case: fall back to "loading" view if we are loading and there are no votes to display
    return (
      <LoadingWrapper loading={loading}>
        {!data.results.votes.length && (
          <EmptyView>There isn't any data for this month.</EmptyView>
        )}
        {data.results.votes.map(v => <VoteItem key={v.vote_uri} vote={v} />)}
      </LoadingWrapper>
    );
  } else {
    return <LoadingView>Loading...</LoadingView>;
  }
};

export default VotesView;
