import userreducer from './userreducer';
import transactionsreducer from './transactionsreducer'
import {combineReducers} from 'redux'
import { dataReducer } from './reducer';
const appReducers = combineReducers({
    userreducer:userreducer,
    transactionsreducer:transactionsreducer,
   
})
const reducers = (state, action) => {
    if (action.type === 'USER_LOGGED_OUT') {
      state = undefined;
    }
    return appReducers(state, action);
  };
export default reducers;