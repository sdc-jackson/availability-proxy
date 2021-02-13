const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const axios = require('axios');
const fallback = require('./fallbacks.js');

app.use('/', express.static('public'));
app.use('/rooms/:id', express.static('public'));

app.get('/availability', async (req, res) => {
  try {
    const response = await axios.get('https://availability-bundle.s3-us-west-2.amazonaws.com/bundle_availability.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/rooms/:id/availableDates', async (req, res) => {
  try {
    const response = await axios.get(`http://ec2-54-149-117-186.us-west-2.compute.amazonaws.com:5001/rooms/${req.params.id}/availableDates`);
    res.send(response.data);
  } catch (err) {
    res.send(fallback.calendar);
  }
});

app.get('/rooms/:id/minNightlyRate', async (req, res) => {
  try {
    const response = await axios.get(`http://ec2-54-149-117-186.us-west-2.compute.amazonaws.com:5001/rooms/${req.params.id}/minNightlyRate`);
    res.send(response.data);
  } catch (err) {
    res.send(fallback.nightlyRate);
  }
});

app.get('/photos', async (req, res) => {
  try {
    const response = await axios.get('https://react-bundles.s3.us-east-2.amazonaws.com/photos-service.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/rooms/:id/getPhotosByRoomID', async (req, res) => {
  try {
    const response = await axios.get(`http://ec2-18-191-199-80.us-east-2.compute.amazonaws.com:5005/rooms/${req.params.id}/getPhotosByRoomID`);
    res.send(response.data);
  } catch (err) {
    res.send(fallback.photos);
  }
});

app.get('/places', async (req, res) => {
  try {
    const response = await axios.get('https://fec-gnocchi-user-profile.s3-us-west-2.amazonaws.com/places.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/places/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5008/places/${req.params.id}`);
    res.send(response.data);
  } catch (err) {
    res.send(fallback.places);
  }
});


app.get('/users', async (req, res) => {
  try {
    const response = await axios.get('https://fec-gnocchi-user-profile.s3-us-west-2.amazonaws.com/users.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
  }
});


app.get('/users/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://ec2-34-219-34-184.us-west-2.compute.amazonaws.com:5007/users/${req.params.id}`);
    res.send(response.data);
  } catch (err) {
    res.send(fallback.user);
  }
});


module.exports = app;