/* eslint func-names: 0, prefer-arrow-callback: 0 */

const createMapService = require('../services/gmapsService');
const polylineApi = { decode: x => x };
const expect = require('chai').expect;
const _ = require('lodash');

describe('gmapsService', function () {

  it('returns a path between ten coordinates', async function () {
    const gmapsService = createMapService({
      mapsApi: {
        directions: ({origin, destination}, fn) => fn(null, {
          status: 'OK',
          routes: [{
            legs: [{
              steps: [{
                polyline: {
                  points: [
                    origin.split(',').map(parseFloat),
                    destination.split(',').map(parseFloat)]
                }
              }]
            }]
          }]
        })
      },
      polylineApi
    });

    const points = _.times(10, x => [x, x]);
    const path = await gmapsService.getPath({ points });

    const pointPairs = points.map((value, index) => [points[index - 1], value]);
    const [, ...expectedPaths] = pointPairs;

    expect(path).to.deep.equal(expectedPaths);
  });

  it('returns empty path if no route is found between two coordinates', async function () {
    const gmapsService = createMapService({
      mapsApi: {
        directions: (_, fn) => fn(undefined, { status: 'ZERO_RESULTS' })
      },
      polylineApi
    });

    const path = await gmapsService.getPath({ points: [[], []] });

    expect(path).to.deep.equal([[]]);
  });

  it('throws error if API returns status not ok', function (done) {
    const gmapsService = createMapService({
      mapsApi: {
        directions: (_, fn) => fn(undefined, { status: 'STATUS_ERROR' })
      },
      polylineApi
    });

    gmapsService.getPath({ points: [[], []] })
      .catch(err => {
        expect(err.message).to.equal('STATUS_ERROR');
        done();
      });
  });

  it('throws error if API returns error', function (done) {
    const gmapsService = createMapService({
      mapsApi: {
        directions: (_, fn) => fn('error', undefined)
      },
      polylineApi
    });

    gmapsService.getPath({ points: [[], []] })
      .catch(err => {
        expect(err).to.equal('error');
        done();
      });
  });

  it('returns elevation for given locations while splitting the elevation API calls ' +
    'so each call requests elevations for a maximum number of points', async function () {
    const points = _.times(10, x => [x, x]);
    const expectedElevations = _.times(10);
    let apiCallCount = 0;
    const gmapsService = createMapService({
      mapsApi: {
        elevations: ({ locations }, fn) => {
          apiCallCount++;
          fn(null, {
            status: 'OK',
            results: locations
                      .split('|')
                      .map(lStr => lStr.split(','))
                      .map(([lat, lng]) => ({ elevation: parseFloat(lat) }))
          });
        }
      }
    });

    const elevations = await gmapsService.getElevations({ points,  maxPointsPerRequest: 2 });

    expect(elevations).to.deep.equal(expectedElevations);
    expect(apiCallCount).to.equal(5);
  });

  it('throws error if elevations API returns status not ok', function (done) {
    const gmapsService = createMapService({
      mapsApi: {
        elevations: (_, fn) => fn(null, { status: 'STATUS_ERROR' })
      },
    });

    gmapsService.getElevations({ points: [[], []] })
      .catch(err => {
        expect(err.message).to.equal('STATUS_ERROR');
        done();
      });
  });

  it('throws error if API returns error', function (done) {
    const gmapsService = createMapService({
      mapsApi: {
        elevations: (_, fn) => fn('error', undefined)
      },
    });

    gmapsService.getElevations({ points: [[], []] })
      .catch(err => {
        expect(err).to.equal('error');
        done();
      });
  });
});
