import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {

  const renderService = async (path) => {
    const response = await axios.get(path);
    const invokeBundle = Function(response.data);
    invokeBundle();
  };

  useEffect(() => {
    //renderService('/header');
    //renderService('/title');
    //renderService('/photos');
    //renderService('/summary');
    renderService('/availability');
    //renderService('/users');
    //renderService('/places');
    //renderService('/footer');
  });

  return (
    <div>
      <div id='header'></div>
      <div id='title-bar'></div>
      <div id='main'></div>
      <div id='summaryBar'></div>
      <div id='availabilityApp1'></div>
      <div id='availabilityApp2'></div>
      <div id='users'></div>
      <div id='places'></div>
      <div id='footer'></div>
    </div>
  );
};

export default App;