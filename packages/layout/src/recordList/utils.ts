import { BlUrl } from '@blacklake-web/utils';
//
import { ListLayoutQueryParams } from './recordListLayout.type';

export const getRecordListUrlParams = (): ListLayoutQueryParams => {
  const urlParams = BlUrl.getParams();

  const afterParseParams = {
    filterData: urlParams?.filterData && JSON.parse(urlParams.filterData),
    quickFilterData: urlParams?.quickFilterData && JSON.parse(urlParams.quickFilterData),
    pagination: urlParams?.pagination && JSON.parse(urlParams.pagination),
    sorter: urlParams?.sorter && JSON.parse(urlParams.sorter),
  };

  return afterParseParams;
};

export const setRecordListUrlParams = (params: ListLayoutQueryParams) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { filterData, quickFilterData, pagination, sorter, ...rest } = BlUrl.getParams();

  BlUrl.setParams({
    filterData: params?.filterData && JSON.stringify(params.filterData),
    quickFilterData: params?.quickFilterData && JSON.stringify(params.quickFilterData),
    pagination: params?.pagination && JSON.stringify(params.pagination),
    sorter: params?.sorter && JSON.stringify(params.sorter),
    ...rest,
  });
};
