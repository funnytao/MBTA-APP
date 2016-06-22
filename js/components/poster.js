import React from 'react';

export default (props) => {
  var searched = JSON.parse(localStorage.getItem('favourites')) || {cr:[], subway:[], bus:[]};
  localStorage.setItem('favourites', JSON.stringify(searched));
  return (
    <img className="poster" src="../poster.png"></img>
  );
}
