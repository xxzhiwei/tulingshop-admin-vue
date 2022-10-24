import request from '@/utils/request';

// 获取分页
export function getPagination(params) {
    return request({
        url: '/brand/pagination',
        method: 'get',
        params
    });
}

// 获取列表
export function getList() {
    return request({
        url: '/brand/list',
        method: 'get'
    });
}

export function save(params) {
    return request({
        url: '/brand/save',
        method: 'post',
        data: params
    });
}

export function update(params) {
    return request({
        url: '/brand/update',
        method: 'post',
        data: params
    });
}

export function del(params) {
    return request({
        url: `/brand/del`,
        method: 'post',
        data: params
    });
}
