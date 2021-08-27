import React from 'react';
import './styles/main.scss';
import CoinList from './components/CoinList/CoinList';
import Menu from './components/Menu/Menu';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CoinDashboard from './components/CoinDashboard/CoinDashboard';

function App() {


  return (
    <div className="app">
      <BrowserRouter>
        <Menu />
        <Switch>
          <Route exact path="/">
            <CoinList />
          </Route>
          <Route path="/:symbol">
            <CoinDashboard />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

