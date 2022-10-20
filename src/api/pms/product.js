import request from '@/utils/request'

// 获取产品分页
export function getPagination(query) {
    return request({
        url: '/product/pagination',
        method: 'get',
        params: query
    });
}
