import React from 'react';

import Nav from './Nav';

const Header = props => (
  <header className="light-grey">
    <Nav
    user={props.user}
    onLogout={props.onLogout}
    role={props.role}/>  
  </header>
)

export default Header;
