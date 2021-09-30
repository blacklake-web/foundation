import React, { useEffect, useState } from 'react';
import { message, Upload, Modal, UploadProps } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import _ from 'lodash';
//
import { getBase64 } from './utils';
import { BlUploadProps } from './index.type';
import './style.less';

type UploadPropsOmit = Omit<UploadProps, 'onChange'>

const BlUpload: React.FC<BlUploadProps & UploadPropsOmit> = (props) => {
  const {
    defaultFiles,
    draggable = false,
    limit,
    children,
    totalMaxSize = Infinity,
    maxSize = Infinity,
    maxCount = Infinity,
    autoDelErrorFile,
    canPreview = false,
    overCountNode = null,
    onChange,
    onUploaded,
    ...rest
  } = props;
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const getFileExt = (fileName: string) => {
    const result = fileName.split('.');

    return result[result.length - 1];
  };

  // 判断文件类型和大小
  const judge = (file: UploadFile, files?: Array<UploadFile>) => {
    if (!file) {
      return {};
    }
    const convert = 1024 * 1024;
    const fileType = file.type || null;
    const fileSize = file.size || 0;
    const extension = file?.name ? getFileExt(file.name) : '';

    const isImage =
      fileType === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
    const isPDF = fileType === 'application/pdf';
    const isXLSX =
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      extension === 'xlsx';
    const isRAR = fileType === 'application/x-rar';
    const isDoc =
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword' ||
      fileType === 'application/wps-writer' ||
      extension === 'doc' ||
      extension === 'docx';

    if (!limit) {
      return {
        res: true,
      };
    }
    if (limit === 'image' && !isImage) {
      return {
        message: '附件只支持.jpg/.png/.jpeg类型',
        res: false,
      };
    }
    if (limit === 'pdf' && !isPDF) {
      return {
        message: '附件只支持.pdf类型',
        res: false,
      };
    }
    if (limit === 'doc' && !isDoc) {
      return {
        message: '附件只支持.doc/.docx类型',
        res: false,
      };
    }
    if (limit === 'xlsx' && !isXLSX) {
      return {
        message: '附件只支持.xlsx类型',
        res: false,
      };
    }
    if (!(isImage || isPDF || isXLSX || isRAR)) {
      return {
        message: '附件只支持.jpg/.png/.jpeg/.pdf/.xlsx/.rar类型',
        res: false,
      };
    }

    if (fileSize / convert > maxSize) {
      return {
        message: `文件大小不可以超过“${maxSize}M”`,
        res: false,
      };
    }
    if (_.reduce(files, (sum, n: any) => sum + n.size, 0) / convert > totalMaxSize) {
      return {
        message: `文件总大小不可以超过“${totalMaxSize}M”`,
        res: false,
      };
    }

    return {
      res: true,
    };
  };

  const handlePreview = async (file: any) => {
    if (!canPreview) {
      return;
    }
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = (e: any) => {
    const { file } = e;

    if (!judge(file, e.fileList).res) {
      return false;
    }
    if (file.status === 'error') {
      message.error(`文件“${file.name}”上传失败`);
    }
    let result = e.fileList;

    if (autoDelErrorFile) {
      // 自动删除错误文件
      result = e.fileList.filter(({ status }: any) => status !== 'error');
    }
    setFileList(result);
    onChange?.(result);
    if (!e.fileList.find(({ status }: any) => status === 'uploading')) {
      onUploaded?.(result);
    }
    return true;
  };

  // 文件上传之前的hook
  const beforeUpload = (file: UploadFile, fileList: Array<UploadFile>) => {
    const judgeResult = judge(file, fileList) || {};

    if (judgeResult.res) {
      return true;
    }
    if (judgeResult.message) {
      message.error(judgeResult.message);
    }
    return false;
  };

  const option: UploadProps<any> = {
    className: 'bl-attach-uploadd',
    action: `feat/holyfile/domain/web/v1/file/_upload`,
    beforeUpload,
    fileList,
    maxCount,
    onChange: handleChange,
    onPreview: handlePreview,
    ...rest,
  };
  const node = fileList.length >= maxCount ? overCountNode : children;

  useEffect(() => {
    setFileList(defaultFiles || []);
  }, [defaultFiles]);

  const renderPreview = () => {
    return (
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    );
  };

  if (draggable) {
    return (
      <>
        <Upload.Dragger
          style={{ display: node ? 'block' : 'none' }}
          {...option}
        >
          {node}
        </Upload.Dragger>
        {renderPreview()}
      </>
    );
  }
  return (
    <>
      <Upload {...option}>{node}</Upload>
      {renderPreview()}
    </>
  );
};

export { BlUpload };
