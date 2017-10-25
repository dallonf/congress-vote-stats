import React from 'react';

const VotePieChart = ({
  style,
  repYes,
  repNo,
  demYes,
  demNo,
  indYes,
  indNo,
}) => (
  <dl style={{ width: 200, ...style }}>
    <dt>Republican Yes</dt>
    <dd>{repYes}</dd>
    <dt>Republican No</dt>
    <dd>{repNo}</dd>
    <dt>Democrat Yes</dt>
    <dd>{demYes}</dd>
    <dt>Democrat No</dt>
    <dd>{demNo}</dd>
    <dt>Independent Yes</dt>
    <dd>{indYes}</dd>
    <dt>Independent No</dt>
    <dd>{indNo}</dd>
  </dl>
);

export default VotePieChart;
