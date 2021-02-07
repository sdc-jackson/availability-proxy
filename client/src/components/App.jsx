import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {

  const renderService = async (path) => {
    const response = await axios.get(path);
    const invokeBundle = Function(response.data);
    invokeBundle();
  };

  useEffect(() => {
    renderService('/photos');
    renderService('/availability');
    renderService('/users');
    renderService('/places');
  });

  return (
    <div>
      <div id='main'></div>
      <div id='availabilityApp1'></div>
      <div id='availabilityApp2'></div>
      <div id='users'></div>
      <div id='places'></div>
    </div>
  );
};

export default App;