import fontawesome from 'fontawesome-markers';
import _ from 'lodash';

const markerIcon = {
  path: fontawesome.DOT_CIRCLE_O,
  scale: 0.2,
  strokeWeight: 0.2,
  strokeColor: 'black',
  strokeOpacity: 1,
  fillColor: 'red',
  fillOpacity: 1,
  anchor: new google.maps.Point(22, -12),
};

const polylineStyle = {
  geodesic: true,
  strokeColor: 'red',
  strokeOpacity: 1.0,
  strokeWeight: 2,
};

class GoogleMapInstance {

  constructor(elem, opts) {
    const { listeners, ...other } = opts;
    this.map = new google.maps.Map(elem, opts);
    this.polyline = null;
    this.markers = [];

    if (listeners && _.isObject(listeners)) {
      _.forOwn(listeners, (value, key) => {
        this.map.addListener(key, value);
      });
    }
    this.createMarker = this.createMarker.bind(this);
  }

  createPolyline(path) {
    this.removePolyline();
    this.polyline = new google.maps.Polyline(Object.assign({ path }, polylineStyle));
    this.polyline.setMap(this.map);
  }

  removePolyline() {
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = undefined;
    }
  }

  createMarkers(markerInfos) {
    this.clearMarkers();
    this.markers = markerInfos.map(this.createMarker);
  }

  createMarker({ id, location, listeners }) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: markerIcon,
      draggable:true,
    });
    marker.metadata = { id };

    if (listeners && _.isObject(listeners)) {
      _.forOwn(listeners, (value, key) => {
        marker.addListener(key, value);
      });
    }

    return marker;
  }

  clearMarkers() {
    for (const marker of this.markers) {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    }
    this.markers = [];
  }
}

class Geocoder {
  constructor() {
    this.geocoder = new google.maps.Geocoder;
  }

  geocodeLocation(latLng) {
    return new Promise(( resolve, reject) => {
      this.geocoder.geocode({ location: latLng}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            resolve(results[1].formatted_address);
          } else {
            reject('No results found');
          }
        } else {
          reject('Geocoder failed due to: ' + status);
        }
      });
    });
  }

}

export function createGoogleMapInstance(elem, opts) {
  return new GoogleMapInstance(elem, opts);
}

let geocoder;
export function geocodeLocation(latLng) {
  if (!geocoder) {
    geocoder = new Geocoder();
  }
  return geocoder.geocodeLocation(latLng);
}
