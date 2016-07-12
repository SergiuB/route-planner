const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const _ = require('lodash');
const GoogleMapsAPI = require('googlemaps');
const polyline = require('polyline');

const { gmaps } = require('./config');
const createGmapsService = require('./services/gmapsService');

const gm = new GoogleMapsAPI(gmaps);
const gmapsService = createGmapsService({
  mapsApi: gm,
  polylineApi: polyline,
});

app.use(bodyParser.json());

app.get('/api/directions', (req, res) => {
  const points = _.values(req.query);//.map(([lat, lng]) => `${lat},${lng}`);
  gmapsService.getPath({ points })
    .then(path => {
      res.send(path);
    })
    .catch(error => {
      console.log(error);
    });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
