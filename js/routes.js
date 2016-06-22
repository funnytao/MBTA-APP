import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import SearchBar from './containers/search_bar';
import Timeline from './components/timeline';
import CommuterRail from './containers/commuter_rail';
import Poster from './components/poster';
import Bus from './containers/bus';
import Subway from './containers/subway';
import BusTime from './containers/bus_time';
import SubwayTime from './containers/subway_time';
import Favourites from './containers/favourites';

export default (
  <Route path="/" component={App} >
    <IndexRoute component={Poster} />
    <Route path="commuterrail" component={SearchBar} />
    <Route path="commuterrail/:dep&:arr&:date" component={CommuterRail} />
    <Route path="commuterrail/timeline/:trip&:dep&:arr" component={Timeline} />
    <Route path="bus" component={Bus} />
    <Route path="bus/:direction&:stop_name&:stop&:route&:lat&:lon" component={BusTime} />
    <Route path="subway" component={Subway} />
    <Route path="subway/:direction&:stop_name&:stop&:route&:lat&:lon" component={SubwayTime} />
    <Route path="favourites" component={Favourites} />
  </Route>
);
