import axios from 'axios';
import { CREATE_BOARD } from './types';

export function createBoard(name, fullname, time, successCallback, errorCallback) {
  const url = `${__ROOT_URL__}createchannel`;
  const request = axios.post(url, { name, time: 300 });

  return (dispatch) => {
    request.then(() => {
      dispatch({
        type: CREATE_BOARD,
        payload: name,
      });
      successCallback();
    }, errorCallback);
  };
}
