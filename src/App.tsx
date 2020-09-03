import React from 'react';
import { Layout, Home, Devices } from '@/pages';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path='/' exact component={Home}/>
          <Route path='/devices' component={Devices} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
