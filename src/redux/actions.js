import * as Actions from './actionConstants'

export function setLanguage(language) {
  return {
    language,
    type: Actions.SET_LANGUAGE,
  }
}

export function setReferenceCoordinates(refCoords) {
  return {
    refCoords,
    type: Actions.SET_REFERENCE_COORDINATES,
  }
}

export function setSelectedDate(date) {
  return {
    date,
    type: Actions.SET_SELECTED_DATE,
  }
}

export function showCalendar() {
  return {
    type: Actions.SHOW_CALENDAR,
  }
}
export function hideCalendar() {
  return {
    type: Actions.HIDE_CALENDAR,
  }
}
