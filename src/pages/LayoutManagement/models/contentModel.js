import {
  getAllProducts,
  getContentsByProduct,
  deleteContent,
  addContent,
  updateContent,
  getFtpConfig,
} from '@/services/cmServices';
import {message} from 'antd';

export default {
  namespace: 'contentModel',

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
      if(response[0]){//如果有产品 初始化时也查询次内容
        yield put({
          type: 'fetch'
        });
      }
    },

    *fetch({ payload }, { call, put,select }) {
      let productId;
      if(payload&&payload.productId){
        productId = payload.productId;
      }else{
        productId =yield select(state => state.contentModel.productId);
      }
      const response = yield call(getContentsByProduct, {productId:productId});
      
      const urlPrefix = `http://${window.location.hostname}:8082/cm/poster`;
      response.map((obj)=>{
        obj.icon = obj.icon?urlPrefix+obj.icon:'';
        obj.poster = obj.poster?urlPrefix+obj.poster:'';
        obj.screenShot = obj.screenShot?urlPrefix+obj.screenShot:'';
      });
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteContent, payload);
      if(response==undefined){
        message.warn('删除失败。可能是有关联关系未删除。')
      }else{
        message.success('删除成功');
      }
      if (callback) callback();
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addContent, payload);
      if(response==undefined){
        message.warn('新增失败。可能是内容ID已存在。')
      }else{
        message.success('新增成功');
      }
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateContent, payload);
      if(response==undefined){
        message.warn('编辑失败，接口返回异常。')
      }else{
        message.success('编辑成功');
      }
      if (callback) callback();
    },

    *search({ payload }, { call, put,select }) {
      const productId = yield select(state => state.contentModel.productId);
      const response = yield call(getContentsByProduct, {productId:productId});

      const urlPrefix = `http://${window.location.hostname}:8082/cm/poster`;
      response.map((obj)=>{
        obj.icon = obj.icon?urlPrefix+obj.icon:'';
        obj.poster = obj.poster?urlPrefix+obj.poster:'';
        obj.screenShot = obj.screenShot?urlPrefix+obj.screenShot:'';
      });

      const { contentId, name } = payload;//todo:产品id筛选没加
      const contentIdReg = new RegExp(`${contentId ? contentId : '.*'}`); //.*匹配所有  .代表任何字符
      const nameReg = new RegExp(`${name ? name : '.*'}`);
      const filteredData = [];
      for (let elem of response.values()) {
        if (
          contentIdReg.test(elem.contentId ? elem.contentId + '' : '') &&
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
