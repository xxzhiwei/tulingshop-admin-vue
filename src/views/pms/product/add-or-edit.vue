<template>
    <div class="app-container">
        <el-card style="width: 80%; padding: 40px 40px 10px;;">
            <el-row>
                <el-col style="margin-bottom: 40px;">
                    <el-steps :active="active" align-center>
                        <el-step title="基本信息"></el-step>
                        <el-step title="规格参数"></el-step>
                        <el-step title="销售属性"></el-step>
                        <el-step title="SKU信息"></el-step>
                        <el-step title="完成"></el-step>
                    </el-steps>
                </el-col>
                <!-- step1：基本信息 -->
                <el-col v-if="active === 1" :span="18">
                    <el-form :model="formData" :ref="formRefNames[0]" label-width="auto" size="mini">
                        <el-form-item label="选择分类" prop="categoryId" required>
                            <el-cascader
                                v-model="categoryIds"
                                :options="categoryList"
                                @change="handleCascaderChange" :props="categoryProps"></el-cascader>
                        </el-form-item>
                        <el-form-item label="商品名称" prop="name">
                            <el-input v-model="formData.name"></el-input>
                        </el-form-item>
                        <el-form-item label="副标题" prop="subTitle">
                            <el-input v-model="formData.subTitle"></el-input>
                        </el-form-item>
                        <el-form-item label="选择品牌" prop="brandId">
                            <el-select v-model="formData.brandId" placeholder="请选择" clearable>
                                <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品描述" prop="description">
                            <el-input v-model="formData.description" type="textarea" :rows="2"></el-input>
                        </el-form-item>
                        <el-form-item label="商品售价" prop="price">
                            <el-input v-model="formData.price">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="计量单位">
                            <el-input v-model="formData.unit"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="weight">
                            <!-- <el-input-number v-model.number="formData.weight" :min="0" :precision="3" :step="0.1"></el-input-number> -->
                            <el-input v-model="formData.weight">
                                <template slot="append">克</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="商品图集" prop="images">
                            <el-input v-model="formData.brandId"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="previous()">上一步</el-button>
                            <el-button type="primary" @click="next()">下一步: 设置规格参数</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 2" :span="18">
                    <el-form :model="formData" :ref="formRefNames[1]" label-width="auto" size="mini">
                        <template v-for="(item, itemIndex) in attrGroupList">
                            <el-form-item :key="'attrGroup-' + item.id" label-width="0">
                                <el-alert
                                    type="info"
                                    :closable="false">
                                    <div slot="title">
                                        <i class="el-icon-edit el-alert__title is-bold"></i>
                                        <span style="margin-left: 5px;" class="el-alert__title is-bold">{{item.name}}</span>
                                    </div>
                                </el-alert>
                            </el-form-item>
                            <el-form-item :label="attrItem.name" v-for="(attrItem, attrIndex) in item.attrs" :key="'attr-' + attrItem.id">
                                <template v-if="attrItem.type === 3">
                                    <el-input v-model="formData.attrs[itemIndex][attrIndex].value" placeholder="请输入"></el-input>
                                </template>
                                <template v-else>
                                    <el-select v-model="formData.attrs[itemIndex][attrIndex].value" :multiple="attrItem.type === 2" filterable allow-create placeholder="请选择">
                                        <el-option v-for="(attrValuesItem, attrValuesIndex) in attrItem.values.split(',')" :key="attrValuesIndex" :label="attrValuesItem" :value="attrValuesItem"></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                        </template>
                        <el-form-item>
                            <el-button type="primary" @click="previous()">上一步</el-button>
                            <el-button type="primary" @click="next()">下一步: 设置销售属性</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 3" :span="18">
                    <el-form :model="formData" :ref="formRefNames[2]" label-width="auto" size="mini">
                        <el-form-item v-for="(item, index) in saleAttrList" :key="'saleAttr-' + item.id" :label="item.name">
                            <el-checkbox-group class="product-add-or-edit-checkbox-group" size="mini" v-model="formData.saleAttrs[index].value">
                                <el-checkbox
                                    v-for="(attrValuesItem, attrValuesIndex) in item.values.split(',')" :key="attrValuesIndex" :label="attrValuesItem" :value="attrValuesItem"></el-checkbox>
                                <div style="margin-left: 10px; display: inline;">
                                <el-button v-show="!formData.saleAttrs[index].inputVisible" size="mini" @click="showInput(index)">+自定义</el-button>
                                <el-input
                                    :ref="formRefNames[2] + '-input-' + index"
                                    v-show="formData.saleAttrs[index].inputVisible"
                                    v-model="formData.saleAttrs[index].customValue"
                                    size="mini"
                                    style="width: 150px"
                                    @blur="customHandler(index)"
                                ></el-input>
                                </div>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="previous()">上一步</el-button>
                            <el-button type="primary" @click="next()">下一步: 设置SKU信息属性</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 4" :span="18">
                    <el-form :model="formData" :ref="formRefNames[3]" label-width="auto" size="mini">
                        <el-form-item>
                            <el-button type="primary" @click="previous()">上一步</el-button>
                            <el-button type="primary" @click="next()">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 5" :span="18">
                    <h1>保存完成</h1>
                    <el-button size="mini" type="primary" @click="previous()">上一步</el-button>
                    <el-button size="mini" type="primary">继续添加</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { getList as getBrandList } from "@/api/pms/brand";
