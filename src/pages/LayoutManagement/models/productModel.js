import {
  queryRule,
  removeRule,
  addRule,
  updateRule,
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from '@/services/productServices';

export default {
  namespace: 'productModel',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAllProducts, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteProduct, payload);
      yield put({
        type: 'fetch',
        payload: response,
      });
      if (callback) callback();
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProduct, payload);
      yield put({
        type: 'fetch',
        payload: response,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateProduct, payload);
      yield put({
        type: 'fetch',
        payload: response,
      });
      if (callback) callback();
    },

    *search({ payload }, { call, put }) {
      const response = yield call(getAllProducts, payload);
      const { id, name } = payload;
      const idReg = new RegExp(`${id ? id : '.*'}`); //.*匹配所有  .代表任何字符
      const nameReg = new RegExp(`${name ? name : '.*'}`);
      const filteredData = [];
      for (let elem of response.values()) {
        if (
          idReg.test(elem.id ? elem.id + '' : '') &&
          nameReg.test(elem.name ? elem.name + '' : '')
        ) {
          filteredData.push(elem);
        }
      }
      yield put({
        type: 'save',
        payload: filteredData,
      });
    },

    /* *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    }, */
    /* *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    }, */
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
