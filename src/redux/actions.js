import * as Actions from './actionConstants'
import { geocodeLocation } from '../api/googleMap';

export function addMarkerSync(location, address) {
  return {
    type: Actions.ADD_MARKER,
    location,
    address
  }
}

export function removeMarkerSync(id) {
  return {
    type: Actions.REMOVE_MARKER,
    id,
  }
}

export function updateMarkerSync(id, location, address) {
  return {
    type: Actions.UPDATE_MARKER_LOCATION,
    id,
    location,
    address
  }
}

export function addMarkerWithResolvedAddress({ getAddressForLocation = geocodeLocation } = {}) {
  return location => async dispatch => {
    const [lat, lng] = location;
    const address = await getAddressForLocation({ lat, lng });
    dispatch(addMarkerSync(location, address));
  }
}

export function updateMarkerWithResolvedAddress({ getAddressForLocation = geocodeLocation } = {}) {
  return (id, location) => async dispatch => {
    const [lat, lng] = location;
    const address = await getAddressForLocation({ lat, lng });
    dispatch(updateMarkerSync(id, location, address));
  }
}