import { getList as getCategoryList } from "@/api/pms/category";
import { getList as getAttrGroupList } from "@/api/pms/productAttrGroup";
import { getList as getAttrList } from "@/api/pms/productAttr";

export default {
    data() {
        return {
            active: 1,
            formData: {
                name: '',
                description: '',
                brandId: '',
                giftGrowth: '',
                giftPoint: '',
                categoryId: '',
                attrs: [],
                saleAttrs: [],
                abc: ''
            },
            brandList: [],
            categoryList: [],
            categoryProps: {
                value: 'id',
                label: 'name',
            },
            categoryIds: [],
            formRefNames: [
                'base',
                'attr',
                'saleAttr',
                'sku'
            ],
            attrGroupList: [],
            saleAttrList: []
        }
    },
    created() {
        this.getBrandList();
        this.getCategoryList();
    },
    computed: {
        currentFormRefName() {
            return this.formRefNames[this.active - 1];
        }
    },
    methods: {
        previous() {
            if (this.active > 1) {
                this.active--;
            }
        },
        check() {
            this.$refs[this.currentFormRefName].validate(valid => {
                if (valid) {
                    return true;
                }
                throw new Error('校验失败');
            });
        },
        async next() {
            try {
                this.check();
                // 若当前是'base'，则表示下个是'attr'，此前必须先调用接口获取规格属性分组
                if (this.currentFormRefName === this.formRefNames[0]) {
                    await this.getAttrGroupList();
                }
                if (this.currentFormRefName === this.formRefNames[1]) {
                    await this.getSaleAttrList();
                }
                if (this.active < 5) {
                    this.active++;
                }
            } catch (e) {
                console.log(e);
            }
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
        // 获取规格属性分组
        async getAttrGroupList() {
            const resp = await getAttrGroupList({ categoryId: this.formData.categoryId });
            if (resp.code !== 0) {
                return this.$message.error("获取规格属性分组列表失败");
            }
            const _attrGroupList = [];
            for (const item of resp.data) {
                const _attrs = []; // 每个分组的属性集合
                for (const attrItem of item.attrs) {
                    _attrs.push({
                        id: attrItem.id,
                        name: attrItem.name,
                        value: attrItem.type === 2 ? [] : ''
                     });
                }
                _attrGroupList.push(_attrs);
            }
            this.attrGroupList = resp.data;
            this.formData.attrs = _attrGroupList;
        },
        // 获取销售属性
        async getSaleAttrList() {
            const resp = await getAttrList({ categoryId: this.formData.categoryId });
            if (resp.code !== 0) {
                return this.$message.error("获取销售属性列表失败");
            }

            const _attrs = []; // 每个分组的属性集合
            for (const item of resp.data) {
                _attrs.push({
                    id: item.id,
                    name: item.name,
                    value: [],
                    customValue: "",
                    inputVisible: false
                });
            }
            this.saleAttrList = resp.data;
            this.formData.saleAttrs = _attrs;
        },
        handleCascaderChange(value) {
            if (value && value.length) {
                this.formData.categoryId = value[value.length - 1];
            }
        },
        // 显示输入框【自定义销售属性】
        showInput(index) {
            this.formData.saleAttrs[index].inputVisible = true;
            // 需要'错位才能生效'
            this.$nextTick(() => {
                this.$refs[this.formRefNames[2] + '-input-' + index][0].focus();
            });
        },
        hideInput(index) {
            this.formData.saleAttrs[index].inputVisible = false;
        },
        // 若自定义输入框不为空时，将其内容获取，并赋予【this.saleAttrs[index].valueSelect】作为选项
        customHandler(index) {
            const customValue = this.formData.saleAttrs[index].customValue;
            if (customValue) {
                const valueSelect = this.saleAttrList[index].valueSelect;
                if (valueSelect !== "") {
                    this.saleAttrList[index].valueSelect = valueSelect + "," + customValue;
                }
                else {
                    this.saleAttrList[index].valueSelect = customValue;
                }
                this.attrDataForm.saleAttrs[index].customValue = "";
            }

            this.hideInput(index);
        },
    }
}
</script>

<style>
    .pms-product-add-or-edit-card {
        width: 60% !important;
        margin: 0 auto;
    }
    .product-add-or-edit-checkbox-group.el-checkbox-group .el-checkbox {
        margin-right: 10px;
    }
</style>