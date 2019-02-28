import { Upload, Icon, Modal } from 'antd';

class UploadPictures extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    maxPicNum: 1,
    //fileList例子
    // {
    //   uid: '-1',//必填项
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // }
    fileList: [],
  };

  constructor(props) {
    super(props);
    this.state = { fileList: props.fileList?props.fileList: []};
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    this.props.onPictureChange({ fileList });
  }

render() {
  const { previewVisible, previewImage } = this.state;
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">请选择图片</div>
    </div>
  );
  return (
    <div className="clearfix">
      <Upload
        listType="picture-card"
        fileList={this.state.fileList}
        onPreview={this.handlePreview}
        onChange={this.handleChange}
      >
        {this.state.fileList.length >= this.props.maxPicNum ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
}
export default UploadPictures;
