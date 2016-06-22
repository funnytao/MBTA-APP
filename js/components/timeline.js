import React, { Component } from 'react';
import { Glyphicon  } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchTrips } from '../actions/index';
import { browserHistory } from 'react-router';

class TripLine extends Component {
  componentWillMount() {
    this.props.fetchTrips();
  }

  constructor(props) {
    super(props);
    this.state = { cached: this.isCached() };
  }

  getResult() {
    var start = false;
    var result = [];
    this.props.trips.map((trip) => {
      if (trip.trip_id==this.props.params.trip) {
        if (trip.stop_id==this.stopDecoder(this.props.params.dep)) {
          start = true;
          result.push({
            stop_name: trip.stop_id,
            arr_time: trip.arrival_time
          });
        }
        else if (trip.stop_id==this.stopDecoder(this.props.params.arr)) {
          start = false;
          result.push({
            stop_name: trip.stop_id,
            arr_time: trip.arrival_time
          });
        }
        else if (start) {
          result.push({
            stop_name: trip.stop_id,
            arr_time: trip.arrival_time
          });
        }
      }
    });
    return result;
  }

  renderTimeline() {
    var result = this.getResult();
    return result.map((stop, index) => {
      return (
        // <div className="stopComponent" key={index}>
        //   <h3 className="stopTime">{this.timeModifier(stop.arr_time)}</h3>
        //   <div className="stopDot" />
        //   <h3 className="stopName">{stop.stop_name}</h3>
        // </div>
        <ul className="stopComponent" key={index}>
          <li className="stopTime"><h3>{this.timeModifier(stop.arr_time)}</h3></li>
          <li><div className="stopDot" /></li>
          <li className="stopName"><h3>{stop.stop_name}</h3></li>
        </ul>
      );
    });
  }

  stopDecoder(stop) {
    var tmp = "";
    var index = stop.indexOf('_');
    if (index!=-1) {
      tmp = stop.substring(0, index) + '/' + stop.substring(index+1, stop.length);
    }
    return tmp=="" ? stop : tmp;
  }

  timeModifier(time) {
    var tmp = time.substring(0, time.length-3);
    if (tmp.split(':')[0].length==1) {
      tmp = '0'+tmp;
    }
    return tmp;
  }

  handleBack(e) {
    e.preventDefault();
    browserHistory.goBack();
  }

  cacheFavor() {
    var dup = false;
    var searched = JSON.parse(localStorage.getItem('favourites'));
    if (searched.cr) {
      searched.cr.map((save, index) => {
        if (save.trip==this.props.params.trip && save.dep==this.props.params.dep && save.arr==this.props.params.arr) {
          searched.cr.splice(index, 1);
          localStorage.setItem('favourites', JSON.stringify(searched));
          dup = true;
        }
      });
      this.setState({ cached: dup });
      if (!dup) {
        searched.cr.push({
          trip: this.props.params.trip,
          dep: this.props.params.dep,
          arr: this.props.params.arr
        });
        localStorage.setItem('favourites', JSON.stringify(searched));
      }
    }
  }

  isCached() {
    var dup = false;
    var searched = JSON.parse(localStorage.getItem('favourites'));
    if (searched.cr) {
      searched.cr.map((save, index) => {
        if (save.trip==this.props.params.trip && save.dep==this.props.params.dep && save.arr==this.props.params.arr) {
          dup = true;
        }
      });
    }
    return dup;
  }

  render() {
    return (
      <div>
        <div className="btn-group btn-op" role="group">
          <button type="button" className="btn btn-primary" onClick={(e) => this.handleBack(e)}>Back</button>
          <button type="button" className={`btn ${this.isCached() ? 'btn-warning' : 'btn-primary'}`} onClick={() => this.cacheFavor()}><span className="glyphicon glyphicon-star" aria-hidden="true"></span></button>
        </div>
        { !this.props.trips || this.props.trips.length==0 ? <h1 id="timeline-error">Loading...</h1> :
          <div id="timeline" className="timeline-container">
            {this.renderTimeline()}
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { trips: state.trips.trips };
}

export default connect(mapStateToProps, { fetchTrips })(TripLine);
