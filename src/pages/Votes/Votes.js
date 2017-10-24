import React from 'react';
import request from 'request-promise';

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
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    } else if (error) {
      return <div style={{ color: 'red' }}>Error!</div>;
    } else {
      return 'Loading...';
    }
  }
}

export default VotesController;
