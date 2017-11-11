import React from 'react';
import moment from 'moment';
import Votes from './Votes';

const START_DATE = '1991-01-01';

class VotePage extends React.Component {
  state = { month: moment().get('month'), year: moment().get('year') };

  render() {
    const { month, year } = this.state;

    console.log(month, year);

    const options = [];
    let cursor = moment().startOf('month');
    while (cursor.isAfter(START_DATE)) {
      options.push({
        month: cursor.get('month'),
        year: cursor.get('year'),
      });
      cursor.subtract(1, 'month');
    }

    const selected = moment({ month, year }).format('YYYY-MM');

    return (
      <div>
        Show votes for:{' '}
        <select
          value={selected}
          onChange={e => {
            const newSelection = e.target.value;
            const selectionMoment = moment(newSelection, 'YYYY-MM');
            this.setState({
              month: selectionMoment.get('month'),
              year: selectionMoment.get('year'),
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
        <Votes month={month + 1} year={year} />
      </div>
    );
  }
}

export default VotePage;
