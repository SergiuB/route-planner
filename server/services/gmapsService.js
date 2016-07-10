const _ = require('lodash');

module.exports = ({ mapsApi, polylineApi }) => {
  function getFullPath(route) {
    let fullPath = [];
    for (const leg of route.legs) {
      for (const step of leg.steps) {
        fullPath = fullPath.concat(polylineApi.decode(step.polyline.points));
      }
    }
    return fullPath;
  }

  function getPathTwoPoints([origin, destination]) {
    return new Promise((resolve, reject) => {
      const originFmtd = origin.join(',');
      const destinationFmtd = destination.join(',');
      mapsApi.directions({
        origin: originFmtd,
        destination: destinationFmtd,
      }, (error, { status, routes } = {}) => {
        if (error) {
          reject(error);
        } else if (status === 'ZERO_RESULTS') {
          resolve([]);
        } else if (status !== 'OK') {
          reject(new Error(status));
        } else {
          resolve(getFullPath(routes[0]));
        }
      });
    });
  }

  function getPath({ points }) {
    const pointPairs = points.map((value, index) => [points[index - 1], value]);
    const [, ...validPairs] = pointPairs;
    const pathPromises = validPairs.map(getPathTwoPoints);
    return new Promise((resolve, reject) => {
      Promise.all(pathPromises)
        .then(resolve)
        .catch(reject);
    });
  }

  function getElevationsSingleRequest(points) {
    return new Promise((resolve, reject) => {
      const locations = points.map(point => point.join(',')).join('|');
      mapsApi.elevations({ locations }, (error, { status, results } = {}) => {
        if (error) {
          reject(error);
        } else if (status !== 'OK') {
          reject(new Error(status));
        } else {
          resolve(results.map(r => r.elevation));
        }
      });
    });
  }

  function getElevations({ points, maxPointsPerRequest = 300 }) {
    return new Promise((resolve, reject) => {
      const chunks = _.chunk(points, maxPointsPerRequest);
      Promise.all(chunks.map(getElevationsSingleRequest))
        .then(elevationChunks => resolve(_.concat.apply(null, elevationChunks)))
        .catch(reject);
    });
  }

  return { getPath, getElevations };
};
