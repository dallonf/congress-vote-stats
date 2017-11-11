import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import qs from 'query-string';
import { withRouter } from 'react-router';
import Votes from './Votes';

const START_DATE = '1991-01-01';

const OptionHeader = styled.div`
  position: sticky;
  top: 0;
  padding: 16px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

class VotePage extends React.Component {
  // state = { month: moment().get('month'), year: moment().get('year') };

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
      <div>
        <OptionHeader>
          Show votes for:{' '}
          <select
            value={selected}
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
        </OptionHeader>
        <div>
          <Votes month={month + 1} year={year} />
        </div>
      </div>
    );
  }
}

export default withRouter(VotePage);
