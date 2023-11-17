import {
  SEARCH_STARTED,
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
  FETCH_REPRESENTATIVES,
  GEOCODE_STARTED,
  GEOCODE_FAILED,
  GEOCODE_COMPLETE,
  GEOCODE_CLEAR_ERROR,
  CLEAR_SEARCH_TEXT,
  GEOLOCATE_USER,
} from '../utils/actionTypes';

export const INITIAL_STATE = {
  locationInputString: '',
  repOrganizationInputString: '',
  locationQueryString: '',
  repOrganizationQueryString: '',
  representativeType: 'organization',
  position: {
    latitude: 40.17887331434698,
    longitude: -99.27246093750001,
  },
  bounds: [-77.53653, 38.3976763, -76.53653, 39.3976763],
  currentPage: 1,
  inProgress: false,
  searchBoundsInProgress: false,
  geocodeInProgress: false,
  geocodeResults: [],
  isErrorEmptyInput: false,
  isErrorCleared: true,
  mapMoved: false,
  error: false,
  isValid: true,
};

export const validateForm = (oldState, payload) => {
  const newState = {
    ...oldState,
    ...payload,
  };

  return {
    isValid: newState.locationInputString?.length > 0,
    isErrorEmptyInput: newState.locationInputString?.length === 0,
    locationChanged:
      oldState.locationInputString !== newState.locationInputString,
    repOrganizationChanged:
      oldState.repOrganizationInputString !==
      newState.repOrganizationInputString,
    representativeTypeChanged:
      oldState.representativeType !== newState.representativeType,
    serviceTypeChanged: oldState.serviceType !== newState.serviceType,
  };
};

export const SearchQueryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_STARTED:
      return {
        ...state,
        ...action.payload,
        error: false,
        inProgress: true,
      };
    case FETCH_REPRESENTATIVES:
      return {
        ...state,
        ...action.payload,
        error: false,
        inProgress: false,
        searchBoundsInProgress: false,
        ...validateForm(state, action.payload),
      };
    case SEARCH_FAILED:
      return {
        ...state,
        error: true,
        inProgress: false,
        searchBoundsInProgress: false,
      };
    case SEARCH_QUERY_UPDATED:
      return {
        ...state,
        ...action.payload,
        ...validateForm(state, action.payload),
        error: false,
      };
    case GEOCODE_STARTED:
      return {
        ...state,
        error: false,
        geocodeInProgress: true,
      };
    case GEOLOCATE_USER:
      return {
        ...state,
        geolocationInProgress: true,
      };
    case GEOCODE_FAILED:
      return {
        ...state,
        geocodeError: action.code || -1,
        geocodeInProgress: false,
        geolocationInProgress: false,
      };
    case GEOCODE_COMPLETE:
      return {
        ...state,
        geocodeResults: action.payload,
        geocodeInProgress: false,
        geolocationInProgress: false,
      };
    case GEOCODE_CLEAR_ERROR:
      return {
        ...state,
        geocodeError: 0,
        geocodeInProgress: false,
        geolocationInProgress: false,
      };
    case CLEAR_SEARCH_TEXT:
      return {
        ...state,
        locationInputString: '',
        isValid: false,
        locationChanged: true,
      };
    default:
      return state;
  }
};