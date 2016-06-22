import React, { Component } from 'react';
import { Glyphicon, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

export default class Favourites extends Component {
  componentWillMount() {
  }

  constructor(props) {
    super(props);
    this.state = { mode: "Bus" };
    this.onModeChange = this.onModeChange.bind(this);
  }

  onModeChange(value) {
    this.setState({ mode: value });
  }

  renderBus() {
    var searched = JSON.parse(localStorage.getItem('favourites'));
    return searched.bus.map((bus, index) => {
      return (
        <tr key={index} className={ index % 2 == 0 ? '' : 'single' }>
          <td>{bus.route}</td>
          <td>{bus.stop_name}</td>
          <td>
            <Link to={`bus/${bus.direction}&${bus.stop_name}&${bus.stop_id}&${bus.route}&${bus.lat}&${bus.lon}`}>
              select
            </Link>
          </td>
        </tr>
      );
    });
  }

  renderSubway() {
    var searched = JSON.parse(localStorage.getItem('favourites'));
    return searched.subway.map((subway, index) => {
      return (
        <tr key={index} className={ index % 2 == 0 ? '' : 'single' }>
          <td>{subway.route}</td>
          <td>{subway.stop_name}</td>
          <td><Link to={`subway/${subway.direction}&${subway.stop_name}&${subway.stop_id}&${subway.route}&${subway.lat}&${subway.lon}`}>select</Link></td>
        </tr>
      );
    });
  }

  renderCR() {
    var searched = JSON.parse(localStorage.getItem('favourites'));
    return searched.cr.map((cr, index) => {
      var tmp = cr.trip.split('-');
      return (
        <tr key={index} className={ index % 2 == 0 ? '' : 'single' }>
          <td>{tmp[tmp.length-1]}</td>
          <td>{cr.dep}</td>
          <td>{cr.arr}</td>
          <td><Link to={`/commuterrail/timeline/${cr.trip}&${cr.dep}&${cr.arr}`}>select</Link></td>
        </tr>
      );
    });
  }

  renderComponents() {
    if (this.state.mode=="Bus") {
      return (
        <table className="table table-hover bus_table" id="subway_table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Stop</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {this.renderBus()}
          </tbody>
        </table>
      );
    }
    else if (this.state.mode=="Subway") {
      return (
        <table className="table table-hover bus_table" id="subway_table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Stop</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {this.renderSubway()}
          </tbody>
        </table>
      );
    }
    else {
      return (
        <table className="table table-hover bus_table" id="subway_table">
          <thead>
            <tr>
              <th>Trip</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {this.renderCR()}
          </tbody>
        </table>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="btn-group fav-op" role="group">
          <button type="button" className={ `btn ${this.state.mode=="Bus" ? 'btn-primary' : 'btn-default'}` } onClick={() => this.onModeChange("Bus")}>Bus</button>
          <button type="button" className={ `btn btn-middle ${this.state.mode=="Subway" ? 'btn-primary' : 'btn-default'}` } onClick={() => this.onModeChange("Subway")}>Subway</button>
          <button type="button" className={ `btn ${this.state.mode=="Commuter Rail" ? 'btn-primary' : 'btn-default'}` } onClick={() => this.onModeChange("Commuter Rail")}>Commuter Rail</button>
        </div>
        <div className="fav-comp">
          {this.renderComponents()}
        </div>
      </div>
    );
  }
}
