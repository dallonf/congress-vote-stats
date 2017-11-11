import React from 'react';
import styled from 'styled-components';
import request from 'request-promise';
import padStart from 'pad-start';
import VoteItem from './VoteItem';

const LoadingWrapper = styled.div`
  opacity: ${props => (props.loading ? '0.6' : '1')};
`;

const LoadingView = styled.div`
  padding: 16px;
  font-size: 2em;
  text-align: center;
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

const apiKey = process.env.REACT_APP_PROPUBLICA_API_KEY;
if (!apiKey)
  console.error(
    'Required environment variable "REACT_APP_PROPUBLICA_API_KEY" is missing!'
  );

class VotesController extends React.Component {
  state = { data: null, error: null };

  componentDidMount() {
    this.fetch();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.month !== this.props.month ||
      nextProps.year !== this.props.year
    ) {
      this.fetch(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.reqInProgress) {
      this.reqInProgress.cancel();
    }
  }

  fetch(props = this.props) {
    if (this.reqInProgress) {
      this.reqInProgress.cancel();
    }
    this.setState({ loading: true });
    const { month, year } = props;
    const req = request
      .get(
        `https://api.propublica.org/congress/v1/both/votes/${year}/${padStart(
          month,
          2,
          '0'
        )}.json`,
        {
          headers: { 'X-API-Key': apiKey },
          json: true,
        }
      )
      .then(data => {
        // ProPublica returns 200 OK with an error status code in the body.
        if (data.status !== 'OK') {
          throw Object.assign(new Error(data.error || 'Could not get votes'), {
            response: data,
          });
        } else {
          return data;
        }
      })
      .then(
        data => this.setState({ data, error: null, loading: false }),
        error => this.setState({ data: null, error, loading: false })
      );
    this.reqInProgress = req;
  }

  render() {
    const { data, error, loading } = this.state;
    if (error) {
      return (
        <LoadingWrapper loading={loading}>
          <Error>
            <ErrorHeading>Error</ErrorHeading>
            {error.response ? (
              <p>
                Some months have bad data, unfortunately. Try another month.
              </p>
            ) : (
              <p>
                Couldn't load votes.{' '}
                <a
                  href="#"
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
    } else if (data) {
      return (
        <LoadingWrapper loading={loading}>
          <VotesView data={data} />
        </LoadingWrapper>
      );
    } else {
      return <LoadingView>Loading...</LoadingView>;
    }
  }
}

const VotesView = ({ data }) =>
  data.results.votes.map(v => <VoteItem key={v.vote_uri} vote={v} />);

export default VotesController;
