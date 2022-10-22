<template>
    <div class="app-container">
        <el-card style="width: 80%; padding: 40px 40px 10px;;">
            <el-row>
                <el-col style="margin-bottom: 40px;">
                    <el-steps :active="active" align-center>
                        <el-step v-for="(value, key) in steps" :key="key" :title="value"></el-step>
                    </el-steps>
                </el-col>
                <!-- step1：基本信息 -->
                <el-col v-if="active === 1" :span="18">
                    <el-form :model="formData" :ref="BASE" label-width="auto" size="mini">
                        <el-form-item label="选择分类" prop="productCategoryId" required>
                            <el-cascader
                                v-model="categoryIds"
                                :options="categoryList"
                                @change="handleCascaderChange" :props="categoryProps"></el-cascader>
                        </el-form-item>
                        <el-form-item label="商品名称" prop="name" required>
                            <el-input v-model="formData.name"></el-input>
                        </el-form-item>
                        <el-form-item label="副标题" prop="subTitle">
                            <el-input v-model="formData.subTitle"></el-input>
                        </el-form-item>
                        <el-form-item label="选择品牌" prop="brandId" required>
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
                            <el-input v-model="formData.weight">
                                <template slot="append">克</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="商品图集" prop="images">
                            <el-input v-model="formData.abc"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="previous()">上一步</el-button>
                            <el-button type="primary" @click="next()">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 2" :span="18">
                    <el-form :model="formData" :ref="ATTR" label-width="auto" size="mini">
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
                                    <el-input v-model="formData.attrGroups[itemIndex][attrIndex].value" placeholder="请输入"></el-input>
                                </template>
                                <template v-else>
                                    <el-select v-model="formData.attrGroups[itemIndex][attrIndex].value" :multiple="attrItem.type === 2" filterable allow-create placeholder="请选择">
                                        <el-option v-for="(attrValueItem, attrValueIndex) in attrItem.value.split(',')" :key="attrValueIndex" :label="attrValueItem" :value="attrValueItem"></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                        </template>
                        <el-form-item>
                            <el-button type="primary" @click="previous()">上一步</el-button>
                            <el-button type="primary" @click="next()">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 3" :span="18">
                    <el-form :model="formData" :ref="SALE_ATTR" label-width="auto" size="mini">
                        <el-form-item v-for="(item, index) in saleAttrList" :key="'saleAttr-' + item.id" :label="item.name">
                            <el-checkbox-group class="product-add-or-edit-checkbox-group" size="mini" v-model="formData.saleAttrs[index].value">
                                <el-checkbox
                                    v-for="(attrValueItem, attrValueIndex) in item.value.split(',')" :key="attrValueIndex" :label="attrValueItem" :value="attrValueItem"></el-checkbox>
                                <div style="margin-left: 10px; display: inline;">
                                <el-button v-show="!formData.saleAttrs[index].inputVisible" size="mini" @click="showInput(index)">+自定义</el-button>
                                <el-input
                                    :ref="'saleAttr-input-' + index"
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
                            <el-button type="primary" @click="next()">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 4">
                    <el-form :model="formData" :ref="SKU" label-width="auto" size="mini">
                        <el-form-item>
                            <el-table :data="formData.skus" style="width: 100%" size="small" stripe>
                                <el-table-column label="属性组合">
                                    <el-table-column v-for="(item, index) in formData.saleAttrs" :label="item.name" :key="item.id">
                                        <template slot-scope="{ row }">
                                            <span style="margin-left: 10px">{{ row.attrs[index].value }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="商品名称" min-width="255px">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.name"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="价格">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.price"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="库存">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.stock"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="previous()">上一步</el-button>
                            <el-button type="primary" @click="next()">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 5" :span="18">
                    <el-form :model="formData" :ref="SETTINGS" label-width="auto" size="mini">
                        <el-form-item label="上架">
                            <el-switch
                                v-model="formData.publishStatus"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="新品">
                            <el-switch
                                v-model="formData.newStatus"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="推荐">
                            <el-switch
                                v-model="formData.recommendStatus"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="previous()">上一步</el-button>
                            <el-button type="primary" @click="save">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 6">
                    <el-result icon="success" title="保存完成">
                        <template slot="extra">
                            <el-button type="primary" size="mini">返回</el-button>
                            <el-button type="primary" size="mini">继续添加</el-button>
                        </template>
                    </el-result>
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
import { save } from "@/api/pms/product";

const BASE = 'base';
const ATTR = 'attr';
const SALE_ATTR = 'saleAttr';
const SKU = 'sku';
const SETTINGS = 'settings';
const FINISHED = 'finished';

const steps = {
    [BASE]: '基本信息',
    [ATTR]: '规格参数',
    [SALE_ATTR]: '销售属性',
    [SKU]: 'SKU信息',
    [SETTINGS]: '商品设置',
    [FINISHED]: '完成'
};

const stepCount = Object.keys(steps).length;

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
                productCategoryId: '',
                attrGroups: [], // 接口不需要
                attrs: [],
                saleAttrs: [], // 接口不需要
                recommendStatus: 1,
                newStatus: 1,
                publishStatus: 1,
                skus: [],
                abc: ""
            },
            brandList: [],
            categoryList: [],
            categoryProps: {
                value: 'id',
                label: 'name',
            },
            BASE, ATTR, SALE_ATTR, SKU, SETTINGS,
            categoryIds: [],
            formRefNames: [BASE, ATTR, SALE_ATTR, SETTINGS],
            steps,
            attrGroupList: [],
            saleAttrList: [],
        }
    },
    created() {
        this.getBrandList();
        this.getCategoryList();
    },
    computed: {
        currentFormRefName() {
            if (this.active > this.formRefNames.length - 1) {
                return "";
            }
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
            if (!this.currentFormRefName) {
                return;
            }
            this.$refs[this.currentFormRefName].validate(valid => {
                if (valid) {
                    return true;
                }
                throw new Error('校验失败');
            });
        },
        async next() {
            try {
                // 检查必填表单
                this.check();
                
                switch (this.currentFormRefName) {
                    // 若当前是'base'，则表示下个是'attr'，此前必须先调用接口获取规格属性分组
                    case BASE:
                        await this.getAttrGroupList();
                        break;
                    case ATTR:
                        await this.getSaleAttrList();
                        break;
                    case SALE_ATTR:
                        this.makeSkuList();
                        break;
                }

                if (this.active < stepCount) {
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
            const resp = await getAttrGroupList({ categoryId: this.formData.productCategoryId });
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
            this.formData.attrGroups = _attrGroupList;
        },
        // 获取销售属性
        async getSaleAttrList() {
            const resp = await getAttrList({ categoryId: this.formData.productCategoryId });
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
                this.formData.productCategoryId = value[value.length - 1];
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
        // 组装sku数据（用于在'SKU信息'处表单元素）
        makeSkuList() {
            const saleAttrValues = this.formData.saleAttrs.map(item => item.value);
            // 优先颜色属性【后端来做就可以】
            const cp = this.makeCartesianProduct(saleAttrValues);
            const skuList = [];

            for (const item of cp) {
                // 将cp中的每一项重新包装，使之具有'attr'的特性
                const attrs = []; 
                for (let i=0; i<item.length; i++) {
                    // cp中的元素中的每一项（['土豪金', '4G', '64G']），都是与saleAttr中的每一项一一对应的，
                    // 如：'土豪金'，对应this.formData.saleAttrs[0]，也就是'颜色'这个销售属性
                    const saleAttr = this.formData.saleAttrs[i];
                    attrs.push({
                        id: saleAttr.id,
                        name: saleAttr.name,
                        value: item[i]
                    });
                }

                skuList.push({
                    attrs,
                    name: this.formData.name + " " + item.join(" "),
                    price: 0,
                    stock: 0
                });
            }

            this.formData.skus = skuList;
        },
        /**
         * 生成销售属性笛卡尔积；如有以下销售属性：
         * @param saleAttrValues [['土豪金', '玫瑰红'], ['4G', '8G'], ['64G', '128G']]
         * @return [
         *      ['土豪金', '4G', '64G'], ['土豪金', '4G', '128G'], ['土豪金', '8G', '64G'], ['土豪金', '8G', '128G'],
         *      ['玫瑰红', '4G', '64G'], ['玫瑰红', '4G', '128G'], ['玫瑰红', '8G', '64G'], ['玫瑰红', '8G', '128G']
         * ]
         */
        makeCartesianProduct(saleAttrValues) {
            const map = {};
            const cp = [];
            
            // 创建每组属性的相关映射关系【下标】
            for (let i=0; i<saleAttrValues.length; i++) {
                map[i] = { indexPointer: 0, maxIndex: saleAttrValues[i].length - 1 };
            }

            while (true) {
                // 此处key为saleAttrValues的下标
                const group = [];
                for (let key in map) {
                    const indexPointer = map[key].indexPointer;
                    group.push(saleAttrValues[key][indexPointer]);
                }
                cp.push(group);

                let index = 0;
                for (let key in map) {
                    if (map[key].indexPointer < map[key].maxIndex) {
                        map[key].indexPointer++;
                        break;
                    }
                    else {
                        // 若indexPointer增加至maxIndex后，将其重置为0，然后重新进入while循环；
                        // index累加至【saleAttrValues.length - 1】后，表示已经循环完毕；将数据cp返回
                        map[key].indexPointer = 0;
                        if (index === saleAttrValues.length - 1) {
                            return cp;
                        }
                        index++;
                    }
                }
            }
        },
        // 保存商品
        save() {
            this.$confirm("即将提交商品数据，是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                console.log(this.formData);


                const { attrGroups, saleAttrs, ...others } = this.formData;

                // 消去外层分组
                const attrs = [];

                for (const item of attrGroups) {
                    for (const innerItem of item) {
                        attrs.push(innerItem);
                    }
                }
                others.attrs = attrs;
                const resp = await save(others);

                if (resp.code !== 0) {
                    return this.$message.error("保存失败：" + resp.message);
                }

                this.next();
            }).catch((error) => {
                console.log(error);
            });
        }
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