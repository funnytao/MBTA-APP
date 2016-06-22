import { default as React, Component } from "react";
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

export default class StopMap extends Component {

  render() {
    return (
      <GoogleMapLoader
        containerElement={
          <div
            style={{
              height: "100%",
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref="map"
            defaultZoom={15}
            defaultCenter={{lat: Number(this.props.lat), lng: Number(this.props.lon)}}>
            {/*<Marker defaultPosition={{lat: Number(this.props.lat), lng: Number(this.props.lon)}} />*/}
            <InfoWindow
              defaultPosition={{lat: Number(this.props.lat), lng: Number(this.props.lon)}}
              content={this.props.stop}
            />
          </GoogleMap>
        }
      />
    );
  }
}
