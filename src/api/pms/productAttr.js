import request from '@/utils/request'

// 获取属性列表
export function getList(params) {
    return request({
        url: `/attr/list`,
        method: 'get',
        params
    });
}

export function getPagination(params) {
    return request({
        url: `/attr/pagination`,
        method: 'get',
        params
    });
}

export function save(params) {
    return request({
        url: '/attr/save',
        method: 'post',
        data: params
    });
}

export function update(params) {
    return request({
        url: '/attr/update',
        method: 'post',
        data: params
    });
}

export function del(params) {
    return request({
        url: `/attr/del`,
        method: 'post',
        data: params
    });
}
