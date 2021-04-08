const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const axios = require('axios');
const fallback = require('./fallbacks.js');
let redis = require('redis');
let client = redis.createClient();

client.on('error', (err) => console.log(err))

app.use('/', express.static('public'));
app.use('/rooms/:id', express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//***********/ RETRIEVE BUNDLES /***********//

app.get('/header', async (req, res) => {
  try {
    const response = await axios.get('https://fec-gnocchi-user-profile.s3-us-west-2.amazonaws.com/header.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/title', async (req, res) => {
  try {
    const response = await axios.get('https://react-bundles.s3.us-east-2.amazonaws.com/title-service.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
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

app.get('/summary', async (req, res) => {
  try {
    const response = await axios.get('https://summarybundle-mockairbnb.s3-us-west-2.amazonaws.com/summary.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/availability', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/bundle_availability.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
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

app.get('/places', async (req, res) => {
  try {
    const response = await axios.get('https://fec-gnocchi-user-profile.s3-us-west-2.amazonaws.com/places.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/footer', async (req, res) => {
  try {
    const response = await axios.get('https://footer-bundle.s3-us-west-2.amazonaws.com/footer.js');
    res.send(response.data);
  } catch (err) {
    console.error(err);
  }
});

//***********/ SERVICE FORWARDING /***********//
const availabilityServers = ['50.18.110.200:5001','54.183.77.249:5001']
let currentAvailabilityServer = 0;
app.get('/rooms/:id/availableDates', (req, res) => {
  try {
    client.get(`available${req.params.id}`, (err, results) => {
      if (err) { throw err }
      else if (results) {
        res.status(200).send(results)
      } else {
        axios.get(`http://${availabilityServers[currentAvailabilityServer]}/rooms/${req.params.id}/availableDates`)
          .then(response => {
            currentAvailabilityServer = (currentAvailabilityServer + 1) % availabilityServers.length;
            client.set(`available${req.params.id}`, JSON.stringify(response.data));
            if(response.data) { res.status(201).send(response.data); }
          })
      }
    })
  } catch (err) {
      res.status(500).send(err);
  }
});
app.post('/rooms/:id/reservations', async (req, res) => {
  try {
    const response = await axios.post(`http://${availabilityServers[currentAvailabilityServer]}/rooms/${req.params.id}/reservations`, req.body);
    currentAvailabilityServer = (currentAvailabilityServer + 1) % availabilityServers.length;
    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/rooms/:id/minNightlyRate', (req, res) => {
  client.get(`minNightlyRate${req.params.id}`, (err, results) => {
    if (err) {
      console.log('err',err);
      res.status(500).send(err);
    }
    else if (!results) {
      axios.get(`http://${availabilityServers[currentAvailabilityServer]}/rooms/${req.params.id}/minNightlyRate`)
        .then(response => {
          client.set(`minNightlyRate${req.params.id}`, JSON.stringify(response.data),(err) => {
            if(err) { throw err }
          })
          currentAvailabilityServer = (currentAvailabilityServer + 1) % availabilityServers.length;
          res.status(201).send(response.data)
        })
        .catch(err => {
          res.status(500).send(err)
        })
    } else { res.status(200).send(results) }
  })
});

app.get('/rooms/:id/summary', async (req, res) => {
  try {
    const response = await axios.get(`http://ec2-54-149-117-186.us-west-2.compute.amazonaws.com:5002/rooms/${req.params.id}/summary`);
    res.send(response.data);
  } catch (err) {
    res.send(fallback.summary);
  }
});

app.get('/rooms/:id/title', async (req, res) => {
  try {
    const response = await axios.get(`http://ec2-18-191-199-80.us-east-2.compute.amazonaws.com:5006/rooms/${req.params.id}/title`);
    res.send(response.data);
  } catch (err) {
    res.send(fallback.title);
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

app.get('/users/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://ec2-52-24-37-226.us-west-2.compute.amazonaws.com:5007/users/${req.params.id}`);
    res.send(response.data);
  } catch (err) {
    res.send(fallback.user);
  }
});

app.get('/places/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://ec2-54-203-153-69.us-west-2.compute.amazonaws.com:5008/places/${req.params.id}`);
    res.send(response.data);
  } catch (err) {
    res.send(fallback.places);
  }
});


module.exports = app;