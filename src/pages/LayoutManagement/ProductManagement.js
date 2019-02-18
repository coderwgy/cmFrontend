import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ProductManagement.less';

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
  const { modalVisible, form, handleSubmit, handleModalVisible, current } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      handleSubmit(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={`${current.id ? '编辑' : '新建'}产品`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品ID">
        {form.getFieldDecorator('id', {
          rules: [
            {
              required: false,
              message: '产品ID为长度不大于11位的数字！',
              max: 11,
              pattern: '^[0-9]*$',
            },
          ],
          initialValue: current.id ? current.id + '' : '', //初始化值必须为string！！！
        })(<Input disabled={current.id ? true : false} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: false, message: '产品名称长度不大于45！', max: 45 }],
          initialValue: current.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品配置">
        {form.getFieldDecorator('options', {
          rules: [{ required: false, message: '产品配置长度不大于255！', max: 255 }],
          initialValue: current.options,
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ productModel, loading }) => ({
  productModel,
  loading: loading.models.productModel,
}))
@Form.create()
class ProductManage extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    current: {},
  };

  columns = [
    {
      title: '产品ID',
      dataIndex: 'id',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      title: '产品配置',
      dataIndex: 'options',
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
    },
  ];

  editAndDelete = (key, currentItem) => {
    if (key === 'edit') {
      this.showEditModal(currentItem);
    }
    if (key === 'del') {
      Modal.confirm({
        title: '删除产品',
        content: `确定删除
            ID为：${currentItem.id},
            名称为：${currentItem.name},
            的产品吗？`,
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
      type: 'productModel/delete',
      payload: item,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productModel/fetch',
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      //重置 刷新表单
      type: 'productModel/fetch',
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'productModel/search',
        payload: fieldsValue,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      current: {},
    });
  };

  handleSubmit = fieldsValue => {
    const { dispatch } = this.props;
    const { current } = this.state;
    if (current.id) {
      //编辑
      dispatch({
        type: 'productModel/update',
        payload: fieldsValue,
      });
      message.success('编辑成功');
    } else {
      //新增
      dispatch({
        type: 'productModel/add',
        payload: fieldsValue,
      });
      message.success('新增成功');
    }

    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'productModel/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="产品ID">
              {getFieldDecorator('id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      productModel: { data },
      loading,
    } = this.props;
    const { modalVisible, current } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleSubmit: this.handleSubmit,
    };
    return (
      <PageHeaderWrapper title="产品管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <Table
              columns={this.columns}
              dataSource={data}
              // pagination={{defaultPageSize:5}}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={current} />
      </PageHeaderWrapper>
    );
  }
}

export default ProductManage;
