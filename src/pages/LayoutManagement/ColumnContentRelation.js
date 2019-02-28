import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Zmage from 'react-zmage';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table,
  Upload,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ColumnContentRelation.less';
import UploadPictures from '@/components/Self/UploadPictures';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleSubmit, handleModalVisible, onTypeChange, onPosterChange, current, productId, columnId, columnList, productList, selectContent } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      handleSubmit({
        ...fieldsValue,
      });
    });
  };

  return (
    <Modal
      destroyOnClose
      title={`${current.contentId ? '编辑' : '添加'}子${current.type == 1 ? '栏目' : '内容'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={'80%'}
    >
      <Row>
        <Col span={12}>
          <FormItem label="所属产品" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {form.getFieldDecorator('productId', { value: productId, initialValue: productId })(
              <Select style={{ width: '100%' }} value={productId} disabled>
                {productList.map(tmpObj => (<Option key={tmpObj.id} value={tmpObj.id}>{tmpObj.id + ' | ' + (tmpObj.name ? tmpObj.name : '')}</Option>))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="所属栏目" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {form.getFieldDecorator('columnId', { value: columnId, initialValue: columnId })(
              <Select style={{ width: '100%' }} value={columnId} disabled>
                {columnList.map(tmpObj => (<Option key={tmpObj.columnId} value={tmpObj.columnId}>{tmpObj.columnId + ' | ' + (tmpObj.name ? tmpObj.name : '')}</Option>))}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={`子${current.type == 1 ? '栏目' : '内容'}`}>
            {form.getFieldDecorator('contentId', {
              initialValue: current.contentId ? current.contentId : current.type == 1 ? columnId : selectContent[0] ? selectContent[0].contentId : '',
            })(current.type == 1 ?
              <Select style={{ width: '100%' }} value={columnId} disabled={!!current.contentId}>
                {columnList.map(tmpObj => (<Option key={tmpObj.columnId} value={tmpObj.columnId}>{tmpObj.columnId + ' | ' + (tmpObj.name ? tmpObj.name : '')}</Option>))}
              </Select>
              : <Select style={{ width: '100%' }} value={selectContent[0] ? selectContent[0].contentId : ''} disabled={!!current.contentId}>
                {selectContent.map(tmpObj => (<Option key={tmpObj.contentId} value={tmpObj.contentId}>{tmpObj.contentId + ' | ' + (tmpObj.name ? tmpObj.name : '')}</Option>))}
              </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="子集类型">
            {form.getFieldDecorator('type', {
              initialValue: current.type,
            })(
              <RadioGroup value={current.type} disabled>
                <Radio value={1}>栏目</Radio>
                <Radio value={0}>内容</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="位置">
            {form.getFieldDecorator('position', {
              initialValue: current.position ? current.position : '',
              rules: [
                {
                  required: false,
                  message: '位置为长度不大于9位的数字！',
                  max: 9,
                  pattern: '^[0-9]*$',
                },
              ],
              initialValue: current.position ? current.position + '' : '', //初始化值必须为string！！！
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ relationModel, loading }) => ({
  relationModel,
  loading: loading.models.relationModel,
}))
@Form.create()
class ColumnManage extends PureComponent {
  state = {
    modalVisible: false,
    productId: {},
    current: {},
    productList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'relationModel/fetch',
    });
    dispatch({
      type: 'relationModel/getProductList',
    });
  }

  columns = [
    {
      title: '栏目ID',
      key: 'columnId',
      dataIndex: 'columnId',
    },
    {
      title: '产品ID',
      key: 'productId',
      dataIndex: 'productId',
    },
    {
      title: '栏目名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '栏目类型',
      key: 'type',
      dataIndex: 'type',
      render: (value) => {
        if (value == 1) {
          return '游戏';
        } else if (value == 2) {
          return '视频';
        } else {
          return '其他';
        }
      },
    },
    {
      title: '栏目海报',
      key: 'poster',
      dataIndex: 'poster',
      render: (text, record) => (
        <Zmage src={text} style={{ width: 60, height: 45 }}></Zmage >
      ),
    },
    {
      title: '栏目链接',
      key: 'link',
      dataIndex: 'link',
    },
    {
      title: '栏目配置',
      key: 'options',
      dataIndex: 'options'
    },
    {
      title: '位置',
      key: 'position',
      dataIndex: 'position'
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.editAndDelete('edit', record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.editAndDelete('del', record)}>删除</a>
        </Fragment>
      ),
      fixed: 'right',
      width: 150,
    },
  ];

  contentColumns = [
    {
      title: '内容ID',
      key: 'contentId',
      dataIndex: 'contentId',
    },
    {
      title: '产品ID',
      key: 'productId',
      dataIndex: 'productId',
    },
    {
      title: '内容名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '内容类型',
      key: 'type',
      dataIndex: 'type',
      render: (value) => {
        if (value == 1) {
          return '游戏';
        } else if (value == 2) {
          return '视频';
        } else {
          return '其他';
        }
      },
    },
    {
      title: '内容海报',
      key: 'poster',
      dataIndex: 'poster',
      render: (text, record) => (
        text ? <Zmage src={text} style={{ width: 60, height: 45 }}></Zmage > : ''
      ),
    },
    {
      title: '内容图标',
      key: 'icon',
      dataIndex: 'icon',
      render: (text, record) => (
        text ? <Zmage src={text} style={{ width: 60, height: 45 }}></Zmage > : ''
      ),
    },
    {
      title: '内容截图',
      key: 'screenShot',
      dataIndex: 'screenShot',
      render: (text, record) => (
        text ? <Zmage src={text} style={{ width: 60, height: 45 }}></Zmage > : ''
      ),
    },
    {
      title: '内容链接',
      key: 'link',
      dataIndex: 'link',
    },
    {
      title: '内容提示',
      key: 'tip',
      dataIndex: 'tip',
    },
    {
      title: '内容配置',
      key: 'options',
      dataIndex: 'options'
    },
    {
      title: '位置',
      key: 'position',
      dataIndex: 'position'
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.editAndDelete('edit', record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.editAndDelete('del', record)}>删除</a>
        </Fragment>
      ),
      fixed: 'right',
      width: 120,
    },
  ];


  editAndDelete = (key, currentItem) => {
    if (key === 'edit') {
      this.showEditModal(currentItem);
    }
    if (key === 'del') {
      Modal.confirm({
        title: '删除栏目',
        content: `确定删除该关联关系吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.deleteItem(currentItem),
      });
    }
  };

  showEditModal = item => {
    const { relationModel: { productId, columnId } } = this.props;
    this.setState({
      modalVisible: true,
      current: { productId: productId, columnId: columnId, contentId: item.relationType == 1 ? item.columnId : item.contentId, type: item.relationType, position: item.position },
    });
  };

  deleteItem = item => {
    const { dispatch, relationModel: { productId, columnId } } = this.props;
    dispatch({
      type: 'relationModel/delete',
      payload: { productId: productId, columnId: columnId, contentId: item.relationType == 1 ? item.columnId : item.contentId, type: item.relationType, position: item.position },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      //重置 刷新表单
      type: 'relationModel/fetch',
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'relationModel/search',
        payload: fieldsValue,
      });
    });
  };

  handleModalVisible = (flag, type) => {
    const { relationModel, dispatch } = this.props;
    if ((!relationModel.productId) || (!relationModel.columnId)) {
      //当未选择产品id 栏目id时 不打开modal
      message.warn('请先选择产品和栏目');
      return;
    }
    this.setState({
      modalVisible: !!flag,
      current: {
        type: type//0子内容 1子栏目
      },
    });
  };

  handleSubmit = fieldsValue => {
    const { dispatch } = this.props;
    const { current } = this.state;
    if (current.contentId) {
      //编辑
      dispatch({
        type: 'relationModel/update',
        payload: fieldsValue,
      });
    } else {
      //新增
      dispatch({
        type: 'relationModel/add',
        payload: fieldsValue,
      });
    }

    this.handleModalVisible();
  };

  renderForm() {
    const {
      relationModel: { productList, columnList, columnId, productId },
      form: { getFieldDecorator },
      dispatch,
    } = this.props;
    const handleProductChange = (value) => {
      dispatch({
        type: 'relationModel/getColumnsByProduct',
        payload: { productId: value },
      });

      //查询产品下的内容
      dispatch({
        type: 'relationModel/getSelectContent',
        payload: { productId: value },
      });

      dispatch({
        type: 'relationModel/saveProductId',
        payload: value,
      });
    };
    const handleColumnChange = (value) => {
      dispatch({
        type: 'relationModel/getColumnDetail',
        payload: { productId: productId, columnId: value, }
      });
      dispatch({
        type: 'relationModel/saveColumnId',
        payload: value,
      });
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择产品" required >
              <Select style={{ width: '100%' }} onChange={handleProductChange} value={productId}>
                {productList.map(tmpObj => (<Option key={tmpObj.id} value={tmpObj.id}>{tmpObj.id + ' | ' + (tmpObj.name ? tmpObj.name : '')}</Option>))}
              </Select>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="选择栏目" required >
              <Select style={{ width: '100%' }} onChange={handleColumnChange} value={columnId}>
                {columnList.length == 0 ? '' : columnList.map(tmpObj => (<Option key={tmpObj.columnId} value={tmpObj.columnId}>{tmpObj.columnId + ' | ' + (tmpObj.name ? tmpObj.name : '')}</Option>))}
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      relationModel: { columnList, productList, detailList, sonColumnList, sonContentList, productId, columnId, selectContent },
      loading,
    } = this.props;
    const { modalVisible, current } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleSubmit: this.handleSubmit,
      onTypeChange: (e) => {
        this.setState({
          current: {
            ...current,
            type: e.target.value,
          },
        })
      },
      onPosterChange: (obj) => {
        this.setState({
          current: {
            ...current,
            poster: obj.fileList,
          },
        })
      }
    };
    const gridStyle = {
      width: '25%',
      textAlign: 'center',
    };
    const imgStyle = { width: '100%', height: '100%' };
    return (
      <PageHeaderWrapper title="栏目内容关系管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 1)}>
                添加子栏目
              </Button>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 0)}>
                添加子内容
              </Button>
            </div>
            <Table
              columns={this.columns}
              dataSource={sonColumnList}
              title={() => '子栏目列表'}
            />
            <Table
              columns={this.contentColumns}
              dataSource={sonContentList}
              title={() => '子内容列表'}
            />
            <Card title="布局预览">
              {detailList.map((obj) => (
                <Card.Grid style={gridStyle}><Zmage src={obj.poster} alt={`位置：${obj.position}`} style={imgStyle}></Zmage ></Card.Grid>
              ))}
            </Card>
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={current} columnList={columnList} productList={productList} productId={productId} columnId={columnId} selectContent={selectContent} />
      </PageHeaderWrapper>
    );
  }
}

export default ColumnManage;
