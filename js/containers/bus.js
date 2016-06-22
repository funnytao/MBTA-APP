import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchBus, fetchMoreStops } from '../actions/index';
import { Glyphicon, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';

class Bus extends Component {
  componentWillMount() {
  }

  constructor(props) {
    super(props);
    this.state = { stop: "Stop", route: "Routes", routes: ["Ct2", "8", "9", "19", "47", "57", "60", "65", "66"], direction: "Outbound" };
    this.onRouteChange = this.onRouteChange.bind(this);
    this.onDirChange = this.onDirChange.bind(this);
  }

  onDirChange(direction) {
    this.setState({ direction });
  }

  onRouteChange(value) {
    console.log(value);
    this.setState({route: value});
    var route_id = value=='Ct2' ? 747 : value;
    this.props.fetchMoreStops(route_id);
  }

  renderRouteList() {
    return this.state.routes.map((route, index) => {
      return <MenuItem key={index} onClick={() => this.onRouteChange(route)}>{route}</MenuItem>;
    });
  }

  renderStopList() {
    return this.props.stoplist.direction.map((direction) => {
      console.log(direction);
      if (direction.direction_name==this.state.direction) {
        return direction.stop.map((stop, index) => {
          return (
            <tr key={index} className={ index % 2 == 0 ? '' : 'single' }>
              <td>
                <Link to={`bus/${this.state.direction}&${this.stopEncoder(stop.stop_name)}&${stop.stop_id}&${this.state.route=="Ct2"?747:this.state.route}&${stop.stop_lat}&${stop.stop_lon}`}>
                  {stop.stop_name}
                </Link>
              </td>
            </tr>
          );
        });
      }
    });
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
      <div className="searchBus">
        <div className="bus_dropdown">
          <div className="btn-group btn-group-bus" role="group">
            <DropdownButton className="choose_bus" title={this.state.route} id="1">
              {this.renderRouteList()}
            </DropdownButton>
            <button type="button" className={ `btn ${this.state.direction=="Outbound" ? 'btn-primary' : 'btn-default'}` } onClick={() => this.onDirChange("Outbound")}><strong>Outbound</strong></button>
            <button type="button" className={ `btn ${this.state.direction=="Inbound" ? 'btn-primary' : 'btn-default'}` } onClick={() => this.onDirChange("Inbound")}><strong>Inbound</strong></button>
          </div>
        </div>
        {
          this.state.route=="Routes" ? null :
            this.props.stoplist ?
              <table className="table table-hover" id="stop_table">
                <thead>
                  <tr>
                    <th>Stop</th>
                  </tr>
                </thead>
                <tbody>{this.renderStopList()}</tbody>
              </table> : <h1>Loading...</h1>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { bus_info: state.trips.bus_info, stoplist: state.trips.morestops };
}

export default connect(mapStateToProps, { fetchBus, fetchMoreStops })(Bus);
