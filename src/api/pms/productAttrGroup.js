import request from '@/utils/request'

// 获取规格属性分组列表
export function getList(params) {
    return request({
        url: `/attrGroup/list`,
        method: 'get',
        params
    });
}
