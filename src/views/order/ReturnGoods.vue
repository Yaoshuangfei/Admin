<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true" :model="filters">
				<el-form-item label="搜索类型">
				    <el-select v-model="filters.type" clearable>
				      <el-option v-for="item in options" :label="item.label" :value="item.value">
				      </el-option>
				    </el-select>
				</el-form-item>
				<el-form-item>
				    <el-input v-model="filters.name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getlist">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderEvaluate" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="orderId" label="订单编号">
			</el-table-column>
			<el-table-column prop="orderGoods.productName" label="商品名称">
			</el-table-column>
			<el-table-column prop="coreUser.nickName" label="用户名">
			</el-table-column>
			<el-table-column prop="coreUser.mobile" label="手机号">
			</el-table-column>
			<el-table-column prop="orderGoods.orderStatus" :formatter='orderStatu'  label="订单状态">
			</el-table-column>
			<el-table-column prop="refundType" :formatter='refunType'  label="退款类型">
			</el-table-column>
			<el-table-column prop="refundStatus" :formatter='refunStatu'  label="退款状态">
			</el-table-column>
			<el-table-column prop="causeType" :formatter='causType'  label="退款原因">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button type="text" size="small" @click="seeBtn(scope.$index, scope.row)">查看</el-button> -->
					<el-button type="text" size="small" @click="pass(scope.row)">通过</el-button>
					<el-button type="text" size="small" @click="nopass(scope.row)">不通过</el-button>
					<!-- <el-button type="text" size="small" @click="deldetBtn(scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--同意界面-->
		<el-dialog title="审核" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form label-width="80px" >
				<el-form-item label="密码">
					<el-input v-model="password" type="password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item v-if="diinfo" label="退货地址">
					<el-input v-model="bzCont" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item v-else label="备注">
					<el-input v-model="bzCont" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="tongyiSubmit">确定</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
		<!--不同意界面-->
		<el-dialog title="审核" v-model="noVisible" :close-on-click-modal="false" >
			<el-form label-width="80px" >
				<el-form-item label="密码">
					<el-input v-model="nopassword" type="password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="拒绝原因">
					<el-input v-model="notLy" type="text"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="noupSubmit">确定</el-button>
				<el-button type="primary" @click.native="noVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl , editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				sele:[],
				tyId:'',
				bzCont:'',
				diinfo:false,
				shenhenopaid:'',
				notLy:'',
				nopassword:'',
				noVisible:false,
				editFormVisible:false,
				password: '',
				options: [{
		          value: '0',
		          label: '全部'
		        }, {
		          value: '1',
		          label: '订单编号'
		        }, {
		          value: '2',
		          label: '用户名'
		        }],
				filters: {
					name: '',
					status:'',
					type:''
				},
				total: 0,
				page: 1,
				listLoading: false,
				orderEvaluate:[{
					orderGoods:{
						productName:'',
						orderStatus:''
					},
					coreUser:{
						userName:'',
						mobile:''
					}
				}]
			}
		},
		methods: {
			//通过
			pass(row){
				console.log(row)
				this.editFormVisible = true
				this.tyId = row.refundId
				if(row.refundType === '2'){
					this.diinfo = true
				}
			},
			tongyiSubmit(){
				const params = {
					refundId: this.tyId,
					refundStatus:3,
					payPwd:this.password,
					sellerCause:this.bzCont
				}
				if(this.diinfo){
					params.refundStatus = 4
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/refundOrder/update",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        if(data.code !== 1){
	                        alert(data.msg)
                        }else{
                        	_this.getlist()
                        }
                    }
                })
			},
			// 不通过
			nopass(row){
				this.noVisible = true
				this.shenhenopaid = row.refundId
			},
			noupSubmit(){
				const params = {
					refundId: this.shenhenopaid,
					refundStatus:3,
					payPwd:this.nopassword,
					sellerCause:this.notLy
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/refundOrder/update",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                    }
                })
			},
			getlist(){
				const _this = this
				_this.table = []
				const params = {
					pageNum:_this.page,
					size:10
				}
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/refundOrder/selectAllList",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        const info = data.data
                        _this.total = info.total
                        _this.orderEvaluate = info.list
                    }
                })
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			refunType(row, column){
				let type = ''
				if(row.refundType === '1'){
					type = '仅退款'
				}else if(row.refundType === '2'){
					type = '退款退货'
				}
				return type
			},
			refunStatu(row, column){
				let type = ''
				if(row.refundStatus === 1){
					type = '退款中'
				}else if(row.refundStatus === 2){
					type = '退款成功'
				}else if(row.refundStatus === 3){
					type = '退款失败'
				}else if(row.refundStatus === 4){
					type = '商家同意买家填写退货物流信息'
				}
				return type
			},
			causType(row, column){
				let type = ''
				if(row.causeType === '1'){
					type = '无理由退款'
				}else if(row.causeType === '2'){
					type = '商品质量问题'
				}else if(row.causeType === '3'){
					type = '收到商品与描述不符'
				}else if(row.causeType === '4'){
					type = '商品错发、漏发'
				}
				return type
			},
			orderStatu(row, column){
				let type = ''
				if(row.orderGoods.orderStatus === 1){
					type = '支付中'
				}else if(row.orderGoods.orderStatus === 2){
					type = '支付成功'
				}else if(row.orderGoods.orderStatus === 3){
					type = '支付失败'
				}else if(row.orderGoods.orderStatus === 4){
					type = '已取消'
				}else if(row.orderGoods.orderStatus === 5){
					type = '买家已发货'
				}else if(row.orderGoods.orderStatus === 6){
					type = '已收货'
				}else if(row.orderGoods.orderStatus === 7){
					type = '已评价'
				}else if(row.orderGoods.orderStatus === 8){
					type = '交易完成'
				}else if(row.orderGoods.orderStatus === 9){
					type = '售后处理'
				}else if(row.orderGoods.orderStatus === 10){
					type = '已删除'
				}
				return type
			}
		},
		mounted() {
			this.getlist();
		}
	}

</script>

<style>
	.el-dialog--small {
    	width: 25%;
    	border-radius: 10px
	}	
</style>