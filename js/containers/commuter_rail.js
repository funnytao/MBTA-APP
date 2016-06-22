import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchStops, fetchTrips, fetchTripsID } from '../actions/index';
import Schedule from './schedule';
import { Glyphicon } from 'react-bootstrap';
import StationMap from '../components/google_map';
import _ from 'lodash';
import { browserHistory } from 'react-router';

class CommuterRail extends Component {
  componentWillMount() {
    this.props.fetchStops();
    this.props.fetchTrips();
    this.props.fetchTripsID();
    this.getResult();
  }

  stopDecoder(stop) {
    var tmp = "";
    var index = stop.indexOf('_');
    if (index!=-1) {
      tmp = stop.substring(0, index) + '/' + stop.substring(index+1, stop.length);
    }
    return tmp=="" ? stop : tmp;
  }

  getResult() {
    this.setState({ result: null });
    var depID = [], arrID = [];
    var depPos, arrPos;
    this.props.stops.map((stop) => {
      if (stop.stop_name==this.stopDecoder(this.props.params.dep)) {
        depPos = { lat: stop.stop_lat, lon: stop.stop_lon};
        depID.push(stop.stop_id);
      }
      else if (stop.stop_name==this.stopDecoder(this.props.params.arr)) {
        arrPos = { lat: stop.stop_lat, lon: stop.stop_lon};
        arrID.push(stop.stop_id);
      }
    });
    this.setState({ depPos, arrPos });
    var depTrips = [], arrTrips = [];
    this.props.trips.map((trip) => {
      if (depID.indexOf(trip.stop_id) > -1) {
        depTrips.push(trip);
      }
      else if (arrID.indexOf(trip.stop_id) > -1) {
        arrTrips.push(trip);
      }
    });
    var result = [];
    depTrips.map((trip1) => {
      arrTrips.map((trip2) => {
        if (trip1.trip_id==trip2.trip_id && trip1.stop_sequence<trip2.stop_sequence && trip1.trip_id.indexOf(this.props.params.date)>-1) {
          var minute = trip2.arrival_time.substring(trip2.arrival_time.length-5, trip2.arrival_time.length-3) - trip1.departure_time.substring(trip1.departure_time.length-5, trip1.departure_time.length-3);
          var hour = trip2.arrival_time.substring(0, trip2.arrival_time.length-6) - trip1.departure_time.substring(0, trip1.departure_time.length-6);
          if (minute<=0) {
            hour = hour - 1;
            minute = minute + 60;
          }
          var duration = hour+'h'+minute+'m';
          var dt = trip1.departure_time.split(":")[0]<10 ? "0" : "";
          var at = trip2.arrival_time.split(":")[0]<10 ? "0" : "";
          result.push({
            departure_time: dt+trip1.departure_time.substring(0, trip1.departure_time.length-3),
            arrival_time: at+trip2.arrival_time.substring(0, trip2.arrival_time.length-3),
            id: trip1.trip_id,
            duration: duration,
          });
        }
      });
    });
    this.setState({ result: _.sortBy(result, 'departure_time') });
    console.log(result);
  }

  constructor(props) {
    super(props);
    this.state = { result: null, depPos: null, arrPos: null };
  }

  handleBack(e) {
    e.preventDefault();
    browserHistory.goBack();
  }

  render() {
    return (
      <div className="searchBar">
        <div className="cr-header">
          { this.state.result && this.state.result.length>0 ? <h3>{this.stopDecoder(this.props.params.dep)}&nbsp; <Glyphicon glyph="arrow-right" />&nbsp; {this.stopDecoder(this.props.params.arr)}</h3> : <div>Sorry, no routes found.</div>}
        </div>
        <div className="btn-group btn-op-cr" role="group">
          <button type="button" className="btn btn-primary" onClick={(e) => this.handleBack(e)}>Back</button>
        </div>
        { this.state.result && this.state.result.length>0 ? <Schedule result={this.state.result} dep={this.props.params.dep} arr={this.props.params.arr} /> : null}
        { this.state.result && this.state.result.length>0 ? <div className="mapdiv"><StationMap dep={this.state.depPos} arr={this.state.arrPos} /></div> : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { stops: state.trips.stops, trips: state.trips.trips, tripsid: state.trips.tripsid };
}

export default connect(mapStateToProps, { fetchStops, fetchTrips, fetchTripsID })(CommuterRail);
