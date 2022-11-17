<template>
    <div class="app-container">
        <el-card style="margin-bottom: 20px;" :body-style="{ 'padding-bottom': '2px' }">
            <el-form :inline="true" size="mini">
                <el-form-item label="名称">
                    <el-input v-model="listQuery.keyword" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="货号">
                    <el-input v-model="listQuery.productSn" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-cascader
                        style="width: 168px;"
                        v-model="categoryIds"
                        :options="categoryList"
                        @change="handleCascaderChange" :props="categoryProps"></el-cascader>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select style="width: 168px;" v-model="listQuery.brandId" placeholder="请选择" clearable>
                        <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上架状态">
                    <el-select style="width: 168px;" v-model="listQuery.publishStatus" placeholder="请选择" clearable>
                        <el-option v-for="item in publishStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="审核状态">
                    <el-select style="width: 168px;" v-model="listQuery.verifyStatus" placeholder="请选择" clearable>
                        <el-option v-for="item in verifyStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetListQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        
        <el-card>
            <div slot="header" class="clearfix">
                <el-link icon="el-icon-tickets">数据列表</el-link>
                <el-button style="float: right; padding: 3px 0; margin-left: 10px;" type="text" @click="remove()">
                    下架
                </el-button>
                <el-button style="float: right; padding: 3px 0;" type="text" @click="publish()">
                    发布
                </el-button>
                <el-button style="float: right; padding: 3px 0;" type="text" @click="addOrEdit()">
                    添加
                </el-button>
            </div>
            <el-table ref="list" :data="list" style="width: 100%" border>
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="图片" width="120" align="center">
                    <template slot-scope="scope">
                        <el-image fit="contain" style="width: 80px; height: 80px" :src="scope.row.pic"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="名称" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.name}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="品牌" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.brandName}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="预估价格" align="center" prop="price">
                    <template slot-scope="scope">￥{{scope.row.price}}</template>
                </el-table-column>
                <el-table-column label="货号" width="120" align="center" prop="productSn"></el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag size="small" :type="scope.row.publishStatus | publishStatusTagTypeFilter">{{scope.row.publishStatus | publishStatusTextFilter}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button size="mini" @click="addOrEdit(scope.row)">编辑
                            </el-button>
                            <el-button size="mini" type="danger" @click="del(scope.row)">删除
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <div style="text-align: right; margin-top: 10px;">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total,sizes,prev,pager,next,jumper" :page-size="listQuery.size" :page-sizes="[5,10,20]" :current-page.sync="listQuery.current" :total="total"></el-pagination>
        </div>
    </div>
</template>
<script>
import { getPagination, remove, publish, del } from "@/api/pms/product";
import { getList as getBrandList } from "@/api/pms/brand";
import { getList as getCategoryList } from "@/api/pms/category";
import listMixin from '@/mixin/list';

const defaultListQuery = {
    keyword: null,
    current: 1,
    size: 5,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    categoryId: null,
    brandId: null,
};

const UN_PUBLISHED = 0;
const PUBLISHED = 1;
const REMOVEED = 2;

export default {
    name: "productList",
    mixins: [listMixin],
    data() {
        return {
            defaultListQuery: {...defaultListQuery, 'this:array': 'categoryIds'},
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            brandList: [],
            categoryList: [],
            categoryProps: {
                value: 'id',
                label: 'name',
            },
            total: null,
            categoryIds: [],
            PUBLISHED,
            REMOVEED, UN_PUBLISHED,
            publishStatusOptions: [
                {
                    value: UN_PUBLISHED,
                    label: "未发布",
                },
                {
                    value: PUBLISHED,
                    label: "上架",
                },
                {
                    value: REMOVEED,
                    label: "下架",
                },
            ],
        };
    },
    created() {
        this.getPagination();
        this.getBrandList();
        this.getCategoryList();
    },
    filters: {
        publishStatusTextFilter(value) {
            if (value === 1) {
                return "已上架";
            }
            else if (value === 2) {
                return "已下架";
            }
            else {
                return "未发布";
            }
        },
        publishStatusTagTypeFilter(value) {
            if (value === 1) {
                return "";
            }
            else if (value === 2) {
                return "danger";
            }
            else {
                return "warning";
            }
        },
    },
    methods: {
        async getPagination() {
            const resp = await getPagination(this.listQuery);
            if (resp.code !== 0) {
                return this.$message.error("获取数据失败");
            }
            this.list = resp.data.records;
            this.total = resp.data.total;
        },
        async getBrandList() {
            const resp = await getBrandList();
            if (resp.code !== 0) {
                return this.$message.error("获取品牌列表失败");
            }
            this.brandList = resp.data;
        },
        async getCategoryList() {
            const resp = await getCategoryList();
            if (resp.code !== 0) {
                return this.$message.error("获取分类列表失败");
            }
            this.categoryList = resp.data;
        },
        handleCascaderChange(value) {
            if (value && value.length) {
                this.listQuery.categoryId = value[value.length - 1];
            }
        },
        addOrEdit(row) {
            // 若要使用$router.push的params传参数，则不可适用path（会忽略params）
            this.$router.push({ 
                path: "/pms/product/add-or-edit" + (row ? `/${row.id}` : "")
            });
        },
        del(row) {
            this.$confirm("确认删除吗？", "提示")
            .then(async () => {
                const resp = await del({ id: row.id });
                if (resp.code !== 0) {
                    return this.$message.error("操作失败：" + resp.message);
                }
                this.$message.success("操作失败");
                this.getPagination();
            });
        },
        remove() {
            let checked = this.$refs.list.selection;
            if (!checked.length) {
                return this.$message.warning("请选择数据");
            }
            const matched = checked.every(item => item.publishStatus === PUBLISHED);
            if (!matched) {
                return this.$message.warning("请选择已上架的数据");
            }
            
            this.$confirm("确认下架吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                const resp = await remove({ ids: checked.map(item => item.id)});
                if (resp.code !== 0) {
                    return this.$message.error("操作失败：" + resp.message);
                }
                this.$message.success("操作成功");
                this.getPagination();
            });
        },
        publish() {
            let checked = this.$refs.list.selection;
            if (!checked.length) {
                return this.$message.warning("请选择数据");
            }
            const matched = checked.every(item => item.publishStatus !== PUBLISHED);
            if (!matched) {
                return this.$message.warning("请选择已下架或未发布的数据");
            }

            this.$confirm("确认发布吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                const resp = await publish({ ids: checked.map(item => item.id)});
                if (resp.code !== 0) {
                    return this.$message.error("操作失败" + resp.message);
                }
                this.$message.success("操作成功");
                this.resetListQuery();
                this.getPagination();
            });
        }
    },
};
</script>
