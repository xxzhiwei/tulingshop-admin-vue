import request from '@/utils/request';

// 获取分页
export function getPagination(params) {
    return request({
        url: '/order/pagination',
        method: 'get',
        params
    });
}

export function getDetail(id) {
    return request({
        url: `/order/detail/${id}`,
        method: 'get'
    });
}