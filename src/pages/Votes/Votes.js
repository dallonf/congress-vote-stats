import React from 'react';
import styled from 'styled-components';
import request from 'request-promise';
import PieChart from './PieChart';

const apiKey = process.env.REACT_APP_PROPUBLICA_API_KEY;
if (!apiKey)
  console.error(
    'Required environment variable "REACT_APP_PROPUBLICA_API_KEY" is missing!'
  );

class VotesController extends React.Component {
  state = { data: null, error: null };

  componentDidMount() {
    const req = request
      .get('https://api.propublica.org/congress/v1/both/votes/recent.json', {
        headers: { 'X-API-Key': apiKey },
        json: true,
      })
      .then(data => this.setState({ data }), error => this.setState({ error }));
    this.reqInProgress = req;
  }

  componentWillUnmount() {
    if (this.reqInProgress) {
      this.reqInProgress.cancel();
    }
  }

  render() {
    const { data, error } = this.state;
    if (data) {
      return <VotesView data={data} />;
    } else if (error) {
      return <div style={{ color: 'red' }}>Error!</div>;
    } else {
      return 'Loading...';
    }
  }
}

const VoteItemContainer = styled.div`
  margin: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'chart body';
`;

const VotesView = ({ data }) =>
  console.log(data) ||
  data.results.votes.map(v => (
    <VoteItemContainer key={v.vote_uri}>
      <PieChart
        style={{ gridArea: 'chart' }}
        repYes={v.republican.yes}
        repNo={v.republican.no}
        demYes={v.democratic.yes}
        demNo={v.democratic.no}
        indYes={v.independent.yes}
        indNo={v.independent.no}
      />
      <div style={{ gridArea: 'body' }}>
        {(v.bill && v.bill.title) || v.question}
      </div>
    </VoteItemContainer>
  ));

export default VotesController;
