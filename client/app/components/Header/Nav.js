import React from 'react';

import MenuItem from './MenuItem';

import { Link } from 'react-router-dom';

const Nav = props => (
  <nav className="navbar navbar-light">

    <Link to="/"><span className="navbar-brand">P.D.Q.E.</span></Link>

    <span className="navbar-brand navbar-user">Welcome {props.user}!</span>

    <button 
    className="navbar-toggler toggler-example" 
    type="button" 
    data-toggle="collapse" 
    data-target="#navbarSupportedContent1"
    aria-controls="navbarSupportedContent1" 
    aria-expanded="false" 
    aria-label="Toggle navigation">
      
      <span className="black-text">
        <i className="fas fa-bars fa-1x"></i>
      </span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent1">
      <ul className="navbar-nav mr-auto">

        {props.role !== 'editor' && (
          <>
            <MenuItem
            to="/new"
            text="New Quotes"/>
    
            <MenuItem
            to="/my-quotes"
            text="Saved Quotes"/>

            <MenuItem
            to="/manage-customers"
            text="My Customers"/>
          </>
        )}


        {props.role === 'admin' && (
          <>

            <span className="nav-hr"><small>Admin</small></span>

            <MenuItem
            to="/manage-users"
            text="Manage Users"/>

            <MenuItem
            to="/manage-vendors"
            text="Manage Vendor Database"/>

          </>
        )}

        {(props.role === 'admin' || props.role === 'editor' ) && (
          <>
          
            <span className="nav-hr"><small>Editor</small></span>

            <MenuItem
            to="/manage-items"
            text="Manage Item Database"/>
  
            <MenuItem
            to="/manage-collections"
            text="Manage Collection Database"/>
            
          </>
        )}

        <span className="nav-hr"><small></small></span>

        <MenuItem
        to="/my-info"
        text="My Info"/>


        <li className="nav-item">                       <Link
          className="nav-link"
          to="/"
          onClick={e => props.onLogout(e)}>
            Log out
          </Link>
        </li>

      </ul>
    </div>
  </nav>
);

export default Nav;