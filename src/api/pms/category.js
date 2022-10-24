import request from '@/utils/request'

// 获取分类列表
export function getList() {
    return request({
        url: '/category/list',
        method: 'get'
    });
}

export function save(data) {
    return request({
        url: '/category/save',
        method: 'post',
        data
    });
}

export function update(data) {
    return request({
        url: '/category/update',
        method: 'post',
        data
    });
}

export function del(data) {
    return request({
        url: `/category/del`,
        method: 'post',
        data
    });
}
