import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Card,
    message,
    Modal,
} from 'antd';
const FormItem = Form.Item;

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ ftpModel, loading }) => ({
    ftpModel,
    loading: loading.models.productModel,
}))
@Form.create()
class FTPConfig extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'ftpModel/fetch',
        });
    }

    render() {
        const {
            form: { getFieldDecorator },
            ftpModel:{ data },
            form,
        } = this.props;

        const save = () => {
            Modal.confirm({
                title: '修改FTP配置',
                content: `确定修改吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        form.resetFields();
        
                        const { dispatch } = this.props;
                        dispatch({
                            type: 'ftpModel/update',
                            payload: fieldsValue,
                          });
                          message.success('修改成功');
                    }); 
                },
              });
        }

        return (
            <PageHeaderWrapper title="FTP配置">
                <Card bordered={false}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="地址">
                        {form.getFieldDecorator('host', {
                            rules: [{ required: false, message: '地址长度不大于255！', max: 255 }],
                            initialValue: data.host,
                        })(<Input placeholder="请输入" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="端口">
                        {form.getFieldDecorator('port', {
                            rules: [
                                {
                                    required: false,
                                    message: '端口为长度不大于11位的数字！',
                                    max: 11,
                                    pattern: '^[0-9]*$',
                                },
                            ],
                            initialValue: data.port ? data.port + '' : '', //初始化值必须为string！！！
                        })(<Input placeholder="请输入" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
                        {form.getFieldDecorator('username', {
                            rules: [{ required: false, message: '用户名长度不大于45！', max: 45 }],
                            initialValue: data.username,
                        })(<Input placeholder="请输入" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
                        {form.getFieldDecorator('password', {
                            rules: [{ required: false, message: '密码长度不大于45！', max: 45 }],
                            initialValue: data.password,
                        })(<Input placeholder="请输入" />)}
                    </FormItem>
                    <Row>
                        <Col span={4} offset={10}>
                            <Button type="primary" block onClick={save}>
                                保存配置
                        </Button>
                        </Col>
                    </Row>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default FTPConfig;