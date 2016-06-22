import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchBus, fetchTime } from '../actions/index';
import { Glyphicon, DropdownButton, MenuItem } from 'react-bootstrap';
import StopMap from '../components/stop_map';
import { browserHistory } from 'react-router';

class SubwayTime extends Component {
  componentWillMount() {
    this.props.fetchBus(this.props.params.stop);
  }

  constructor(props) {
    super(props);
    this.state = { cached: this.isCached() };
  }

  calTime(time) {
    return (Math.round(time/60)+"min");
  }

  renderPrediction() {
    // console.log(this.props.bus_info.mode[0].route);
    return this.props.bus_info.mode[0].route.map((route) => {
      // console.log(route);
      if (route.route_id==this.props.params.route) {
        return route.direction.map((trips) => {
          console.log(trips);
          if (["Outbound", "Southbound", "Westbound"].indexOf(trips.direction_name)!=-1 && this.props.params.direction=="Outbound" ||
            ["Inbound", "Northbound", "Eastbound"].indexOf(trips.direction_name)!=-1 && this.props.params.direction=="Inbound") {
            return trips.trip.map((trip) => {
              return (
                <tr key={trip.trip_id} >
                  <td>{this.calTime(trip.pre_away)}</td>
                  <td>{trip.trip_headsign}</td>
                </tr>
              );
            });
          }
        });
      }
    });
  }

  handleBack(e) {
    e.preventDefault();
    browserHistory.goBack();
  }

  stopDecoder(stop) {
    var tmp = "";
    var index = stop.indexOf('_');
    if (index!=-1) {
      tmp = stop.substring(0, index) + '/' + stop.substring(index+1, stop.length);
    }
    return tmp=="" ? stop : tmp;
  }

  cacheFavor() {
    var dup = false;
    var searched = JSON.parse(localStorage.getItem('favourites'));
    if (searched.subway) {
      searched.subway.map((save, index) => {
        if (save.stop_id==this.props.params.stop && save.route==this.props.params.route && save.direction==this.props.params.direction) {
          searched.subway.splice(index, 1);
          localStorage.setItem('favourites', JSON.stringify(searched));
          dup = true;
        }
      });
      this.setState({ cached: dup });
      if (!dup) {
        searched.subway.push({
          direction: this.props.params.direction,
          stop_name: this.props.params.stop_name,
          stop_id: this.props.params.stop,
          route: this.props.params.route,
          lat: this.props.params.lat,
          lon: this.props.params.lon
        });
        localStorage.setItem('favourites', JSON.stringify(searched));
      }
    }
  }

  isCached() {
    var dup = false;
    var searched = JSON.parse(localStorage.getItem('favourites'));
    if (searched.subway) {
      searched.subway.map((save, index) => {
        if (save.stop_id==this.props.params.stop && save.route==this.props.params.route && save.direction==this.props.params.direction) {
          dup = true;
        }
      });
    }
    return dup;
  }

  render() {
    // console.log(new Date(1466480700*1000).toISOString());
    if (!this.props.bus_info) {
      return null;
    }
    else if (!this.props.bus_info.mode) {
      return <h1 className="error_mes">Sorry, Service is unavailable.</h1>
    }
    // console.log(this.props.bus_info.mode[0].route);
    return (
      <div>
        <div className="btn-group btn-op" role="group">
          <button type="button" className="btn btn-primary" onClick={(e) => this.handleBack(e)}>Back</button>
          <button type="button" className={`btn ${this.isCached() ? 'btn-warning' : 'btn-primary'}`} onClick={() => this.cacheFavor()}><span className="glyphicon glyphicon-star" aria-hidden="true"></span></button>
        </div>
        <div className="bus_detail">
          <div className="stopmapdiv"><StopMap stop={this.stopDecoder(this.props.params.stop_name)} lat={this.props.params.lat} lon={this.props.params.lon} /></div>
          <div className="btn-group" role="group">
            <button type="button" className={ `btn ${this.props.params.direction=="Outbound" ? 'btn-primary' : 'btn-default'}` }><strong>Outbound</strong></button>
            <button type="button" className={ `btn ${this.props.params.direction=="Inbound" ? 'btn-primary' : 'btn-default'}` }><strong>Inbound</strong></button>
          </div>
          <div className="bus_predict">
            <table className="table table-hover bus_table" id="subway_table">
              <thead>
                <tr>
                  <th>Time Left</th>
                  <th>Destination</th>
                </tr>
              </thead>
              <tbody>
                {this.renderPrediction()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { bus_info: state.trips.bus_info };
}

export default connect(mapStateToProps, { fetchBus, fetchTime })(SubwayTime);
