import * as Actions from './actionConstants'
import { geocodeLocation } from '../api/googleMap';

export function addMarker(location, address) {
  return {
    type: Actions.ADD_MARKER,
    location,
    address
  }
}

export function addMarkerWithResolvedAddress({ getAddressForLocation = geocodeLocation } = {}) {
  return location => async dispatch => {
    const [lat, lng] = location;
    const address = await getAddressForLocation({ lat, lng });
    dispatch(addMarker(location, address));
  }
}
