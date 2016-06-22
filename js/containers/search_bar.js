import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchStops, fetchTrips } from '../actions/index';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';

class SearchBar extends Component {

  componentWillMount() {
    this.props.fetchStops();
    this.props.fetchTrips();
  }
  constructor(props) {
    super(props);
    this.state = { departure: '', arrival: '', date: 'Choose a Day' };
    this.onDepatureChange = this.onDepatureChange.bind(this);
    this.onArrivalChange = this.onArrivalChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDepatureChange(event) {
    this.setState({ departure: event.target.value });
  }

  onArrivalChange(event) {
    this.setState({ arrival: event.target.value });
  }

  onDateChange(event) {
    this.setState({ date: event.currentTarget.text });
  }

  // return a datalist to autocomplete the input
  renderDepStops() {
    return this.props.stops.map((stop) => {
      return <option key={stop.stop_id}>{stop.stop_name}</option>;
    });
  }

  // return a datalist based on the selected departure stop
  renderArrStops() {
    var arrStops = [];
    var routes = [];
    this.props.trips.map((trip) => {
      var route = trip.trip_id.split("-")[1];
      // find all the routes containing departure
      if (this.state.departure==trip.stop_id) {
        if (routes.indexOf(route)==-1) {
          routes.push(route);
        }
      }
      // in the same route
      else if (routes.indexOf(route)!=-1) {
        if (arrStops.indexOf(trip.stop_id)==-1) {
          arrStops.push(trip.stop_id);
        }
      }
    });
    arrStops.sort();
    return arrStops.map((stop, index) => {
      return <option key={index}>{stop}</option>;
    });
  }

  // disable second input while first input is not valid
  depValid() {
    var dep = false;
    this.props.stops.map((stop) => {
      if (stop.stop_name==this.state.departure) dep = true;
    });
    return dep;
  }

  // disable submit button if input not exists in the stop list
  inputValid() {
    var dep = false, arr = false;
    this.props.stops.map((stop) => {
      if (stop.stop_name==this.state.departure) {
        dep = true;
      }
      if (stop.stop_name==this.state.arrival) {
        arr = true;
      }
    });
    return dep && arr && this.state.arrival!=this.state.departure && this.state.date!='Choose a Day';
  }

  stopEncoder(stop) {
    var tmp = "";
    var index = stop.indexOf('/');
    if (index!=-1) {
      tmp = stop.substring(0, index) + '_' + stop.substring(index+1, stop.length);
    }
    return tmp=="" ? stop : tmp;
  }

  render() {
    return (
      <div className="searchBar">
        <form>
          <div className="input-group">
            <label htmlFor="depart" className="input-group-addon">Departure</label>
            <input placeholder="From" list="dep-stops" id="depart" onChange={this.onDepatureChange} className="form-control" />
            <datalist id="dep-stops">
              {this.renderDepStops()}
            </datalist>
          </div>

          <div className="input-group">
            <label htmlFor="arrive" className="input-group-addon">Arrival</label>
            <input placeholder="To" disabled={!this.depValid()} list="arr-stops" id="arrive" onChange={this.onArrivalChange} className="form-control" />
            <datalist id="arr-stops">
              {this.renderArrStops()}
            </datalist>
          </div>

          <div className="dropdown">
            <DropdownButton title={this.state.date} id="1">
              <MenuItem key="1"  active onClick={this.onDateChange}>Weekday</MenuItem>
              <MenuItem key="2" onClick={this.onDateChange}>Saturday</MenuItem>
              <MenuItem key="3" onClick={this.onDateChange}>Sunday</MenuItem>
            </DropdownButton>
            {this.inputValid() ?
              <Link to={`/commuterrail/${this.stopEncoder(this.state.departure)}&${this.stopEncoder(this.state.arrival)}&${this.state.date}`}>
                <button type="button" className="btn btn-secondary" >Search</button>
              </Link>
              :<button disabled={true} type="button" className="btn btn-secondary" >Search</button>
            }
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { stops: state.trips.stops, trips: state.trips.trips };
}

export default connect(mapStateToProps, { fetchStops, fetchTrips })(SearchBar);
