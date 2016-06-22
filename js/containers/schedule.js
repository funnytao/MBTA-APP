import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Schedule extends Component {
  renderSchedule() {
    return this.props.result.map((res, index) => {
      return (
        <tr key={index} className={ index % 2 == 0 ? '' : 'single' }>
          <td>{res.departure_time}</td>
          <td>{res.arrival_time}</td>
          <td>{res.duration}</td>
          <td><Link to={`/commuterrail/timeline/${res.id}&${this.props.dep}&${this.props.arr}`}>select</Link></td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table className="table table-hover" id="cr-table">
        <thead>
          <tr>
            <th>Departs</th>
            <th>Arrives</th>
            <th>Duration</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>{this.renderSchedule()}</tbody>
      </table>
    );
  }
}
