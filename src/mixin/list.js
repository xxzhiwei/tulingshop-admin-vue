/**
 * 跟数据列表页相关的一些方法；
 * - 搜索条件重置：resetQuery
 * - 根据搜索条件查询：search
 * - 监听分页数据大小：handleSizeChange
 * - 监听当前页码：handleCurrentChange
 * @notice 
 * - 请确保分页的参数是【current（当前分页）、size（每页数据条数）】
 * - 请确保获取分页的方法名称为：getPagination
 */
export default {
    methods: {
        getPagination(listQuery) {
            throw new Error('请在使用该mixin处重写getPagination()');
        },
        // 请提供一个默认的listQuery以供重置
        resetListQuery() {
            this.listQuery = Object.assign({}, this.defaultListQuery);
            for (const key in this.defaultListQuery) {

                // 若key为：this:type（this:array、this:object等），则按照下面的逻辑来重置
                if (key.startsWith('this:')) {
                    const arr = key.split(':');
                    if (arr.length !== 2) {
                        this.listQuery[key] = this.defaultListQuery[key];
                    }
                    else {
                        if (arr[1] == 'array') {
                            this[this.defaultListQuery[key]] = [];
                        }
                    }
                }
                else {
                    this.listQuery[key] = this.defaultListQuery[key];
                }
            }
            this.listQuery.current = 1;
            this.listQuery.size = 10;
        },
        search() {
            this.getPagination();
        },
        handleSizeChange(value) {
            this.listQuery.current = 1;
            this.listQuery.size = value;
        },
        handleCurrentChange(value) {
            this.listQuery.current = value;
        },
    }
}