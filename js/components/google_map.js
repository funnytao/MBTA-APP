import { default as React, Component } from "react";
import { GoogleMapLoader, GoogleMap, DirectionsRenderer } from "react-google-maps";

export default class Directions extends Component {
  componentWillMount() {
    const newstate = {
      origin: new google.maps.LatLng(this.props.dep.lat, this.props.dep.lon),
      destination: new google.maps.LatLng(this.props.arr.lat, this.props.arr.lon),
      directions: null,
    }
    this.setState(newstate);
  }

  componentDidMount() {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: this.state.origin,
      destination: this.state.destination,
      travelMode: google.maps.TravelMode.TRANSIT,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
        });
      } else {
        console.error(`error fetching directions ${ result }`);
      }
    });
  }

  render() {
    const { origin, directions } = this.state;
    return (
      <GoogleMapLoader
        containerElement={ <div style={{height: '100%'}} />}
        googleMapElement={
          <GoogleMap defaultZoom={9} defaultCenter={{lat: 37.416679, lng: -121.986039 }} >
            {directions ? <DirectionsRenderer directions={directions} /> : null}
          </GoogleMap>
        }
      />
    );
  }
}
