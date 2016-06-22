import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { toggle: false };
  }

  toggleClass() {
    var tmp = !this.state.toggle;
    this.setState({ toggle: tmp });
  }

  closeToggle() {
    this.setState({ toggle: false });
  }

  render() {
    return (
      <ul className={`topnav ${this.state.toggle ? "responsive" : ""}`}>
        <li><Link to="/"><img src="../MBTA_logo.png"></img></Link></li>
        <li><Link onClick={() => this.closeToggle()} to="/bus"><i className="icon ion-android-bus"></i><span>Bus</span></Link></li>
        <li><Link onClick={() => this.closeToggle()} to="/subway"><i className="icon ion-android-subway"></i><span>Subway</span></Link></li>
        <li><Link onClick={() => this.closeToggle()} to="/commuterrail"><i className="icon ion-android-train"></i><span>Commuter Rail</span></Link></li>
        <li><Link onClick={() => this.closeToggle()} to="/favourites"><i className="icon ion-heart"></i><span>Favourites</span></Link></li>
        <li className="icon" onClick={() => this.toggleClass()}><i className="icon ion-navicon-round"></i></li>
      </ul>
    );
  }
}
