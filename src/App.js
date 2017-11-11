import React, { Component } from 'react';
import VotesPage from './pages/Votes/VotesPage';
import { SvgPatterns } from './styles';

class App extends Component {
  render() {
    return [<VotesPage key={1} />, <SvgPatterns key={2} />];
  }
}

export default App;
