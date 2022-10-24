import request from '@/utils/request'

// 获取规格属性分组列表
export function getListByCategoryId(params) {
    return request({
        url: `/attrGroup/categoryId/${params.categoryId}/list`,
        method: 'get'
    });
}

export function getList(params) {
    return request({
        url: `/attrGroup/list`,
        method: 'get',
        params
    });
}

export function getPagination(params) {
    return request({
        url: `/attrGroup/pagination`,
        method: 'get',
        params
    });
}

export function save(params) {
    return request({
        url: '/attrGroup/save',
        method: 'post',
        data: params
    });
}

export function update(params) {
    return request({
        url: '/attrGroup/update',
        method: 'post',
        data: params
    });
}

export function del(params) {
    return request({
        url: `/attrGroup/del`,
        method: 'post',
        data: params
    });
}
