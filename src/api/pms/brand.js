import request from '@/utils/request'

// 获取品牌列表
export function getList() {
    return request({
        url: '/brand/list',
        method: 'get'
    });
}
