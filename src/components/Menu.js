import React from 'react';
import { Link } from 'react-router';

export default class Menu extends React.Component {
  render(){
    return (
      <nav className="menu">
        <Link activeClassName="active"></Link>
      </nav>
    );
  }
}
