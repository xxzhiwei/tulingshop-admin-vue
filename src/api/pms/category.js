import request from '@/utils/request'

// 获取分类列表
export function getList() {
    return request({
        url: '/category/list',
        method: 'get'
    });
}
