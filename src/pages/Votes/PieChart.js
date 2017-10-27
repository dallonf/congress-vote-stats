import React from 'react';
import * as d3 from 'd3';
import Color from 'color';
import { PARTY_COLORS, NO_VOTE_PATTERNS } from '../../styles';

const SIZE = 100;

const fillForParty = (party, vote) => {
  const partyColor = PARTY_COLORS[party];
  if (vote) {
    return partyColor;
  } else {
    return NO_VOTE_PATTERNS[party].url();
    return Color(partyColor)
      .darken(0.5)
      .hex();
  }
};

const VotePieChart = ({
  style,
  repYes,
  repNo,
  demYes,
  demNo,
  indYes,
  indNo,
}) => {
  const data = [
    { party: 'R', vote: true, value: repYes },
    { party: 'R', vote: false, value: repNo },
    { party: 'D', vote: false, value: demNo },
    { party: 'D', vote: true, value: demYes },
    { party: 'I', vote: true, value: indYes },
    { party: 'I', vote: false, value: indNo },
  ];
  const pieGen = d3
    .pie()
    .sort(null)
    .value(d => d.value);
  const arcGen = d3
    .arc()
    .outerRadius(SIZE * 0.45)
    .innerRadius(0);
  const pieData = pieGen(data.filter(d => d.value));
  return (
    <svg width={SIZE} height={SIZE} style={style}>
      <g transform={`translate(${SIZE / 2}, ${SIZE / 2})`}>
        {pieData.map(d => (
          <path
            key={d.index}
            fill={fillForParty(d.data.party, d.data.vote)}
            d={arcGen(d)}
            strokeWidth={1}
            stroke="white"
          />
        ))}
      </g>
    </svg>
  );
};

export default VotePieChart;
