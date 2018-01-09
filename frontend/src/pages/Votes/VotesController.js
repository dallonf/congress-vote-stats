import React from 'react';
import request from 'request-promise';

const apiBase = process.env.REACT_APP_API;
if (!apiBase)
  console.error('Required environment variable "REACT_APP_API" is missing!');

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
      .get(`${apiBase}/year/${year}/month/${month}`, {
        json: true,
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
