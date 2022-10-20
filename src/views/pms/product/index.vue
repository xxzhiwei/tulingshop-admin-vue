<template> 
    <div class="app-container">
        <el-card style="margin-bottom: 20px;" :body-style="{ 'padding-bottom': '2px' }">
            <el-form :inline="true" size="mini">
                <el-form-item label="商品名称">
                    <el-input v-model="listQuery.keyword" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="商品货号">
                    <el-input v-model="listQuery.productSn" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-cascader
                        style="width: 168px;"
                        v-model="categoryIds"
                        :options="categoryList"
                        @change="handleCascaderChange" :props="categoryProps"></el-cascader>
                </el-form-item>
                <el-form-item label="商品品牌">
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
                <el-form-item label="审核状态">
                    <el-select style="width: 168px;" v-model="listQuery.verifyStatus" placeholder="请选择" clearable>
                        <el-option v-for="item in verifyStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
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
                <el-button style="float: right; padding: 3px 0;" type="text" @click="addOrEdit">
                    添加
                </el-button>
            </div>
            <el-table ref="productTable" :data="list" style="width: 100%" border>
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="编号" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="商品图片" width="120" align="center">
                    <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
                </el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.name}}</p>
                        <p>品牌：{{scope.row.brandName}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="价格/货号" width="120" align="center">
                    <template slot-scope="scope">
                        <p>价格：￥{{scope.row.price}}</p>
                        <p>货号：{{scope.row.productSn}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.sort}}</template>
                </el-table-column>
                <el-table-column label="SKU库存" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="销量" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.sale}}</template>
                </el-table-column>
                <el-table-column label="审核状态" width="100" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.verifyStatus}}</p>
                        <p>
                            <el-button type="text">审核详情
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <div style="text-align: right; margin-top: 10px;">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total,sizes,prev,pager,next,jumper" :page-size="listQuery.size" :page-sizes="[5,10,20]" :current-page.sync="listQuery.current" :total="total"></el-pagination>
        </div>
        
        <!-- <el-dialog title="编辑货品信息" :visible.sync="editSkuInfo.dialogVisible" width="40%">
            <span>商品货号：</span>
            <span>{{editSkuInfo.productSn}}</span>
            <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
                <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
            </el-input>
            <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
                <el-table-column label="SKU编号" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.skuCode"></el-input>
                    </template>
                </el-table-column>
                <el-table-column v-for="(item,index) in editSkuInfo.productAttr" :label="item.name" :key="item.id" align="center">
                    <template slot-scope="scope">
                        {{getProductSkuSp(scope.row,index)}}
                    </template>
                </el-table-column>
                <el-table-column label="销售价格" width="80" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.price"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="商品库存" width="80" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.stock"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="库存预警值" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.lowStock"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>
<script>
import { getPagination } from "@/api/pms/product";
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
export default {
    name: "productList",
    mixins: [listMixin],
    data() {
        return {
            editSkuInfo: {
                dialogVisible: false,
                productId: null,
                productSn: "",
                productAttributeCategoryId: null,
                stockList: [],
                productAttr: [],
                keyword: null,
            },
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
            publishStatusOptions: [
                {
                    value: 1,
                    label: "上架",
                },
                {
                    value: 0,
                    label: "下架",
                },
            ],
            verifyStatusOptions: [
                {
                    value: 1,
                    label: "审核通过",
                },
                {
                    value: 0,
                    label: "未审核",
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
        verifyStatusFilter(value) {
            if (value === 1) {
                return "审核通过";
            } else {
                return "未审核";
            }
        },
    },
    methods: {
        async getPagination(query) {
            const resp = await getPagination(query);
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
        addOrEdit() {
            this.$router.push({ path: "/pms/product/add-or-edit" });
        },

        getProductSkuSp(row, index) {
            if (index === 0) {
                return row.sp1;
            } else if (index === 1) {
                return row.sp2;
            } else {
                return row.sp3;
            }
        },

        handleShowSkuEditDialog(index, row) {
            
        },
        handleSearchEditSku() {
            // fetchSkuStockList(this.editSkuInfo.productId, {
            //     keyword: this.editSkuInfo.keyword,
            // }).then((response) => {
            //     this.editSkuInfo.stockList = response.data;
            // });
        },
        handleEditSkuConfirm() {
            if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
                this.$message({
                    message: "暂无sku信息",
                    type: "warning",
                    duration: 1000,
                });
                return;
            }
            this.$confirm("是否要进行修改", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                
            });
        },
        handleDelete(index, row) {
        },
        handleUpdateProduct(index, row) {
            this.$router.push({
                path: "/pms/updateProduct",
                query: { id: row.id },
            });
        }
    },
};
</script>
