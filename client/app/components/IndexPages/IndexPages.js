import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Home from '../Home/Home';

import EditorHome from '../Home/EditorHome';

import NotFound from '../App/NotFound';

// quote pages
import NewQuote from '../QuotePages/QuoteInput/NewQuote';
import SavedQuotes from '../QuotePages/SavedQuotes/SavedQuotes';
import EditQuote from '../QuotePages/QuoteInput/EditQuote';
import ViewItem from '../ViewItem/ViewItem';

// customers
import ManageCustomers from '../ManageCustomers/ManageCustomers';
import EditCustomer from '../ManageCustomers/EditCustomer';
import CustomerInput from '../ManageCustomers/CustomerInput';

// quote summary
import QuoteSummary from '../QuotePages/QuoteSummary/QuoteSummary';

/* ------------- admin pages --------------- */
// manage users
import ManageUsers from '../AdminPages/ManageUsers/ManageUsers';
import UserInput from '../AdminPages/ManageUsers/UserInput';
import EditUser from '../AdminPages/ManageUsers/EditUser';

// manage items
import ManageItems from '../AdminPages/ManageItems/ManageItems';
import AddItem from '../AdminPages/ManageItems/AddItem';
import EditItem from '../AdminPages/ManageItems/EditItem';

// manage vendors
import ManageVendors from '../AdminPages/ManageVendors/ManageVendors';
import CreateVendor from '../AdminPages/ManageVendors/CreateVendor';
import EditVendor from '../AdminPages/ManageVendors/EditVendor';

// manage collections
import ManageCollections from '../AdminPages/ManageCollections/ManageCollections';
import CreateCollection from '../AdminPages/ManageCollections/CreateCollection';

// my info
import MyInfo from '../MyInfo/MyInfo';

const IndexPages = (props) => {
  const { role, user } = props;
  return (

  <Switch>

    <Route 
    exact path='/' 
    component={role === 'admin' || role === 'salesrep' ? Home : EditorHome}/>

    <Route 
    exact path='/new' 
    component={role === 'admin' || role === 'salesrep' ? NewQuote : NotFound}/>

    <Route 
    exact path='/quote/:quoteID' 
    component={role === 'admin' || role === 'salesrep' ? EditQuote : NotFound}/>

    <Route 
    exact path='/my-quotes' 
    component={role === 'admin' || role === 'salesrep' ? SavedQuotes : NotFound}/>

    <Route 
    exact path='/view/:id' 
    component={ViewItem}/>

    <Route 
    exact path='/quote-summary' 
    component={QuoteSummary}/>

    <Route 
    exact path='/manage-customers' 
    component={role === 'admin' || role === 'salesrep' ? ManageCustomers : NotFound}/>

    <Route 
    exact path='/create-customer' 
    component={role === 'admin' || role === 'salesrep' ? CustomerInput : NotFound}/>

    <Route 
    exact path='/create-customer-2'
    render={() => (
      <>
      {role === 'admin' ? (
        <CustomerInput
        isInQuoteProcess={true}/>
      ) : (
        <NotFound/>
      )}
      </>
    )}/>

    <Route 
    exact path='/customer/:id' 
    component={role === 'admin' || role === 'salesrep' ? EditCustomer : NotFound}/>

    <Route 
    exact path='/customer-2/:id' 
    render={(props) => (
      <>
      {role === 'admin' || role === 'salesrep' ? (
        <EditCustomer
          props={props}
          isInQuoteProcess={true}/>
      ) : (
        <NotFound/>
      )}
      </>
    )}/>

    <Route 
    exact path='/manage-users' 
    component={role === 'admin' ? ManageUsers : NotFound}/>

    <Route 
    exact path='/create-user' 
    component={role === 'admin' ? UserInput : NotFound}/>

    <Route 
    exact path='/edit-user/:id' 
    component={role === 'admin' ? EditUser : NotFound}/>

    <Route 
    exact path='/manage-vendors' 
    component={role === 'admin' ? ManageVendors : NotFound}/>

    <Route 
    exact path='/create-vendor' 
    component={role === 'admin' ? CreateVendor : NotFound}/>

    <Route 
    exact path='/edit-vendor/:vendorID' 
    component={role === 'admin' ? EditVendor : NotFound}/>

    <Route 
    exact path='/manage-items' 
    component={role === 'admin' || role === 'editor' ? ManageItems : NotFound}/>

    <Route 
    exact path='/add-item' 
    component={role === 'admin' || role === 'editor' ? AddItem : NotFound}/>

    <Route 
    exact path='/item/:id' 
    component={role === 'admin' || role === 'editor' ? EditItem : NotFound}/>

    <Route 
    exact path='/manage-collections' 
    component={role === 'admin' || role === 'editor' ? ManageCollections : NotFound}/>

    <Route 
    exact path='/create-collection' 
    component={role === 'admin' || role === 'editor' ? CreateCollection : NotFound}/>

    <Route
    exact path='/my-info'
    render={() => (
      <MyInfo
      user={user}/>
    )}/>

   </Switch>
  );
}

export default IndexPages;