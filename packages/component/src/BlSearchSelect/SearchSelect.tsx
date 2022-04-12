import React, { useEffect, useRef, useState } from 'react';
import { Select as AntSelect, Spin, Empty } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { debounce, isEmpty, get } from 'lodash';
import { BlSearchSelectProps, BlSearchSelectFormatterData } from './index.type';
import { OptionsType } from 'rc-select/lib/interface/index.d';

const DEFAULT_HEIGHT = 256; // 默认选择框高度
const DEVIATION_HEIGHT = 20; // 下拉到底偏移高度
const DEFAULT_PAGESIZE = 50; // 默认分页

const BlSearchSelect = <VT extends SelectValue = SelectValue>(props: BlSearchSelectProps<VT>) => {
  const {
    notFoundContent,
    params: propsParmas,
    fetchFn,
    formatter,
    onDropdownVisibleChange,
    onPopupScroll,
    onChange,
    ...resProps
  } = props;

  const [options, setOptions] = useState<OptionsType | any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOptions([]);
  }, [propsParmas]);

  const searchParamsRef = useRef('');
  const pageRef = useRef(1);
  const totalRef = useRef(0);

  const fetchData = async (
    searchParams: string,
    page: number = 0,
  ): Promise<BlSearchSelectFormatterData> => {
    const newParams = { searchParams, page, size: DEFAULT_PAGESIZE, ...propsParmas };

    try {
      const res = await fetchFn(newParams);
      return formatter(res);
    } catch (error) {
      return { total: totalRef.current, options: [] };
    }
  };

  /**
   * 重置查询内容相关信息 options,searchParams,page
   */
  const resetSearchInfo = (searchParams: string) => {
    setOptions([]);
    searchParamsRef.current = searchParams;
    pageRef.current = 1;
    totalRef.current = 0;
  };

  /**
   * 滚动请求数据
   * @param page
   */
  const scrollFetchData = async (searchParams: string, page: number) => {
    if (options.length < totalRef.current) {
      setLoading(true);
      setOptions([
        ...options,
        {
          label: <Spin size="small" />,
        },
      ]);
      const { options: newOptions, total } = await fetchData(searchParams, page);

      setOptions([...options, ...newOptions]);
      pageRef.current = page;
      totalRef.current = total;
      setLoading(false);
    }
  };

  const handlePopupScroll = debounce((e) => {
    const scrollTop = get(e, ['target', 'scrollTop']);
    const scrollHeight = get(e, ['target', 'scrollHeight']);
    const isLast = scrollTop + DEFAULT_HEIGHT + DEVIATION_HEIGHT >= scrollHeight;
    if (isLast && !loading) scrollFetchData(searchParamsRef.current, pageRef.current + 1);

    // 处理原有事件回调
    if (typeof onPopupScroll === 'function') onPopupScroll(e);
  }, 200);

  const handleSearch = debounce(async (searchParams: string = '') => {
    setLoading(true);
    resetSearchInfo(searchParams);

    const { options, total } = await fetchData(searchParams, pageRef.current);
    setOptions(options);
    totalRef.current = total;
    setLoading(false);
  }, 800);

  /**
   * onChange处理
   * @param value
   */
  const handleChange = (value, options) => {
    if (!value) resetSearchInfo('');

    if (typeof onChange === 'function') onChange(value, options);
  };

  const handleDropdownVisibleChange = (open) => {
    if (open && isEmpty(options)) {
      handleSearch('');
    }
    // 处理原有事件回调
    if (typeof onDropdownVisibleChange === 'function') {
      if (open) handleSearch('');
      onDropdownVisibleChange(open);
    }
  };

  const renderNotFoundContent = () => {
    if (loading) {
      if (notFoundContent) return notFoundContent;
      return <Spin size="small" />;
    }
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  };

  return (
    <AntSelect
      allowClear
      showSearch
      filterOption={false}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      onPopupScroll={(e) => {
        e.persist();
        handlePopupScroll(e);
      }}
      options={options}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={renderNotFoundContent()}
      {...resProps}
    />
  );
};

export default BlSearchSelect;
