import React from 'react';
import { Component } from 'react';
import SearchBar from '../containers/search_bar';
import Header from './header';
import Nav from './navigator';
import Footer from './footer';

export default class App extends Component {
  render() {
    return (
      <div className="componentDiv">
        <Nav />
        <Header />
        <div>{this.props.children}</div>
        <Footer />
      </div>
    );
  }
}
