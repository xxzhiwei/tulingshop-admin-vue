<template>
    <div class="app-container">
        <el-card style="padding: 40px 40px 10px;">
            <el-row>
                <el-col style="margin-bottom: 40px;">
                    <el-steps :active="active" align-center>
                        <el-step v-for="(value, key) in steps" :key="key" :title="value"></el-step>
                    </el-steps>
                </el-col>

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
                        <el-form-item v-for="(item, index) in saleAttrList" :key="'saleAttr-' + item.id" :label="item.name" prop="saleAttrs">
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

                        <el-form-item label-width="0">
                            <el-tag size="small">{{isEditing ? '编辑' : '新增'}}</el-tag>
                        </el-form-item>
                        <el-form-item label-width="0">
                            <el-table ref="skusToSave" :data="formData.skus" style="width: 100%" size="small" stripe>
                                <el-table-column label="属性组合">
                                    <el-table-column v-for="(item, index) in formData.saleAttrs" :label="item.name" :key="item.id">
                                        <template slot-scope="{ row }">
                                            <span style="margin-left: 10px">{{ row.attrs[index].value }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="sku名称" min-width="255px">
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

                        <template v-if="skusUnsaved.length > 0">
                            <el-form-item label-width="0">
                                <el-tag size="small" type="warning">未保存</el-tag><span style="margin-left: 5px; font-size: 12px; color: #5e6d82;">（如有需要，可勾选保存到数据库中）</span>
                            </el-form-item>
                            <el-form-item label-width="0">
                                <el-table :data="skusUnsaved" ref="skusUnsaved" @selection-change="handleSelectUnsaved" style="width: 100%" size="small" stripe>
                                    <el-table-column type="selection" width="55"></el-table-column>
                                    <el-table-column label="属性组合">
                                        <el-table-column v-for="(item, index) in formData.saleAttrs" :label="item.name" :key="item.id">
                                            <template slot-scope="{ row }">
                                                <span style="margin-left: 10px">{{ row.attrs[index].value }}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                    <el-table-column label="sku名称" min-width="255px">
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
                        </template>

                        <template v-if="skusToRemove.length > 0">
                            <el-form-item label-width="0">
                                <el-tag size="small" type="danger">即将删除</el-tag>
                            </el-form-item>
                            <el-form-item label-width="0">
                                <el-table :data="skusToRemove" style="width: 100%" size="small" stripe>
                                    <el-table-column label="属性组合">
                                        <el-table-column v-for="(item, index) in formData.saleAttrs" :label="item.name" :key="item.id">
                                            <template slot-scope="{ row }">
                                                <span style="margin-left: 10px">{{ row.attrs[index].value }}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                    <el-table-column label="sku名称" min-width="255px">
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
                        </template>
                        
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
                            <el-button type="primary" @click="saveOrUpdate">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-col v-if="active === 6">
                    <el-result icon="success" title="保存完成">
                        <template slot="extra">
                            <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
                            <el-button v-if="!isEditing" type="primary" size="mini">继续添加</el-button>
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
import { getListByCategoryId as getAttrGroupList } from "@/api/pms/productAttrGroup";
import { getList as getAttrList } from "@/api/pms/productAttr";
import { save, getDetail, update } from "@/api/pms/product";
import { copyProperties, getDifference, findKeys } from "@/utils/common";

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

const defaultFormData = {
    id: "",
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
    abc: "",
    // categoryIds: "",
    unit: "",
    weight: "",
    price: "",
    subTitle: ""
}

export default {
    data() {
        return {
            active: 1,
            formData: JSON.parse(JSON.stringify(defaultFormData)),
            brandList: [],
            categoryList: [],
            categoryProps: {
                value: 'id',
                label: 'name',
            },
            BASE, ATTR, SALE_ATTR, SKU, SETTINGS,
            categoryIds: [],
            formRefNames: [BASE, ATTR, SALE_ATTR, SKU, SETTINGS],
            steps,
            attrGroupList: [],
            saleAttrList: [],
            skuSaleAttrList: null,
            isEditing: false,
            skuValueMap: null,
            skusToRemove: [], // 用于保存已经存在数据库，并将要删除的sku
            skusSaved: [], // 从接口获取的原始sku数据
            skusUnsaved: [], // 未保存至数据库的sku数据（此数据只有在编辑的时候，才会存在）
            // ref不是响应式的，在mounted时，dom没有渲染，因此无法获取到（undefined），因此必须使用$nextTick(在下次 DOM 更新循环结束之后执行延迟回调)，在更新dom后方可获取；别把v-if和ref一起使用
            skusUnsavedChecked: [],
        }
    },
    async created() {
        // 查看&编辑【先获取详情信息，不会出现意外的情况；慢是会慢一点】
        const { id } = this.$route.params;
        if (id) {
            this.isEditing = true;
            await this.getDetail(id);
        }

        this.getCategoryList();
        this.getBrandList();
    },
    computed: {
        currentFormRefName() {
            if (this.active > this.formRefNames.length - 1) {
                return "";
            }
            return this.formRefNames[this.active - 1];
        },
    },
    watch: {
        categoryList(n) {
            if (n.length) {
                this.categoryIds = findKeys(item => item.id === this.formData.productCategoryId, n);
            }
        }
    },
    methods: {
        // 恢复选中的未保存的sku数据【只有编辑时】
        restore() {
            if (this.skusUnsavedChecked.length) {
                this.$nextTick(() => {
                    for (const item of this.skusUnsavedChecked) {
                        this.$refs.skusUnsaved.toggleRowSelection(item, true);
                    }
                });
            }
        },
        previous() {
            if (this.active > 1) {
                this.active--;
            }

            // 返回至sku时，若之前已经选择了数据，则应该把数据还原；但是如果返回销售属性时，则不记录，此时会重新生成，要重新选择
            if (this.currentFormRefName === SKU) {
                this.restore();
            }
        },
        // 检查必填表单
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

            this.attrGroupList = resp.data;

            const _attrGroupList = [];
            for (const item of resp.data) {
                let _attrs;
                // 若为查看编辑状态，则从服务器返回的数据中查找【但由于是从不同表中查询的，所以一些数据得由前端进行处理】
                if (this.isEditing) {
                    const map = {};

                    _attrs = this.formData.attrs.filter(attrItem => attrItem.groupId === item.id).map(attrItem => {
                        let _attr = map[attrItem.attrId];
                        if (!_attr) {
                            _attr = item.attrs.find(_attrItem => _attrItem.id === attrItem.attrId);
                            if (!_attr) {
                                throw new Error('无法找到对应的attr');
                            }
                            map[_attr.id] = _attr;
                        }
                        attrItem.type = _attr.type;
                        
                        if (attrItem.type === 2) {
                            attrItem.value = attrItem.value.split(",");
                        }
                        return attrItem;
                    });
                }
                else {
                    _attrs = []; // 每个分组的属性集合
                    for (const attrItem of item.attrs) {
                        _attrs.push({
                            attrId: attrItem.id,
                            name: attrItem.name,
                            value: attrItem.type === 2 ? [] : '',
                            type: attrItem.type
                        });
                    }
                }
                _attrGroupList.push(_attrs);
            }

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
                    attrId: item.id,
                    name: item.name,
                    value: this.isEditing ? this.getSaleAttrValuesByAttrId(item.id) : [], // 若为查看编辑，则从sku列表中查询value
                    customValue: "",
                    inputVisible: false
                });
            }
            this.saleAttrList = resp.data;
            this.formData.saleAttrs = _attrs;
        },
        handleCascaderChange(value) {
            if (value && value.length) {
                // this.formData.categoryIds = value.join(",");
                this.formData.productCategoryId = value[value.length - 1];
            }
        },
        // 显示输入框【自定义销售属性】
        showInput(index) {
            this.formData.saleAttrs[index].inputVisible = true;
            // 需要'错位才能生效'
            this.$nextTick(() => {
                this.$refs[this.SALE_ATTR + '-input-' + index][0].focus();
            });
        },
        hideInput(index) {
            this.formData.saleAttrs[index].inputVisible = false;
        },
        // 若自定义输入框不为空时，将其内容获取，并赋予【this.saleAttrs[index].value】作为选项
        customHandler(index) {
            const customValue = this.formData.saleAttrs[index].customValue;
            if (customValue) {
                const value = this.saleAttrList[index].value;
                if (value !== "") {
                    this.saleAttrList[index].value = value + "," + customValue;
                }
                else {
                    this.saleAttrList[index].value = customValue;
                }
                this.formData.saleAttrs[index].customValue = "";
            }

            this.hideInput(index);
        },
        // 组装sku数据（用于在'SKU信息'处表单元素）
        makeSkuList() {
            const saleAttrValues = this.formData.saleAttrs.map(item => item.value);
            // 优先颜色属性【后端来做就可以】
            const cp = this.makeCartesianProduct(saleAttrValues);
            const skuList = [];
            const skuValueList = []; // 保存sku的值
            const skusUnsaved = [];
            for (const item of cp) {

                const values = item.join(',');
                skuValueList.push(values);
                let skuId = null;

                if (this.isEditing && (skuId = this.skuValueMap[values])) {
                    // '土豪金', '4G', '64G'根据销售属性值来查找
                    const sku = this.skusSaved.find(item => item.id === skuId);
                    if (!sku) {
                        throw new Error("查找不到sku: " + skuId);
                    }
                    skuList.push(sku);
                }
                else {
                    // 将cp中的每一项重新包装，使之具有'attr'的特性
                    const attrs = []; 
                    for (let i=0; i<item.length; i++) {
                        // cp中的元素中的每一项（['土豪金', '4G', '64G']），都是与saleAttr中的每一项一一对应的，
                        // 如：'土豪金'，对应this.formData.saleAttrs[0]，也就是'颜色'这个销售属性
                        const saleAttr = this.formData.saleAttrs[i];
                        attrs.push({
                            attrId: saleAttr.attrId,
                            name: saleAttr.name,
                            value: item[i]
                        });
                    }
                    const sku = {
                        attrs,
                        name: this.formData.name + " " + item.join(" "),
                        price: 0,
                        stock: 0
                    };
                    if (this.isEditing) {
                        skusUnsaved.push(sku);
                    }
                    else {
                        skuList.push(sku);
                    }
                }
            }
            
            if (this.isEditing) {
                const skuValuesToRemove = getDifference(Object.keys(this.skuValueMap), skuValueList);
                if (skuValuesToRemove && skuValuesToRemove.length) {
                    // 查找对应id的sku
                    const skuIds = skuValuesToRemove.map(item => this.skuValueMap[item]);
                    this.skusToRemove = this.skusSaved.filter(item => skuIds.includes(item.id));
                }
                else {
                    this.skusToRemove = [];
                }
            }

            // 注意skusToRemove与skus的赋值先后顺序
            this.formData.skus = skuList;
            this.skusUnsaved = skusUnsaved;
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
        // 保存或更新商品【销售属性处，是否需要加必填校验？（每项至少选一个）】
        saveOrUpdate() {
            this.$confirm("即将提交商品数据，是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                const { attrGroups, saleAttrs, ...others } = this.formData;

                // 消去外层分组
                const attrs = [];

                for (const item of attrGroups) {
                    for (const innerItem of item) {
                        // 多选时，在提交数据前需要把Array拆为字符串
                        if (innerItem.type === 2) {
                            attrs.push({
                                ...innerItem,
                                value: innerItem.value.join(',')
                            });
                        }
                        else {
                            attrs.push(innerItem);
                        }
                    }
                }
                others.attrs = attrs;

                let resp;
                // 若为编辑时，获取将要删除的skuId
                if (this.isEditing) {
                    others.removing = this.skusToRemove.map(item => item.id);

                    if (this.skusUnsavedChecked.length) {
                        others.skus.push(...this.skusUnsavedChecked);
                    }
                    resp = await update(others);
                }
                else {
                    resp = await save(others);
                }
                if (resp.code !== 0) {
                    return this.$message.error("保存失败：" + resp.message);
                }

                this.next();
            }).catch((error) => {
                console.log(error);
            });
        },
        // 获取详情
        async getDetail(id) {
            const resp = await getDetail(id);
            if (resp.code !== 0) {
                return this.$message.error("获取详情失败：" + resp.message);
            }
            this.formData = copyProperties(resp.data, this.formData);
            this.skusSaved = this.formData.skus;
            
            // 生成sku映射关系
            const skuValueMap = {};
            for (const item of this.formData.skus) {
                const values = item.attrs.map(item => item.value).join(",");
                skuValueMap[values] = item.id;
            }
            this.skuValueMap = skuValueMap;
        },
        // 在sku列表中查询销售属性值
        getSaleAttrValuesByAttrId(id) {

            if (this.skuSaleAttrList === null) {
                let skuSaleAttrs = [];
                for (const item of this.formData.skus) {
                    skuSaleAttrs.push(...item.attrs);
                }
                this.skuSaleAttrList = skuSaleAttrs;
            }

            return [...new Set(this.skuSaleAttrList.filter(item => item.attrId === id).map(item => item.value))];
        },
        // 如果点击返回上一步，是必须重新选择的
        handleSelectUnsaved(selection) {
            this.skusUnsavedChecked = selection;
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