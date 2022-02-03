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

import AddNewSale from './components/sales/AddNewSale';
import UpdateSale from './components/sales/UpdateSale';
import RemoveSale from './components/sales/RemoveSale';

import AddNewProduct from './components/products/AddNewProduct';
import UpdateProduct from './components/products/UpdateProduct';
import RemoveProduct from './components/products/RemoveProduct';

import AddNewPurchase from './components/purchase/AddNewPurchase';
import UpdatePurchase from './components/purchase/UpdatePurchase';
import RemovePurchase from './components/purchase/RemovePurchase';

import AddNewVendor from './components/vendors/AddNewVendor';
import UpdateVendor from './components/vendors/UpdateVendor';
import RemoveVendor from './components/vendors/RemoveVendor';

import AddNewCustomer from './components/customer/AddNewCustomer';
import UpdateCustomer from './components/customer/UpdateCustomer';
import RemoveCustomer from './components/customer/RemoveCustomer';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={Login} />
					<Route exact path='/reset-password' component={ResetPassword} />
					<Route exact path='/register' component={Register} />
					<PrivateRoute exact path='/home' component={Home} />
					<PrivateRoute exact path='/home/add-new-sale' component={AddNewSale} />
					<PrivateRoute exact path='/home/update-sale' component={UpdateSale} />
					<PrivateRoute exact path='/home/remove-sale' component={RemoveSale} />
					<PrivateRoute exact path='/home/add-new-product' component={AddNewProduct} />
					<PrivateRoute exact path='/home/update-product' component={UpdateProduct} />
					<PrivateRoute exact path='/home/remove-product' component={RemoveProduct} />
					<PrivateRoute exact path='/home/add-new-purchase' component={AddNewPurchase} />
					<PrivateRoute exact path='/home/update-purchase' component={UpdatePurchase} />
					<PrivateRoute exact path='/home/remove-purchase' component={RemovePurchase} />
					<PrivateRoute exact path='/home/add-new-vendor' component={AddNewVendor} />
					<PrivateRoute exact path='/home/update-vendor' component={UpdateVendor} />
					<PrivateRoute exact path='/home/remove-vendor' component={RemoveVendor} />
					<PrivateRoute exact path='/home/add-new-customer' component={AddNewCustomer} />
					<PrivateRoute exact path='/home/update-customer' component={UpdateCustomer} />
					<PrivateRoute exact path='/home/remove-customer' component={RemoveCustomer} />
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