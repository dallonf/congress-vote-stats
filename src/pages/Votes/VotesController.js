import React from 'react';
import request from 'request-promise';
import padStart from 'pad-start';

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
    const { render } = this.props;
    const { data, error, loading } = this.state;
    return render({ data, error, loading });
  }
}

export default VotesController;
