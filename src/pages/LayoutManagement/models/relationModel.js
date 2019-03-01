import {
  getAllProducts,
  getColumnsByProduct,
  getColumnDetail,
  getContentsByProduct,
  getAllColumns,
  deleteRelation,
  addRelation,
  updateRelation,
  getFtpConfig,
} from '@/services/cmServices';
import {message} from 'antd';
export default {
  namespace: 'relationModel',

  state: {
    productList:[],
    columnList:[],
    selectContent:[],

    detailList:[],//详情总列表
    sonColumnList:[],//选中栏目后的子栏目列表 type:1
    sonContentList:[],//选中栏目后的子内容列表 type:0

    productId:'',//select框值
    columnId:'',
  },

  effects: {
    *getProductList({ payload }, { call, put }) {
      const response = yield call(getAllProducts, payload);
      yield put({
        type: 'saveProductList',
        payload: response,
      });
      yield put({
        type: 'saveProductId',
        payload: response[0]?response[0].id:'',
      });
      if(response[0]){//如果有产品 初始化时也查询次栏目 和内容
        yield put({
          type: 'getColumnsByProduct',
          payload: {productId:response[0].id},
        });
        yield put({
          type: 'getSelectContent',
          payload: {productId:response[0].id},
        });
      }
    },

    *getColumnsByProduct({ payload }, { call, put,select }) {
      const response = yield call(getColumnsByProduct, payload);
      const productId = yield select(state => state.relationModel.productId);
      yield put({
        type: 'saveColumnList',
        payload: response,
      });
      yield put({
        type: 'saveColumnId',
        payload: response[0]?response[0].columnId:'',
      });
      if(response[0]){//如果有栏目 初始化时也查询次详情
        yield put({
          type: 'getColumnDetail',
          payload: {productId:productId,columnId:response[0].columnId},
        });
      }
    },

    *getColumnDetail({ payload }, { call, put }) {
      const response = yield call(getColumnDetail, payload);
      const urlPrefix = `http://${window.location.hostname}:8082/cm/poster`;
      let sonColumnList = [];
      let sonContentList =[];
      response.map((detailObj)=>{
        if(detailObj.type==0){
          detailObj.content.icon = detailObj.content.icon?urlPrefix+detailObj.content.icon:'';
          detailObj.content.poster = detailObj.content.poster?urlPrefix+detailObj.content.poster:'';
          detailObj.content.screenShot = detailObj.content.screenShot?urlPrefix+detailObj.content.screenShot:'';
          detailObj.poster = detailObj.content.poster;//把poster字段放入detailObj 方便解析
          detailObj.content.position = detailObj.position;//position 放入列表中
          detailObj.content.relationType = detailObj.type;//子集是栏目还是内容的type 放入列表中
          sonContentList.push(detailObj.content);
        }
        if(detailObj.type==1){
          detailObj.childColumn.poster = detailObj.childColumn.poster?urlPrefix+detailObj.childColumn.poster:'';
          detailObj.poster = detailObj.childColumn.poster;
          detailObj.childColumn.position = detailObj.position;//position 放入列表中
          detailObj.childColumn.relationType = detailObj.type;//子集是栏目还是内容的type 放入列表中
          sonColumnList.push(detailObj.childColumn);
        }
      });
      yield put({
        type: 'saveDetailList',
        payload: response,
      });
      yield put({
        type: 'saveSonColumnList',
        payload: sonColumnList,
      });
      yield put({
        type: 'saveSonContentList',
        payload: sonContentList,
      });
    },

    *getSelectContent({ payload, callback }, { call, put }) {
      const response = yield call(getContentsByProduct, payload);
      yield put({
        type: 'saveSelectContent',
        payload: response,
      });
      if (callback) callback();
    },

    *delete({ payload, callback }, { call, put,select }) {
      const {productId,columnId} = yield select(state => state.relationModel);
      const response = yield call(deleteRelation, payload);
      if(response==undefined){
        message.warn('删除失败。接口返回异常。')
      }else{
        message.success('删除成功');
      }
      yield put({
        type: 'getColumnDetail',
        payload: {productId:productId,columnId:columnId},
      });
      if (callback) callback();
    },

    *add({ payload, callback }, { call, put,select }) {
      const {productId,columnId} = yield select(state => state.relationModel);
      const response = yield call(addRelation, payload);
      if(response==undefined){
        message.warn('新增失败。可能关联关系已存在。')
      }else{
        message.success('新增成功');
      }
      yield put({
        type: 'getColumnDetail',
        payload: {productId:productId,columnId:columnId},
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put,select }) {
      const {productId,columnId} = yield select(state => state.relationModel);
      const response = yield call(updateRelation, payload);
      if(response==undefined){
        message.warn('编辑失败，接口返回异常。')
      }else{
        message.success('编辑成功');
      }
      yield put({
        type: 'getColumnDetail',
        payload: {productId:productId,columnId:columnId},
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveProductList(state, action) {
      return {
        ...state,
        productList: action.payload,
      };
    },
    saveColumnList(state, action) {
      return {
        ...state,
        columnList: action.payload,
      };
    },
    saveDetailList(state, action) {
      return {
        ...state,
        detailList: action.payload,
      };
    },
    saveSonColumnList(state, action) {
      return {
        ...state,
        sonColumnList: action.payload,
      };
    },
    saveSonContentList(state, action) {
      return {
        ...state,
        sonContentList: action.payload,
      };
    },
    saveProductId(state, action) {
      return {
        ...state,
        productId: action.payload,
      };
    },
    saveColumnId(state, action) {
      return {
        ...state,
        columnId: action.payload,
      };
    },
    saveSelectContent(state, action) {
      return {
        ...state,
        selectContent: action.payload,
      };
    },
  },
};
