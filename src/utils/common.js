// 获取俩数字列表的差集【若c1中的元素不存在于c2中，则将其返回】
export function getDifference(c1, c2) {
    const result = [];
    for (const c1Item of c1) {
        const index = c2.findIndex(c2Item => c2Item === c1Item);
        if (index === -1) {
            result.push(c1Item);
        }
    }
    return result;
}

// 复制属性
export function copyProperties(source, target) {
    for (const key in target) {
        const value = source[key];
        if (!value) {
            continue;
        }
        const type = typeof value;
        switch (type) {
            case "number":
            case "string":
            case "boolean":
            case "null":
                target[key] = value;
                break;
            case "object":
                target[key] = JSON.parse(JSON.stringify(value));
                break;
        }
    }
    return target;
}

/**
 * 延迟函数
 * @param delay 延迟时间(s)
 */
export function timeout(delay) {
    return new Promise(resolve => {
        const timer = setTimeout(() => {
            clearTimeout(timer)
            resolve()
        }, delay * 1000)
    })
}

export function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
}

// 获取数据类型
export function getType(data) {
    return Object.prototype.toString.call(data).replace(/\[.*?\s(.*?)\]/, '$1')
}