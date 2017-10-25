import React from 'react';
import Color from 'color';
import * as d3 from 'd3';

const SIZE = 100;

const COLORS = {
  R: '#ff0000',
  D: '#0000ff',
  I: '#ffff00',
};

const fillForParty = (party, vote) => {
  const partyColor = COLORS[party];
  if (vote) {
    return partyColor;
  } else {
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
    { party: 'D', vote: true, value: demYes },
    { party: 'D', vote: false, value: demNo },
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
            strokeWidth={2}
            stroke="white"
          />
        ))}
      </g>
    </svg>
  );
};

export default VotePieChart;
