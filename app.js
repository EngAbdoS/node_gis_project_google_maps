const express = require('express');
const NodeGeocoder = require('node-geocoder');
const axios = require('axios');
const mongodb = require('mongodb');
const dotenv = require('dotenv');
const Country = require('./models/country');
dotenv.config({ path: './config.env' });

const options = {
  provider: 'google',
  apiKey: process.env.apiKey,
};

const geocoder = NodeGeocoder(options);

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.apiKey,
});

const app = express();

// body parser:
app.use(express.json());

app.get('/geoooData', (req, res) => {
  googleMapsClient.geocode(
    { address: 'mansoura egypt' },
    function (err, response) {
      if (!err) {
        console.log('this is the response:', response.json.results);
        res.json(response.json.results);
      }
    }
  );
});


app.get('/restaurantsData', async (req, res) => {
  try {
    const city = 'mansoura';
    const category = 'restaurant';
    const nearTo = 'gehan';
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${category}+${city}+${nearTo}&type=${category}&key=${process.env.apiKey}`
    );
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});


app.get('/country', async (req, res) => {
  try {
    const countries = await Country.find();
    return res.status(200).json(countries);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// 2) add new country :

app.post('/country', async (req, res) => {
  try {
    const country = await Country.create(req.body);
    console.log(country);
    console.log('body:', req.body);
    return res.status(201).json(country);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// get all nearest locations from longitude and latitude of client location

app.get('/getAllNearestLocation', async (req, res) => {
  let maxDistance = req.query?.maxDistance || 500000000;

  const { longitude, latitude } = req.query;

  const nearestPlaces = await Country.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  });
  res.status(200).json(nearestPlaces);
});


module.exports = app;
