import axios from 'axios';

export const FETCH_STOPS = 'FETCH_STOPS';
export const FETCH_TRIPS = 'FETCH_TRIPS';
export const FETCH_TRIPSID = 'FETCH_TRIPSID';
export const FETCH_BUS = 'FETCH_BUS';
export const FETCH_MORESTOPS = 'FETCH_MORESTOPS';

const API_KEY = '2LcZTTRE1UCBb1WubaYwQg';

export function fetchTripsID() {
  const request = axios.get('http://funnytao.github.io/mbta/commuter/trips.json');
  return {
    type: FETCH_TRIPSID,
    payload: request
  };
}

export function fetchTrips() {
  const request = axios.get('http://funnytao.github.io/mbta/commuter/stop_times.json');
  return {
    type: FETCH_TRIPS,
    payload: request
  };
}

export function fetchStops() {
  const request = axios.get('http://funnytao.github.io/mbta/commuter/stops.json');
  return {
    type: FETCH_STOPS,
    payload: request
  }
}

export function fetchMoreStops(route) {
  const url = `http://realtime.mbta.com/developer/api/v2/stopsbyroute?api_key=${API_KEY}&route=${route}&format=json`;
  const request = axios.get(url);
  return {
    type: FETCH_MORESTOPS,
    payload: request
  }
}

export function fetchBus(stop) {
  const url = `http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=${API_KEY}&stop=${stop}&format=json`;
  const request = axios.get(url);
  return {
    type: FETCH_BUS,
    payload: request
  }
}
