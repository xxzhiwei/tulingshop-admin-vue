<template>
    <div class="app-container">
        <div style="margin-bottom: 10px;">
            <div style="margin-bottom: 10px;">
                <el-button type="primary" size="small" @click="showDialogForAdding()">新增分类</el-button>
            </div>
        </div>
        <el-tree :data="list" node-key="id" :expand-on-click-node="false">
            <span slot-scope="{ data }">
                <span style="font-size: 14px;">
                    {{ data.name }}
                </span>
                <span style="margin-left: 10px;">
                    <el-button v-if="data.level < 1" type="text" size="mini" @click="() => showDialogForAdding(data)">
                        添加
                    </el-button>
                    <el-button type="text" size="mini" @click="() => showDialogForEditing(data)">
                        修改
                    </el-button>
                    <el-button type="text" style="color: #f56c6c" size="mini" @click="() => del(data)">
                        删除
                    </el-button>
                </span>
            </span>
        </el-tree>

        <el-dialog :title="isEditing ? '编辑' : '新增'" :visible.sync="dialogVisible" width="45%">
            <el-form :model="formData" label-width="80px">
                <el-form-item label="父级">
                    <el-popover ref="popover" placement="bottom-start" trigger="click">
                        <el-tree ref="menuTree" :data="menu" :props="props" node-key="id" @current-change="currentChange" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
                        </el-tree>
                    </el-popover>
                    <el-input v-model="formData.parentName" v-popover:popover :readonly="true" placeholder="" :disabled="isEditing"></el-input>
                </el-form-item>
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
import { getList, save, update, del } from "@/api/pms/category";
import { copyProperties } from '@/utils/common.js';

const defaultFormData = {
    id: "",
    level: 0,
    name: "",
    parentId: 0,
    parentName: "",
};

const extraOption = {
    id: 0, // 用于赋予parentId属性
    level: -1, // +1 => 0
    name: "一级分类"
}

function getMenu(list) {
    const items = list.filter((item) => {
        return item.level === 0
    });
    return items;
}

export default {
    data() {
        return {
            list: [],
            props: {
                label: "name",
                children: "x" // 不显示children
            },
            formData: {
                ...defaultFormData,
            },
            isEditing: false,
            dialogVisible: false
        };
    },
    computed: {
        menu() {
            if (!this.list.length) {
                return [];
            }
            const _menu = getMenu(JSON.parse(JSON.stringify(this.list)));
            _menu.unshift(extraOption);
            // [].filter()本身不会修改数组，但是在getMenu()方法里直接对传入的数组做修改了，因此这里使用深复制再对其进行操作
            return _menu;
        },
    },
    created() {
        this.getList();
    },
    methods: {
        async getList() {
            const resp = await getList();
            if (resp && resp.code !== 0) {
                return this.$message.error(resp.message);
            }
            this.list = resp.data;
        },
        showDialogForAdding(data) {
            this.isEditing = false;
            this.formData = { ...defaultFormData };
            if (data) {
                this.formData.parentId = data.id;
                this.formData.parentName = data.name;
                this.formData.level = data.level + 1;
                this.$nextTick(() => {
                    this.$refs.menuTree.setCurrentKey(this.formData.parentId);
                });
            }
            else {
                this.formData.parentName = extraOption.name;
                this.$nextTick(() => {
                    this.$refs.menuTree.setCurrentKey(extraOption.id);
                });
            }

            this.dialogVisible = true;
        },
        async save() {
            this.dialogVisible = false;
            const resp = await save(this.formData).catch((error) => {
                console.log(error);
            });
            if (resp.code !== 0) {
                this.$message.error("操作失败");
                return;
            }
            this.$message.success("操作成功");
            this.getList();
        },
        showDialogForEditing(data) {
            this.isEditing = true;

            this.formData = copyProperties(data, { ...defaultFormData })
            this.dialogVisible = true;
            // 非根菜单时，高亮【此处parentId为0的为一级分类】
            if (this.formData.parentId) {
                this.$nextTick(() => {
                    this.$refs.menuTree.setCurrentKey(this.formData.parentId);
                    this.formData.parentName =
                        (this.$refs.menuTree.getCurrentNode() || {})["name"];
                });
            }
            else {
                this.formData.parentName = "无";
            }
        },
        async update() {
            this.dialogVisible = false;
            const resp = await update(this.formData).catch(
                (error) => {
                    console.log(error);
                }
            );
            if (resp.code !== 0) {
                this.$message.error("操作失败");
                return;
            }
            this.$message.success("操作成功");
            this.getList();
        },
        del(data) {
            this.$confirm("确认删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                const resp = await del({ id: data.id }).catch(
                    (error) => {
                        console.log(error);
                    }
                );
                if (resp.code !== 0) {
                    this.$message.error("操作失败");
                    return;
                }
                this.$message.success("操作成功");
                this.getList();
            });
        },
        currentChange(data) {
            this.formData.parentId = data.id;
            this.formData.parentName = data.name;
            this.formData.level = data.level + 1;
            this.$refs.popover.doClose();
        },
    },
};
</script>