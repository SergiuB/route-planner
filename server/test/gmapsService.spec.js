const _ = require('lodash');
const directionsService = require('../services/gmapsService');
const expect = require('chai').expect;

describe('GmapsService', () => {
  it('returns a path between multiple locations', (done) => {
    directionsService.getPath(['Bucharest, Romania', 'Chisinau, Moldavia', 'Moscow, Russia' ])
      .then((path) => {
        const firstPoint = path[0];
        const midPoint = path[8836];
        const lastPoint = path[path.length - 1];
        const [expectedFirstPoint, expectedMidPoint, expectedLastPoint] = [
          [ 44.42659, 26.10278 ], [ 47.00979, 28.86264 ], [ 55.75615, 37.6172 ]];

        expect(firstPoint).to.deep.equal(expectedFirstPoint);
        expect(midPoint).to.deep.equal(expectedMidPoint);
        expect(lastPoint).to.deep.equal(expectedLastPoint);
        done();
      })
      .catch(done);
  });

  it('returns elevations for given points', (done) => {
    // urcare Transfagarasan
    directionsService.getPath(['45.56977227, 24.61139202', '45.59476204 , 24.62010384' ])
      .then(directionsService.getElevations)
      .then(elevations => {
        expect(elevations).to.be.an('Array');
        expect(_.last(elevations)).to.be.above(2000);
        done();
      })
      .catch(done);
  });
});
