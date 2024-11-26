import {GET_DATA_FAILURE, GET_DATA_REQUEST, GET_DATA_SUCCESS} from './action';

const initState = {
  isLoading: false,
  isError: false,
  dataGet: [],
};

export const dataReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case GET_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        dataGet: action.payload,
      };
    case GET_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    default:
      return {
        ...state,
      };
  }
};
