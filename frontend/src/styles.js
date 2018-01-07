import React from 'react';
import lines from 'svg-patterns/p/lines';
import mapValues from 'lodash/mapValues';
import Color from 'color';
import stringify from 'virtual-dom-stringify';

export const PARTY_COLORS = {
  R: '#ff2222',
  D: '#0077ff',
  I: '#ffff00',
};

export const NO_VOTE_PATTERNS = mapValues(PARTY_COLORS, c =>
  lines({
    background: Color(c)
      .darken(0.5)
      .hex(),
    stroke: Color(c)
      .lighten(0)
      .hex(),
    strokeWidth: 1,
  })
);

export const SvgPatterns = () => (
  <svg style={{ width: 0, height: 0, position: 'absolute' }}>
    <defs
      dangerouslySetInnerHTML={{
        __html: Object.keys(NO_VOTE_PATTERNS)
          .map(k => stringify(NO_VOTE_PATTERNS[k]))
          .join(''),
      }}
    />
  </svg>
);
