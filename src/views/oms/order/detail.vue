<template>
  <div class="app-container">
        <el-card style="padding: 40px 40px 10px;">
            <el-row>
                <el-col style="margin-bottom: 30px;">
                    <el-steps :active="active" align-center :finish-status="finishStatus" >
                        <el-step v-for="(item) in steps"
                            :key="item.title" :title="item.title"
                            :description="item.description"></el-step>
                    </el-steps>
                </el-col>
                <el-col style="margin-bottom: 40px;" v-if="detail.status === 4">
                    <el-alert
                        title="当前订单已关闭"
                        type="error" :closable="false">
                    </el-alert>
                </el-col>
                <el-col style="margin-bottom: 20px;">
                    <el-link icon="el-icon-edit" style="margin-bottom: 20px;">基本信息</el-link>
                    <el-table
                        :data="list" stripe style="width: 100%" size="medium" border>
                        <el-table-column prop="orderSn" label="订单号" align="center"></el-table-column>
                        <el-table-column label="支付方式" align="center">
                            <template slot-scope="{ row }">
                                {{row.payType | paymentMethodTextFilter}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="memberUsername" label="会员" align="center"></el-table-column>
                        <el-table-column prop="memberUsername" label="订单来源" align="center"></el-table-column>
                        <el-table-column prop="memberUsername" label="订单类型" align="center"></el-table-column>
                    </el-table>
                </el-col>
                <el-col style="margin-bottom: 20px;">
                    <el-link icon="el-icon-edit" style="margin-bottom: 20px;">收货人信息</el-link>
                    <el-table
                        :data="list" stripe style="width: 100%" size="medium" border>
                        <el-table-column prop="receiverPhone" label="联系电话" align="center"></el-table-column>
                        <el-table-column prop="receiverName" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="receiverPostCode" label="邮编" align="center"></el-table-column>
                        <el-table-column label="地址" align="center">
                            <template slot-scope="scope">
                                {{scope.row.receiverProvince}} {{scope.row.receiverCity}} {{scope.row.receiverRegion}} {{scope.row.receiverDetailAddress}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col>
                    <el-link icon="el-icon-edit" style="margin-bottom: 20px;">商品信息</el-link>
                    <el-table
                        :data="detail.items" stripe style="width: 100%" size="medium" border>
                        <el-table-column prop="productName" label="名称" align="center"></el-table-column>
                        <el-table-column prop="productBrand" label="品牌" align="center"></el-table-column>
                        <el-table-column prop="productPrice" label="价格" align="center"></el-table-column>
                        <el-table-column prop="productQuantity" label="数量" align="center"></el-table-column>
                        <el-table-column label="小计" align="center">
                            <template slot-scope="scope">
                                {{scope.row.productPrice * scope.row.productQuantity}}元
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="text-align: right; margin-top: 20px; font-size: 14px;">
                        <div style="display: inline-block; margin-bottom: 5px;">合计：{{detail.totalAmount}}元</div>
                        <br />
                        <div style="display: inline-block;">实际支付：{{detail.payAmount}}元</div>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { paymentMap } from "./order";
import { getDetail } from "@/api/oms/order";

const statusToFieldMap = {
    0: {
        field: 'createTime',
        desc: '下单'
    }, // 下单时间
    1: {
        field: 'paymentTime',
        desc: '付款',
    }, // 支付时间
    2: {
        field: 'deliveryTime',
        desc: '发货'
    }, // 发货时间
    3: {
        field: 'receiveTime',
        desc: '完成'
    }, // 确认收货时间
};

export default {
    data() {
        return {
            steps: Object.keys(statusToFieldMap)
                .filter(item => +item !== 4)
                .map(key => ({ 
                    title: statusToFieldMap[key].desc,
                    value: statusToFieldMap[key].field,
                    description: ''
                })),
            detail: {},
            list: []
        }
    },
    filters: {
        paymentMethodTextFilter(value) {
            return paymentMap[value] || "";
        }
    },
    created() {
        this.getDetail();
    },
    computed: {
        finishStatus() {
            return 'success';
        },
        // 不必记录在哪一个节点中断的；若流程被中断，一律返回1
        active() {
            let status = this.detail.status;

            if (status >= 4) {
                return 1;
            }
            else {
                return ++status;
            }
        }
    },
    methods: {
        async getDetail() {
            const { id } = this.$route.query;
            const resp = await getDetail(id);

            if (resp.code !== 0) {
                return this.$message.error("获取数据失败");
            }
            this.detail = resp.data;
            if (!this.detail.items) {
                this.detail.items = [];
            }
            this.list = [this.detail];

            this.setStepDescriptions(this.detail);
        },
        setStepDescriptions(detail) {
            for (const step of this.steps) {
                step.description = detail[step.value];
            }
        }
    },
}
</script>

<style>

</style>