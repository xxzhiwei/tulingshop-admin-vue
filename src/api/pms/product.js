import request from '@/utils/request'

// 获取分页
export function getPagination(query) {
    return request({
        url: '/product/pagination',
        method: 'get',
        params: query
    });
}

export function save(params) {
    return request({
        url: '/product/save',
        method: 'post',
        data: params
    });
}

export function update(params) {
    return request({
        url: '/product/update',
        method: 'post',
        data: params
    });
}

// 获取详情
export function getDetail(id) {
    return request({
        url: `/product/detail/${id}`,
        method: 'get'
    });
}

// 下架
export function remove(params) {
    return request({
        url: `/product/remove`,
        method: 'post',
        data: params
    });
}

// 上架
export function publish(params) {
    return request({
        url: `/product/publish`,
        method: 'post',
        data: params
    });
}

export function del(params) {
    return request({
        url: `/product/del`,
        method: 'post',
        data: params
    });
}