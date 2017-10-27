import React, { Component } from 'react';
import VotesPage from './pages/Votes/Votes';
import { SvgPatterns } from './styles';

class App extends Component {
  render() {
    return [<VotesPage key={0} />, <SvgPatterns key={1} />];
  }
}

export default App;
