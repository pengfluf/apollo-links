import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NavBar from '../NavBar';
import LinkList from '../LinkList';
import Login from '../Login';
import CreateLink from '../CreateLink';

function App() {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/" component={LinkList} />
        <Route path="/login" component={Login} />
        <Route path="/create" component={CreateLink} />
      </Switch>
    </div>
  );
}

export default App;
