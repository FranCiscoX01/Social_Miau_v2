import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import TabBar from './TabBar'
import Dashboard from './Dashboard'
import PublicPost from './post/PublicPost'
import UserIndex from './user/UserIndex'

export default class App extends Component {
    render() {
        return (
          <BrowserRouter>
            <div className="container-lx">
              <div className="row">
                <div className="col-lg-4">
                  <TabBar />
                </div>
                <div className="col-lg-8">
                  <Switch>
                    <Route exact path='/' component={Dashboard} />
                    <Route exact path='/post' component={PublicPost} />
                    <Route exact path='/profile' component={UserIndex} />
                  </Switch>
                </div>
              </div>
            </div>
        </BrowserRouter>
        );
    }
}

if (document.getElementById('app-react')) {
    ReactDOM.render(<App />, document.getElementById('app-react'));
}
