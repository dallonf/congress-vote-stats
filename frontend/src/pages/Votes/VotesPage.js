import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import qs from 'query-string';
import { withRouter } from 'react-router';
import Votes from './Votes';
import VotesController from './VotesController';
import AggregateStats from './AggregateStats';

const START_DATE = '1991-01-01';

const OptionHeader = styled.div`
  position: sticky;
  top: 0;
  padding: 16px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: flex;
  flex-flow: column nowrap;

  @media screen and (min-width: 700px) {
    flex-flow: row nowrap;
  }
`;

const Spacer = styled.div`
  @media screen and (min-width: 700px) {
    flex: 1;
  }
`;

class VotePage extends React.Component {
  render() {
    const { location, history } = this.props;
    const params = qs.parse(location.search);
    let month = parseInt(params.month, 10) - 1;
    if (typeof month !== 'number' || Number.isNaN(month)) {
      month = moment().get('month');
    }
    let year = parseInt(params.year, 10);
    if (typeof year !== 'number' || Number.isNaN(year)) {
      year = moment().get('year');
    }

    const options = [];
    let cursor = moment().startOf('month');
    while (cursor.isSameOrAfter(START_DATE)) {
      options.push({
        month: cursor.get('month'),
        year: cursor.get('year'),
      });
      cursor.subtract(1, 'month');
    }

    const selected = moment({ month, year }).format('YYYY-MM');

    return (
      <VotesController
        month={month + 1}
        year={year}
        render={({ loading, data, error, refetch }) => (
          <div>
            <OptionHeader>
              <span style={{ margin: 4 }}>Show votes for: </span>
              <select
                value={selected}
                style={{ margin: 4 }}
                onChange={e => {
                  const newSelection = e.target.value;
                  const selectionMoment = moment(newSelection, 'YYYY-MM');
                  history.push({
                    ...location,
                    search: qs.stringify({
                      month: selectionMoment.get('month') + 1,
                      year: selectionMoment.get('year'),
                    }),
                  });
                }}
              >
                {options.map(o => {
                  const monthMoment = moment({ month: o.month, year: o.year });
                  const value = monthMoment.format('YYYY-MM');
                  return (
                    <option value={value} key={value}>
                      {monthMoment.format('MMMM YYYY')}
                    </option>
                  );
                })}
              </select>
              <Spacer />
              {data && (
                <AggregateStats
                  style={{ margin: 4 }}
                  votes={data.results.votes}
                />
              )}
            </OptionHeader>
            <div>
              <Votes
                loading={loading}
                data={data}
                error={error}
                refetch={refetch}
              />
            </div>
          </div>
        )}
      />
    );
  }
}

export default withRouter(VotePage);
