import React, { useEffect, useState } from 'react';
import { message, Upload, Modal, UploadProps } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import _ from 'lodash';
//
import { getBase64 } from './utils';
import { BlUploadProps, FileType } from './index.type';
import './style.less';

const getFileExt = (fileName: string | undefined) => {
  if (!fileName) {
    return '';
  }
  const result = fileName.split('.');

  return result[result.length - 1];
};

const isImageFile = (file: UploadFile) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type!)
  || ['jpeg', 'jpg', 'png'].includes(getFileExt(file.name));
const isAudioFile = (file: UploadFile) => file.type?.startsWith('audio/')
  || ['mp3', 'wav', 'wma', 'mpeg', 'aac', 'midi', 'cda'].includes(getFileExt(file.name));
const isVideoFile = (file: UploadFile) => file.type?.startsWith('video/')
  || ['mp4', 'avi', 'asf', 'rmvb', 'mov', 'flv', 'm4v', 'f4v', 'wmv'].includes(getFileExt(file.name));
const isCompressedFile = (file: UploadFile) => ['application/x-rar'].includes(file.type!)
  || ['rar'].includes(getFileExt(file.name));
const isPdf = (file: UploadFile) => file.type === 'application/pdf'
  || ['pdf'].includes(getFileExt(file.name));
const isXLSX = (file: UploadFile) => file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  || ['xlsx'].includes(getFileExt(file.name));
const isDoc = (file: UploadFile) => [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/wps-writer'
  ].includes(file.type!) || ['doc', 'docx'].includes(getFileExt(file.name));

const isDocumentFile = (file: UploadFile) => {
  return isDoc(file) || isXLSX(file) || isPdf(file);
};
function checkSingleFileLimit(limit: FileType, file: UploadFile) {
  if (limit === 'image' && !isImageFile(file)) {
    return '.jpg/.png/.jpeg';
  }
  if (limit === 'pdf' && !isPdf(file)) {
    return '.pdf';
  }
  if (limit === 'doc' && !isDoc(file)) {
    return '.doc/.docx';
  }
  if (limit === 'xlsx' && !isXLSX(file)) {
    return '.xlsx';
  }
  if (limit === 'attach' && !(isImageFile(file) || isPdf(file) || isXLSX(file) || isCompressedFile(file))) {
    return '.jpg/.png/.jpeg/.pdf/.xlsx/.rar';
  }
  if (limit === 'document' && !isDocumentFile(file)) {
    return '文档';
  }
  if (limit === 'audio' && !isAudioFile(file)) {
    return '音频';
  }
  if (limit === 'video' && !isVideoFile(file)) {
    return '视频';
  }
  if (limit === 'compressed' && !isCompressedFile(file)) {
    return '压缩包';
  }
  // 返回空字符串表示通过了类型校验
  return '';
}

const BlUpload: React.FC<BlUploadProps> = (props) => {
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
  const [previewDownloadUrl, setPreviewDownloadUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');


  // 判断文件类型和大小
  const judge = (file: UploadFile, files?: Array<UploadFile>) => {
    if (!file) {
      return {};
    }
    const convert = 1024 * 1024;
    const fileSize = file.size || 0;

    if (limit) {
      const supportedFileTypes: string[] = [];
      if (_.isArray(limit)) {
        (limit as FileType[]).forEach(lmt => {
          supportedFileTypes.push(checkSingleFileLimit(lmt, file));
        })
      } else {
        supportedFileTypes.push(checkSingleFileLimit(limit as FileType, file));
      }
      // 没有通过任意一个类型校验，则报错
      if (!supportedFileTypes.some(item => item === '')) {
        return { message: `附件只支持 ${_.uniq(supportedFileTypes).join('/')} 类型`, res: false };
      }
    }

    if (fileSize / convert > maxSize) {
      return {
        message: `文件大小不可以超过 ${maxSize}M`,
        res: false,
      };
    }
    if (_.reduce(files, (sum, n: any) => sum + n.size, 0) / convert > totalMaxSize) {
      return {
        message: `文件总大小不可以超过 ${totalMaxSize}M`,
        res: false,
      };
    }

    return { res: true };
  };

  const handlePreview = async (file: any) => {
    if (!canPreview) {
      return;
    }
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    // 图片文件支持预览
    if (isImageFile(file)) {
      setPreviewImage(file.url || file.preview);
      setPreviewDownloadUrl('');
    }
    // 其他类型文件不支持预览，只能下载查看
    else {
      setPreviewDownloadUrl(file.url || file.preview);
      setPreviewImage('');
    }
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    setPreviewVisible(true);
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
        {previewImage && <img style={{ width: '100%' }} src={previewImage} />}
        {previewDownloadUrl && <span>该文件类型暂不支持预览，请<a href={previewDownloadUrl} download={previewTitle}>下载</a>后查看。</span>}
      </Modal>
    );
  };

  if (draggable) {
    return (
      <>
        <Upload.Dragger style={{ display: node ? 'block' : 'none' }} {...option}>
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
