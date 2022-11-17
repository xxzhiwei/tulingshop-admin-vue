<template>
    <div class="app-container">
        <el-card style="margin-bottom: 20px;" :body-style="{ 'padding-bottom': '2px' }">
            <el-form :inline="true" size="mini">
                <el-form-item label="关键字">
                    <el-input v-model="listQuery.keywords" placeholder="请输入订单号/会员名称"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select style="width: 168px;" v-model="listQuery.status" placeholder="请选择" clearable>
                        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="金额">
                    <el-input style="width: 168px;" v-model="listQuery.min" placeholder="请输入" clearable></el-input>
                    -
                    <el-input style="width: 168px;" v-model="listQuery.max" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker style="width: 168px;" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.start"></el-date-picker>
                    -
                    <el-date-picker style="width: 168px;" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.end"></el-date-picker>
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
            </div>
            <el-table
                :data="list" stripe style="width: 100%" size="medium" border>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <div style="padding-left: 30px;">
                            <div>联系人：{{scope.row.receiverName}}</div>
                            <div>联系电话：{{scope.row.receiverPhone}}</div>
                            <div>收货地址：{{scope.row.receiverProvince}} {{scope.row.receiverCity}} {{scope.row.receiverRegion}} {{scope.row.receiverDetailAddress}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="订单号" align="center"></el-table-column>
                <el-table-column label="订单状态" width="140" align="center">
                    <template slot-scope="scope">
                        <el-tag size="small" :type="scope.row.status | statusTagTypeFilter">{{scope.row.status | statusTextFilter}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="center">
                    <template slot-scope="scope">
                        <span>总额：{{scope.row.totalAmount}}元</span>
                        <br />
                        <span v-if="scope.row.payType !== 0">支付金额：{{scope.row.payAmount}}元</span>
                        <span v-else>支付金额：- </span>
                    </template>
                </el-table-column>
                <el-table-column label="支付方式" width="120" align="center">
                    <template slot-scope="{ row }">
                        {{row.payType | paymentMethodTextFilter}}
                    </template>
                </el-table-column>

                <el-table-column prop="memberUsername" label="会员" align="center"></el-table-column>
                <el-table-column label="日期" width="240" align="center">
                    <template slot-scope="{ row }">
                        <span>创建时间：{{row.createTime}}</span>
                        <br />
                        <span>支付时间：{{row.paymentTime || '-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" align="center">
                    <template slot-scope="{ row }">
                        <el-button type="text" size="small" @click="detail(row)">详情</el-button>
                        <el-button v-if="row.status === 2 || row.status === 3" type="text" size="small">物流信息</el-button>
                        <el-button v-if="row.status === 1" type="text" size="small" @click="pay(row)">发货</el-button>
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
import { getPagination } from "@/api/oms/order";
import listMixin from '@/mixin/list';
import { statusMap, paymentMap } from "./order";

const defaultListQuery = {
    size: 10,
    current: 1,
    min: '',
    max: '', start: '', end: '', keywords: '', status: ''
};

export default {
    mixins: [listMixin],
    data() {
        return {
            defaultListQuery: { ...defaultListQuery },
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            statusList: Object.keys(statusMap).map(key => ({ label: statusMap[key], value: key }))
        };
    },
    created() {
        this.getPagination();
    },
    filters: {
        statusTextFilter(value) {
            return statusMap[value];
        },
        statusTagTypeFilter(value) {
            if (value === 1 || value === 0) {
                return "";
            }
            else if (value === 4) {
                return "danger";
            }
            else if (value === 3) {
                return "success";
            }
            else {
                return "warning";
            }
        },
        paymentMethodTextFilter(value) {
            return paymentMap[value] || "";
        }
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
        logistics(row) {
            console.log("物流 --->");
            console.log(row);
        },
        detail(row) {
            this.$router.push({
                path: '/oms/order/detail',
                query: {
                    id: row.id
                }
            });
        }
    },
};
</script>
