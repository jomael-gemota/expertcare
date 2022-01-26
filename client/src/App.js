import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import './css/bootstrap.min.css';
import './css/bootstrap.min.css.map';

import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={Login} />
					<Route exact path='/reset-password' component={ResetPassword} />
					<Route exact path='/register' component={Register} />
					<PrivateRoute exact path='/home' component={Home} />
					<Route exact path='*' component={NotFound} />
				</Switch>
			</BrowserRouter>
		);
	};
};

const isAuthenticated = () => {
	const token = localStorage.getItem('jwt');
	try {
		decode(token);
		return true;
	} catch (error) {
	  	return false;
	};
  };

function PrivateRoute({ component: Component, ...rest }) {
	return (
		<Route
			{...rest}
			render={props =>
			isAuthenticated() ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: "/",
					}}
				/>
			)
			}
		/>
	);
};
  
export default App;