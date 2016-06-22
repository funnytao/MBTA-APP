import { FETCH_STOPS, FETCH_TRIPS, FETCH_TRIPSID, FETCH_BUS, FETCH_MORESTOPS, FETCH_TIME } from '../actions/index';

const INITIAL_STATE = { stops: [], trips: [], tripsid: [], bus_info: null, morestops: null, time: null };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_STOPS:
      return { time: state.time, morestops: state.morestops, stops: action.payload.data, trips: state.trips, tripsid: state.tripsid, bus_info: state.bus_info };
    case FETCH_TRIPS:
      return { time: state.time, morestops: state.morestops, stops: state.stops, trips: action.payload.data, tripsid: state.tripsid, bus_info: state.bus_info };
    case FETCH_TRIPSID:
      return { time: state.time, morestops: state.morestops, stops: state.stops, trips: state.trips, tripsid: action.payload.data, bus_info: state.bus_info };
    case FETCH_BUS:
      return { time: state.time, morestops: state.morestops, stops: state.stops, trips: state.trips, tripsid: state.tripsid, bus_info: action.payload.data };
    case FETCH_MORESTOPS:
      return { time: state.time, morestops: action.payload.data, stops: state.stops, trips: state.trips, tripsid: state.tripsid, bus_info: state.bus_info };
    case FETCH_TIME:
      return { time: action.payload.data, morestops: state.morestops, stops: state.stops, trips: state.trips, tripsid: state.tripsid, bus_info: state.bus_info };
    default:
      return state;
  }
}
