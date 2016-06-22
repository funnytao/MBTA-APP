import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchBus, fetchMoreStops } from '../actions/index';
import { Glyphicon, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';

class Subway extends Component {
  componentWillMount() {
  }

  constructor(props) {
    super(props);
    this.state = { route: null, direction: "Outbound" };
    this.onRouteChange = this.onRouteChange.bind(this);
    this.onDirChange = this.onDirChange.bind(this);
  }

  onDirChange(direction) {
    this.setState({ direction });
  }

  onRouteChange(value) {
    console.log(value);
    this.setState({route: value});
    this.props.fetchMoreStops(value);
  }

  renderRouteList() {
    return this.state.routes.map((route, index) => {
      return <MenuItem key={index} onClick={() => this.onRouteChange(route)}>{route}</MenuItem>;
    });
  }

  renderStopList() {
    return this.props.stoplist.direction.map((direction, index) => {
      console.log(direction);
      if (this.state.direction=="Outbound"&&index==0 || this.state.direction=="Inbound"&&index==1) {
        return direction.stop.map((stop, index) => {
          return (
            <tr key={index} className={ index % 2 == 0 ? '' : 'single' }>
              <td>
                <Link to={`/subway/${this.state.direction}&${this.stopEncoder(stop.stop_name)}&${stop.stop_id}&${this.state.route=="Ct2"?747:this.state.route}&${stop.stop_lat}&${stop.stop_lon}`}>
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
      <div className="searchSubway">
        <div className="subway_dropdown">
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-danger" onClick={()=>this.onRouteChange("Red")}>Red</button>
            <button type="button" className="btn btn-warning" onClick={()=>this.onRouteChange("Orange")}>Orange</button>
            <button type="button" className="btn btn-info" onClick={()=>this.onRouteChange("Blue")}>Blue</button>
            <DropdownButton className="btn btn-success" title="Green" id="1">
              <MenuItem key="1" onClick={() => this.onRouteChange("Green-B")}>Green-B</MenuItem>
              <MenuItem key="2" onClick={() => this.onRouteChange("Green-C")}>Green-C</MenuItem>
              <MenuItem key="3" onClick={() => this.onRouteChange("Green-D")}>Green-D</MenuItem>
              <MenuItem key="4" onClick={() => this.onRouteChange("Green-E")}>Green-E</MenuItem>
            </DropdownButton>
            <button type="button" className={ `btn ${this.state.direction=="Outbound" ? 'btn-primary' : 'btn-default'}` } onClick={() => this.onDirChange("Outbound")}><strong>Outbound</strong></button>
            <button type="button" className={ `btn ${this.state.direction=="Inbound" ? 'btn-primary' : 'btn-default'}` } onClick={() => this.onDirChange("Inbound")}><strong>Inbound</strong></button>
          </div>
        </div>
        {
          this.state.route==null ? null :
            this.props.stoplist ?
              <table className="table table-hover" id="stop_table">
                <thead>
                  <tr>
                    <th>{this.state.route} Stop</th>
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

export default connect(mapStateToProps, { fetchBus, fetchMoreStops })(Subway);
