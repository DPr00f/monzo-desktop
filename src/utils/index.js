import store from 'store';
import Axios from 'axios';
import config from '../../config';
import appStore from '../store';
import {
  REQUEST_STARTED,
  REQUEST_COMPLETED,
  REQUEST_FAILED
} from '../actions/types';

let amountOfRequests = 0;

function handleAxiosResponse(response, headers) {
  --amountOfRequests;
  if (headers['content-type'] &&
      headers['content-type'].indexOf('application/json') > -1) {
    response = JSON.parse(response);
  }
  if (typeof response === 'object' && !response.error) {
    if (!amountOfRequests) {
      appStore.dispatch({
        type: REQUEST_COMPLETED
      });
    }
  }
  return response;
}

function handleAxiosRequest(data) {
  ++amountOfRequests;
  if (amountOfRequests === 1) {
    appStore.dispatch({
      type: REQUEST_STARTED
    });
  }
  return data;
}

function handleAxiosValidateStatus(status) {
  const valid = status >= 200 && status < 300;
  if (!valid) {
    appStore.dispatch({
      type: REQUEST_FAILED,
      message: `Request failed with status code ${status}`
    });
  }
  return valid;
}


export const localStorage = store;

export const axios = Axios.create({
  baseURL: config.API_URL,
  timeout: 1000,
  transformRequest: handleAxiosRequest,
  transformResponse: handleAxiosResponse,
  validateStatus: handleAxiosValidateStatus,
  headers: {
    authorization: localStorage.get('token')
  }
});
