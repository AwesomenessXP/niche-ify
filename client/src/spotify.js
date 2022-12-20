import axios from 'axios';

const LOCAL_STORAGE_KEYS = {
  access_tk: 'access_token',
  refresh_tk: 'refresh_token',
  expires_in: 'expires_in',
  timestamp: 'timestamp',
}

const local_storage = window.localStorage;

const LOCAL_STORAGE_VALUES = {
  access_tk: local_storage.getItem(LOCAL_STORAGE_KEYS.access_tk),
  refresh_tk: local_storage.getItem(LOCAL_STORAGE_KEYS.refresh),
  expires_in: local_storage.getItem(LOCAL_STORAGE_KEYS.expires_in),
  timestamp: local_storage.getItem(LOCAL_STORAGE_KEYS.timestamp),
}

/**
 * Logic for storing and accessing token and refresh token in localStorage
 * @returns {boolean} if true, then has valid access token, if not, then false
 */
const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    accessToken: urlParams.get('access_token'),
    refreshToken: urlParams.get('refresh_token'),
    expiresIn: urlParams.get('expires_in'),
  }

  // the first time the user visits, store access tk and refresh tk
  if (queryParams.accessToken) { // use for ... in for maps
    local_storage.setItem(LOCAL_STORAGE_KEYS.access_tk, queryParams.accessToken);
    
    // set timestamp
    local_storage.setItem(LOCAL_STORAGE_KEYS.timestamp, Date.now());

    // return access token to user
    return local_storage.get(LOCAL_STORAGE_VALUES.access_tk);
  }

  // check if theres an error in query
  const hasError = urlParams.get('error'); 

    // next time user visits, get refresh token from spotify
  if (LOCAL_STORAGE_VALUES.access_tk || hasError || hasTokenExpired()) {
    refreshToken();
  }

  // default case: return the access token
  return LOCAL_STORAGE_VALUES.access_tk;
}

export const accessToken = getAccessToken();

/**
 * Checks if the access token has expired, given timestamp and when it expires
 * @returns null
 */
const hasTokenExpired = () => {
  const { access_tk, timestamp, expires_in } = LOCAL_STORAGE_VALUES;
  if (!access_tk || !timestamp) {
    return false;
  }
  // convert timestamp into an integer
  const millisecondsPassed = Date.now() - Number(timestamp);
  return (millisecondsPassed / 1000) > Number(expires_in);
}

/**
 * Logic that checks if a token should be refreshed or not
 * if refreshed, store the new values in localStorage
 * @return null
 */
const refreshToken = async () => {
  try {
    const { access_tk, refresh_tk, timestamp } = LOCAL_STORAGE_VALUES;

    // logout if no refresh token or reload infinite loop
    if (!refresh_tk || refresh_tk === 'undefined' ||
      (Date.now() - Number(timestamp) / 1000) < 1000)
      {
      console.log('No refresh token available yet');
      logout();
    }

    // use "/refresh_token" endpoint from Node
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${access_tk}`
    );

    // store refresh token in local storage
    // update/set timestamp
    local_storage.setItem(LOCAL_STORAGE_KEYS.access_tk, data.refresh_token);
    local_storage.setItem(LOCAL_STORAGE_KEYS.timestamp, Date.now());

    // reload page for localstorage updates to be reflected
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
}

export const logout = () => {
  // clear localStorage
  for (const property in LOCAL_STORAGE_KEYS) {
    local_storage.removeItem(LOCAL_STORAGE_KEYS[property]);
  }

  // navigate to homepage
  window.location = window.location.origin;
}