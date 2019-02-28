import {
  getAllProducts,
  getColumnsByProduct,
  getFtpConfig,
  deleteColumn,
  addColumn,
  updateColumn,
} from '@/services/cmServices';
import {message} from 'antd';

export default {
  namespace: 'columnModel',

  state: {
    data: [],
    productList:[],
    productId:'',//select框值
  },

  effects: {
    *getProductList({ payload }, { call, put }) {
      const response = yield call(getAllProducts, payload);
      yield put({
        type: 'saveProductId',
        payload: response[0]?response[0].id:'',
      });
      yield put({
        type: 'saveProductList',
        payload: response,
      });
      if(response[0]){//如果有产品 初始化时也查询次栏目 和内容
        yield put({
          type: 'fetch',
        });
      }
    },

    *fetch({ payload }, { call, put,select }) {
      let productId;
      if(payload&&payload.productId){
        productId = payload.productId;
      }else{
        productId =yield select(state => state.columnModel.productId);
      }
      const response = yield call(getColumnsByProduct, {productId:productId});
      const urlPrefix = `http://${window.location.hostname}:8082/cm/poster`;
      response.map((obj)=>{
        obj.poster = obj.poster?urlPrefix+obj.poster:'';
      });
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteColumn, payload);
      if(response==undefined){
        message.warn('删除失败。可能是有关联关系未删除。')
      }else{
        message.success('删除成功');
      }
      if (callback) callback();
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addColumn, payload);
      if(response==undefined){
        message.warn('新增失败。可能是栏目ID已存在。')
      }else{
        message.success('新增成功');
      }
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateColumn, payload);
      if(response==undefined){
        message.warn('编辑失败，接口返回异常。')
      }else{
        message.success('编辑成功');
      }
      if (callback) callback();
    },

    *search({ payload }, { call, put ,select }) {
      const productId = yield select(state => state.columnModel.productId);
      const response = yield call(getColumnsByProduct, {productId:productId});

      const urlPrefix = `http://${window.location.hostname}:8082/cm/poster`;
      response.map((obj)=>{
        obj.poster = obj.poster?urlPrefix+obj.poster:'';
      });

      const {columnId, name } = payload;//todo:产品id筛选没加
      const columnIdReg = new RegExp(`${columnId ? columnId : '.*'}`); //.*匹配所有  .代表任何字符
      const nameReg = new RegExp(`${name ? name : '.*'}`);
      const filteredData = [];
      for (let elem of response.values()) {
        if (
          columnIdReg.test(elem.columnId ? elem.columnId + '' : '') &&
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
    saveProductList(state, action) {
      return {
        ...state,
        productList: action.payload,
      };
    },
    saveProductId(state, action) {
      return {
        ...state,
        productId: action.payload,
      };
    },
  },
};
