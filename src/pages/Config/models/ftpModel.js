import {
    getFtpConfig,
    updateFtpConfig,
  } from '@/services/cmServices';
  
  export default {
    namespace: 'ftpModel',
  
    state: {
      data: {},
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {
        const response = yield call(getFtpConfig, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
  
      *update({ payload, callback }, { call, put }) {
        const response = yield call(updateFtpConfig, payload);
        yield put({
          type: 'fetch',
          payload: response,
        });
        if (callback) callback();
      },
    },
  
    reducers: {
      save(state, action) {
        return {
          ...state,
          data: action.payload,
        };
      },
    },
}
  