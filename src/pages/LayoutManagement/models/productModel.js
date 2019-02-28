import {
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from '@/services/cmServices';
import {message} from 'antd';

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
      if(response==undefined){
        message.warn('删除失败，接口异常。')
      }else{
        message.success('删除成功');
      }
      yield put({
        type: 'fetch',
        payload: response,
      });
      if (callback) callback();
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProduct, payload);
      if(response==undefined){
        message.warn('新增失败，可能是产品ID已存在。')
      }else{
        message.success('新增成功');
      }
      yield put({
        type: 'fetch',
        payload: response,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateProduct, payload);
      if(response==undefined){
        message.warn('编辑失败，接口返回异常。')
      }else{
        message.success('编辑成功');
      }
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
