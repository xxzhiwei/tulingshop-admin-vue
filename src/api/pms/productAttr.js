import request from '@/utils/request'

// 获取属性列表
export function getList(params) {
    return request({
        url: `/attr/list`,
        method: 'get',
        params
    });
}
