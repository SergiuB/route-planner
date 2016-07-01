import qs from 'qs';

export function getDirections(intermediatePoints) {
  const query = qs.stringify(intermediatePoints);

  return fetch(`/api/directions?${query}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}
