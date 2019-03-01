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
  Spin,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ContentManagement.less';
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
  const { modalVisible, form, handleSubmit, handleModalVisible, onTypeChange, onPosterChange, onIconChange, onScreenshotChange, current, productList } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      if (!fieldsValue.contentId) {
        fieldsValue.contentId = (new Date().getTime().toString()).slice(0, 9);//mysql int max num is 2147483647!!
      }
      handleSubmit({
        ...fieldsValue,
        posterFile: current.posterFile && current.posterFile.length > 0 ? current.posterFile[0].originFileObj : '',//入参需是js File对象 antd pro 包了一层 其中的originFileObj是所需对象
        iconFile: current.iconFile && current.iconFile.length > 0 ? current.iconFile[0].originFileObj : '',
        screenShotFile: current.screenShotFile && current.screenShotFile.length > 0 ? current.screenShotFile[0].originFileObj : '',
      });
    });
  };

  return (
    <Modal
      destroyOnClose
      title={`${current.id ? '编辑' : '新建'}内容`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={'80%'}
    >
      <Row>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属产品" required>
            {form.getFieldDecorator('productId', {
              rules: [{ required: true, message: '请选择所属产品!' }],
              initialValue: current.productId ? current.productId : '',
            })(
              <Select style={{ width: '100%' }} disabled={current.productId ? true : false}>
                {productList.map(tmpObj => (<Option key={tmpObj.id} value={tmpObj.id}>{tmpObj.id + ' | ' + (tmpObj.name ? tmpObj.name : '')}</Option>))}
              </Select>
            )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容ID">
            {form.getFieldDecorator('contentId', {
              rules: [
                {
                  required: false,
                  message: '内容ID为长度不大于9位的数字！',
                  max: 9,
                  pattern: '^[0-9]*$',
                },
              ],
              initialValue: current.contentId ? current.contentId + '' : '', //初始化值必须为string！！！
            })(<Input disabled={current.contentId ? true : false} placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容名称">
            {form.getFieldDecorator('name', {
              rules: [{ required: false, message: '内容名称长度不大于45！', max: 45 }],
              initialValue: current.name,
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容类型">
            {form.getFieldDecorator('type', {
              initialValue: current.type,
            })(
              <RadioGroup onChange={onTypeChange}>
                <Radio value={1}>游戏</Radio>
                <Radio value={2}>视频</Radio>
                <Radio value={0}>其他</Radio>
              </RadioGroup>
            )}

          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容链接">
            {form.getFieldDecorator('link', {
              rules: [{ required: false, message: '内容链接长度不大于255！', max: 255 }],
              initialValue: current.link,
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容提示">
            {form.getFieldDecorator('tip', {
              rules: [{ required: false, message: '内容提示长度不大于255！', max: 255 }],
              initialValue: current.tip,
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容海报">
            {form.getFieldDecorator('poster', {})(
              <UploadPictures
                fileList={current.poster ? [{ url: current.poster, uid: -3 }] : []}
                onPictureChange={onPosterChange}
                maxPicNum={1} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容图标">
            {form.getFieldDecorator('icon', {})(
              <UploadPictures
                fileList={current.icon ? [{ url: current.icon, uid: -1 }] : []}
                onPictureChange={onIconChange}
                maxPicNum={1} />)}
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容截图">
            {form.getFieldDecorator('screenShot', {})(
              <UploadPictures
                fileList={current.screenShot ? [{ url: current.screenShot, uid: -2 }] : []}
                onPictureChange={onScreenshotChange}
                maxPicNum={1} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容配置">
            {form.getFieldDecorator('options', {
              rules: [{ required: false, message: '内容配置长度不大于255！', max: 255 }],
              initialValue: current.options,
            })(<TextArea rows={4} placeholder="请输入" />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ contentModel, loading }) => ({
  contentModel,
  loading: loading.models.contentModel,
}))
@Form.create()
class ContentManage extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    current: {},
    productList: []
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentModel/getProductList',
    });
  }

  columns = [
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
        <Zmage src={text} style={{ width: 60, height: 45 }}></Zmage >
      ),
    },
    {
      title: '内容图标',
      key: 'icon',
      dataIndex: 'icon',
      render: (text, record) => (
        <Zmage src={text} style={{ width: 60, height: 45 }}></Zmage >
      ),
    },
    {
      title: '内容截图',
      key: 'screenShot',
      dataIndex: 'screenShot',
      render: (text, record) => (
        <Zmage src={text} style={{ width: 60, height: 45 }}></Zmage >
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
        title: '删除内容',
        content: `确定删除
            ID为：${currentItem.contentId},
            名称为：${currentItem.name},
            的内容吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.deleteItem(currentItem),
      });
    }
  };

  showEditModal = item => {
    this.setState({
      modalVisible: true,
      current: item,
    });
  };

  deleteItem = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentModel/delete',
      payload: item,
      callback: () => {
        dispatch({
          type: 'contentModel/fetch',
          payload: item,
        })
      }
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
      type: 'contentModel/fetch',
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'contentModel/search',
        payload: fieldsValue,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      current: {
        productId: '',
        contentId: '',
        name: '',
        type: 1,
        link: '',
        tip: '',
        options: '',
      },
    });
  };

  handleSubmit = fieldsValue => {
    const { dispatch } = this.props;
    const { current } = this.state;
    if (current.contentId) {
      //编辑
      dispatch({
        type: 'contentModel/update',
        payload: fieldsValue,
        callback: () => {
          dispatch({
            type: 'contentModel/fetch',
            payload: fieldsValue,
          })
        }
      });
    } else {
      //新增
      dispatch({
        type: 'contentModel/add',
        payload: fieldsValue,
        callback: () => {
          dispatch({
            type: 'contentModel/fetch',
            payload: fieldsValue,
          })
          dispatch({
            type: 'contentModel/saveProductId',
            payload: fieldsValue.productId,
          });
        }
      });
    }
    this.handleModalVisible();
  };

  renderForm() {
    const {
      contentModel: { productList, productId },
      form: { getFieldDecorator },
      dispatch,
    } = this.props;
    const handleProductChange = (value) => {
      dispatch({
        type: 'contentModel/saveProductId',
        payload: value,
      });
      dispatch({
        type: 'contentModel/fetch',
      });
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="所属产品" required>
              <Select style={{ width: '100%' }} onChange={handleProductChange} value={productId}>
                {productList.map(tmpObj => (<Option key={tmpObj.id} value={tmpObj.id}>{tmpObj.id + ' | ' + (tmpObj.name ? tmpObj.name : '')}</Option>))}
              </Select>
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="内容ID">
              {getFieldDecorator('contentId')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="内容名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      contentModel: { data, productList },
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
            posterFile: obj.fileList,
          },
        })
      },
      onIconChange: (obj) => {
        this.setState({
          current: {
            ...current,
            iconFile: obj.fileList,
          },
        })
      },
      onScreenshotChange: (obj) => {
        this.setState({
          current: {
            ...current,
            screenShotFile: obj.fileList,
          },
        })
      }
    };
    return (
      <PageHeaderWrapper title="内容管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <Spin spinning={loading}>
              <Table
                rowKey="contentId"
                columns={this.columns}
                dataSource={data}
              // pagination={{defaultPageSize:5}}
              />
            </Spin>
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={current} productList={productList} />
      </PageHeaderWrapper>
    );
  }
}

export default ContentManage;
