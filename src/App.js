import React, { Component } from 'react';
import Explanation from './Explanation';
import VotesPage from './pages/Votes/VotesPage';
import { SvgPatterns } from './styles';

class App extends Component {
  render() {
    return [
      <Explanation key={0} />,
      <VotesPage key={1} />,
      <SvgPatterns key={2} />,
    ];
  }
}

export default App;
