import * as React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import { Provider } from 'react-redux';

import Home from './Home';
import Complex from './Complex';
import Profile from './Profile';
import ListView from './list/ListView';
import XMyNavLink from './XMyNavLink';

import { createStore } from 'redux'
import AppReducer from './reducers';



const MyNavLink = withRouter(XMyNavLink);

const store = createStore(AppReducer)

class App extends React.Component {
  public render() {
    return (
        <Provider store={store}>
            <Router>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <NavLink activeClassName="active" className="navbar-brand" to="/" >React.js Sample</NavLink>
                        <ul className="navbar-nav mr-auto">
                            <MyNavLink to='/profile'>Profile</MyNavLink>
                            <MyNavLink to='/list'>List</MyNavLink>
                            <MyNavLink to='/complex'>Complex</MyNavLink>
                        </ul>
                    </nav>
                    <div className="container-fluid">
                        <Route exact={true} path="/" component={Home} />
                        <Route path="/list" component={ListView}/>
                        <Route path="/complex" component={Complex} />
                        <Route path="/profile" component={Profile} />
                    </div>
                </div>
            </Router>
        </Provider>
    );
  }
}



export default App;
