<template>
    <div class="app-container">
        <el-card style="margin-bottom: 20px;" :body-style="{ 'padding-bottom': '2px' }">
            <el-form :inline="true" size="mini">
                <el-form-item label="名称">
                    <el-input v-model="listQuery.keyword" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="分类"><el-cascader
                    style="width: 168px;"
                    v-model="categoryIds2"
                    :options="categoryList"
                    @change="handleCascaderChange2" :props="categoryProps"></el-cascader>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select style="width: 168px;" v-model="listQuery.type2" placeholder="请选择" clearable>
                        <el-option label="规格属性" :value="1"></el-option>
                        <el-option label="销售属性" :value="2"></el-option>
                    </el-select>
                </el-form-item>
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
                <el-button style="float: right; padding: 3px 0;" type="text" @click="showDialogForAdding()">
                    添加
                </el-button>
            </div>
            <el-table ref="list" :data="list" style="width: 100%" border>
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="编号" width="100" align="center" prop="id"></el-table-column>
                <el-table-column label="名称" align="center" prop="name"></el-table-column>
                <el-table-column label="关联分类" align="center" prop="categoryName"></el-table-column>
                <el-table-column label="操作" width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showDialogForEditing(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <div style="text-align: right; margin-top: 10px;">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total,sizes,prev,pager,next,jumper" :page-size="listQuery.size" :page-sizes="[5,10,20]" :current-page.sync="listQuery.current" :total="total"></el-pagination>
        </div>

        <el-dialog :title="isEditing ? '编辑' : '新增'" :visible.sync="dialogVisible" width="45%">
            <el-form :model="formData" label-width="80px" size="small">
                <el-form-item label="名称">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="关联分类">
                    <el-cascader
                        style="width: 168px;"
                        v-model="categoryIds"
                        :options="categoryList"
                        @change="handleCascaderChange" :props="categoryProps"></el-cascader>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio :disabled="isEditing" v-model="formData.type2" :label="1">规则属性</el-radio>
                    <el-radio :disabled="isEditing" v-model="formData.type2" :label="2" @change="type2Change">销售属性</el-radio>
                </el-form-item>
                <el-form-item label="可选值">
                    <el-input v-model="formData.value" placeholder="多个值以逗号分隔"></el-input>
                </el-form-item>
                <el-form-item label="值类型">
                    <el-radio :disabled="isEditing && formData.type2 === 2" v-model="formData.type" :label="1">单选</el-radio>
                    <el-radio v-model="formData.type" :label="2">多选</el-radio>
                    <el-radio :disabled="isEditing && formData.type2 === 2" v-model="formData.type" :label="3">手动输入</el-radio>
                </el-form-item>
                <!-- 销售属性都是多选？ -->
                <template v-if="formData.type2 === 1">
                    <el-form-item label="关联分组">
                        <el-select style="width: 168px;" v-model="formData.groupId" placeholder="请选择" clearable>
                            <el-option v-for="item in attrGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" size="small" v-if="isEditing" @click="update">确 定</el-button>
                <el-button type="primary" size="small" v-else @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getPagination, save, update, del } from "@/api/pms/productAttr";
import { getList as getCategoryList } from "@/api/pms/category";
import { getList as getAttrGroupList } from "@/api/pms/productAttrGroup";
import listMixin from '@/mixin/list';

import { copyProperties, findKeys } from '@/utils/common.js';

const defaultListQuery = {
    keyword: "",
    current: 1,
    size: 10,
    type2: null,
    categoryId: null
};

const defaultFormData = {
    id: null,
    name: "",
    value: "",
    type: 2,
    categoryId: "",
    type2: 1,
    groupId: null
};

export default {
    name: "attrList",
    mixins: [listMixin],
    data() {
        return {
            defaultListQuery: { ...defaultListQuery, 'this:array': 'categoryIds2' },
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            isEditing: false,
            formData: { ...defaultFormData },
            dialogVisible: false,
            categoryIds: [],
            categoryIds2: [],
            categoryList: [],
            categoryProps: {
                value: 'id',
                label: 'name',
            },
            attrGroupList: []
        };
    },
    created() {
        this.getCategoryList();
        this.getAttrGroupList();
        this.getPagination();
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
        showDialogForAdding() {
            this.isEditing = false;
            this.formData = { ...defaultFormData };
            if (this.categoryIds.length) {
                this.categoryIds = [];
            }
            this.dialogVisible = true;

        },
        showDialogForEditing(data) {
            this.isEditing = true;

            this.formData = copyProperties(data, this.formData)
            this.categoryIds = findKeys(item => item.id === data.categoryId, this.categoryList);
            this.dialogVisible = true;
        },
        async update() {
            const resp = await update(this.formData);

            if (resp.code !== 0) {
                return this.$message.error("操作失败：" + resp.message);
            }
            this.dialogVisible = false;
            this.$message.success("操作成功");
            this.getPagination();
        },
        async save() {
            const resp = await save(this.formData);

            if (resp.code !== 0) {
                return this.$message.error("操作失败：" + resp.message);
            }
            this.dialogVisible = false;
            this.$message.success("操作成功");
            this.resetListQuery();
            this.getPagination();
        },
        del(row) {
            this.$confirm("确认删除吗？", "提示")
            .then(async () => {
                const resp = await del({ id: row.id });
                if (resp.code !== 0) {
                    return this.$message.error("操作失败：" + resp.message);
                }
                this.$message.success("操作成功");
                this.getPagination();
            });
        },
        handleCascaderChange(value) {
            if (value && value.length) {
                this.formData.categoryId = value[value.length - 1];
            }
        },
        handleCascaderChange2(value) {
            if (value && value.length) {
                this.listQuery.categoryId = value[value.length - 1];
            }
        },
        async getCategoryList() {
            const resp = await getCategoryList();
            if (resp.code !== 0) {
                return this.$message.error("获取分类列表失败");
            }
            this.categoryList = resp.data;
        },
        async getAttrGroupList() {
            const resp = await getAttrGroupList();
            if (resp.code !== 0) {
                return this.$message.error("获取属性分组列表失败");
            }
            this.attrGroupList = resp.data;
        },
        type2Change(type2) {
            if (type2 === 2) {
                this.formData.type = 2;
                this.formData.groupId = null;
            }
        }
    },
};
</script>
