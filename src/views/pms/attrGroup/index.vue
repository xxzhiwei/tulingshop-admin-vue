<template>
    <div class="app-container">
        <el-card style="margin-bottom: 20px;" :body-style="{ 'padding-bottom': '2px' }">
            <el-form :inline="true" size="mini">
                <el-form-item label="名称">
                    <el-input v-model="listQuery.keyword" placeholder="请输入"></el-input>
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
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="名称" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.name}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button size="mini" @click="showDialogForEditing(scope.row)">编辑
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

        <el-dialog :title="isEditing ? '编辑' : '新增'" :visible.sync="dialogVisible" width="45%">
            <el-form :model="formData" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
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
import { getPagination, save, update, del } from "@/api/pms/productAttrGroup";
import listMixin from '@/mixin/list';

import { copyProperties } from '@/utils/common.js';

const defaultListQuery = {
    keyword: null,
    current: 1,
    size: 5,
    firstLetter: null
};

const defaultFormData = {
    id: null,
    name: ""
};

export default {
    name: "attrGroupList",
    mixins: [listMixin],
    data() {
        return {
            defaultListQuery: { ...defaultListQuery },
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            isEditing: false,
            formData: { ...defaultFormData },
            dialogVisible: false,
            categoryIds: [],
            categoryList: [],
            categoryProps: {
                value: 'id',
                label: 'name',
            },
        };
    },
    created() {
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

            this.formData = copyProperties(data, this.formData);
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
                this.$message.success("操作失败");
                this.getPagination();
            });
        }
    },
};
</script>
