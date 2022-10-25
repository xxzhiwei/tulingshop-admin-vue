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

/**
 * 在树形结构中查询符合条件的值（包括其上级父类的值）【即会返回一组value】
 * @param {Function} pattern 匹配规则
 * @param {Array} list 树形结构
 * @param {Object} options 默认情况下，读取属性为「key」；子结构为「children」
 */
export function findKeys(pattern, list, options={}) {
    options = Object.assign({ key: "id", children: "children" }, options);
    let matched = false;
    let result = [];
    let values = [];
    let deep = 0;

    // _deep保存了当前层的上一层的深度
    function run(list, _deep) {
        for (let i=0; i<list.length; i++) {
            const item = list[i];
            deep = _deep;
            values[_deep] = item[options.key];
            if (pattern(item)) {
                matched = true;
                result = values.slice(0, _deep + 1);
                break;
            }
            else {
                if (matched) {
                    break;
                }
                if (list[i].children) {
                    deep++;
                    run(item[options.children], deep);
                }
            }
        }
    }
    run(list, deep);

    return result;
}