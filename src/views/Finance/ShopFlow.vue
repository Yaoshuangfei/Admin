<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true" :model="filters">
				<el-date-picker v-model="startTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
		        <span class="demonstration">至</span>
		        <el-date-picker v-model="endTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="支付银行"></el-input>
				</el-form-item> -->
				<el-form-item label="支付方式">
					<el-select v-model="filters.status" clearable>
				      <el-option v-for="item in selectSubjectStatus" :label="item.label" :value="item.value">
				      </el-option>
				    </el-select>
				</el-form-item>
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
					<el-button type="primary" @click="exportExcel">导出</el-button>
					<router-link :to="{ name: '店铺流水记录'}"   style="margin: 0 10px;">
						<el-button  type="primary">返回上级</el-button>
					</router-link>
				</el-form-item>
			</el-form>
			<el-col :span="24" style="padding-bottom: 20px;font-size: 18px;margin-top: 5px;">
				<el-col :span="4">店铺总销量：{{topObj.orderSum}}</el-col>
				<el-col :span="4">已提现金额：{{topObj.withdrawalsSum}}</el-col>
				<el-col :span="4">店铺交易额：{{topObj.turnoverSum}}</el-col>
				<el-col :span="4">店铺交易手续费：{{topObj.serviceFeeSum}}</el-col>
				<el-col :span="4">账户余额：{{topObj.coreUser.availableIncome}}</el-col>
			</el-col>
		</el-col>

		<!--列表-->
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="orderMallId" label="订单编号">
			</el-table-column>
			<el-table-column prop="userName" label="用户名">
			</el-table-column>
			<el-table-column prop="mobile" label="手机号">
			</el-table-column>
			<el-table-column prop="quota" label="金额">
			</el-table-column>
			<el-table-column prop="type" :formatter='formatterStatus' label="支付">
			</el-table-column>
			<el-table-column prop="payType" :formatter='formatterType' label="收入方式">
			</el-table-column>
			<el-table-column prop="centType" :formatter='formatter' label="来源">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间">
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="订单详情" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="orderDetails" label-width="160px" :rules="editFormRules" ref="editForm">
				<el-form-item label="订单号">
					<div>{{orderDetails.orderNumber }}</div>
					<!-- <el-input v-model="addForm.name" type="text" auto-complete="off"></el-input> -->
				</el-form-item>
				<el-form-item label="商品名称">
					<div>{{orderDetails.commodityName}}</div>
				</el-form-item>
				<el-form-item label="用户名">
					<div>{{orderDetails.userName }}</div>
				</el-form-item>
				<el-form-item label="实付金额">
					<div>{{orderDetails.amountPaid }}</div>
				</el-form-item>
				<el-form-item label="订单总价">
					<div>{{orderDetails.orderTotal }}</div>
				</el-form-item>
				<el-form-item label="订单状态">
					<div>{{orderDetails.orderStatus }}</div>
				</el-form-item>
				<el-form-item label="支付方式">
					<div>{{orderDetails.paymentMethod }}</div>
				</el-form-item>
				<el-form-item label="创建时间">
					<div>{{orderDetails.creationTime}}</div>
				</el-form-item>
				<el-form-item label="发货时间">
					<div>{{orderDetails.deliveryTime}}</div>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<!-- <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button> -->
				<el-button type="primary" @click.native="editFormVisible = false">关闭</el-button>
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
				topObj: {
					coreUser:{
						availableIncome:''
					}
				},
				startTime:'',
				endTime:'',
				checked: true,
				value:'',
				value1:'',
				value2:'',
				selectSubjectStatus: [
				{
					value:'0',
					label:'全部'
				},{
					value:'1',
					label:'微信支付'
				},{
					value:'2',
					label:'余额支付'
				},{
					value:'3',
					label:'支付宝支付'
				},{
					value:'4',
					label:'银行卡支付'
				}],
				options: [{
		          value: '0',
		          label: '全部'
		        }, {
		          value: '1',
		          label: '订单编号'
		        }, {
		          value: '2',
		          label: '用户名'
		        }, {
		          value: '3',
		          label: '手机号'
		        }],
				filters: {
					name: '',
					status:'',
					type:''
				},
				users: [],
				total: 1,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					username: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				cxparams:{},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				orderDetails: {
				},
				orderInformation:[]
			}
		},
		methods: {
			// 获取店铺列表
			getgoodsList(){
				const _this = this
				_this.orderInformation = []
				const params = {
					pageNum:this.page,
					size:10,
					name:'',
					nickName:'',
					mobile:'',
					status:this.filters.status,
					id:''
				}
				if(this.filters.type === '1'){
					params.name = this.filters.name
				}else if(this.filters.type === '2'){
					params.nickName = this.filters.name
				}else if(this.filters.type === '3'){
					params.mobile = this.filters.name
				}else if(this.filters.type === '0'){
					params.name = ''
				}
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/store/find/page",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	const info = data.data
                    	_this.orderInformation = info.list
                    	_this.total = info.total
                    	for(var i = 0;i<_this.orderInformation.length;i++){
                    		if(_this.orderInformation[i].pmType === 0){
                    			_this.orderInformation[i].quota = '-'+_this.orderInformation[i].quota
                    		}else{
                    			_this.orderInformation[i].quota = '+'+_this.orderInformation[i].quota
                    		}
                    	}
                    	console.log(_this.orderInformation)
                    }
                });
			},
			getlist(){
				const _this = this
				if(this.startTime !== ''){
					_this.startTime = state.formatDate(_this.startTime)
				}
				if(this.endTime !== ''){
					_this.endTime = state.formatDate(_this.endTime)
				}
				const params = {
					type:'',
					storeId:this.$route.params.id,
					pageNum:this.page,
					pageSize:10,
					startTime:_this.startTime,
					endTime:_this.endTime,
					payType:this.filters.status,
					tradeNo:'',
					userName:'',
					mobile:'',
					sort:'4'
				}
				if(this.filters.type === '1'){
					params.tradeNo = this.filters.name
				}else if(this.filters.type === '2'){
					params.userName = this.filters.name
				}else if(this.filters.type === '3'){
					params.mobile = this.filters.name
				}
				console.log(params)
				_this.cxparams = params
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/selectStoreFlowList',
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                	const info = data.data
	                  	console.log(info)
	                  	_this.total = info.total
	                  	_this.orderInformation = info.list
	                  	_this.startTime = ''
	                  	_this.endTime = ''
	                  	for(var i = 0;i<_this.orderInformation.length;i++){
                    		if(_this.orderInformation[i].pmType === 0){
                    			_this.orderInformation[i].quota = '-'+_this.orderInformation[i].quota
                    		}else{
                    			_this.orderInformation[i].quota = '+'+_this.orderInformation[i].quota
                    		}
                    	}
	                }
	            })
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getcxlist();
			},
			getcxlist(){
				const _this = this
				const params = _this.cxparams
				params.pageNum = this.page
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/selectStoreFlowList',
	                data:JSON.stringify(_this.cxparams),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	const info = data.data.list
	                  	_this.total = data.data.total
	                  	_this.orderInformation = info
	                  	console.log(info)
	                  	for(var i = 0;i<_this.orderInformation.length;i++){
                    		if(_this.orderInformation[i].pmType === 0){
                    			_this.orderInformation[i].quota = '-'+_this.orderInformation[i].quota
                    		}else{
                    			_this.orderInformation[i].quota = '+'+_this.orderInformation[i].quota
                    		}
                    	}
	                }
	            })
			},
			//显示编辑界面
			seeBtn: function (index, row) {
				this.editFormVisible = true;
				this.orderDetails = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			formatterTime(row, column){
				let curTime = row.createTime;
                curTime = new Date(curTime).toLocaleString()
                return curTime
			},
			//支付方式
			formatterType(row, column) {
				let type = ''
				if(row.payType === 0){
					type = '微信支付'
				}else if(row.payType === 1){
					type = '支付宝支付'
				}else if(row.payType === 2){
					type = '银联支付'
				}else if(row.payType === 3){
					type = '余额支付'
				}else if(row.payType === 4){
					type = '余额金豆混合支付'
				}else if(row.payType === 5){
					type = '金豆支付'
				}
				return type
			},
			formatter(row, column){
				let type = ''
				if(row.centType === 1){
					type = '购买平台身份'
				}else if(row.centType === 2){
					type = '购买店铺身份'
				}else if(row.centType === 3){
					type = '购买产品'
				}else if(row.centType === 4){
					type = '补货 '
				}else if(row.centType === 5){
					type = '业务充值'
				}else if(row.centType === 6){
					type = '扫码支付'
				}
				return type
			},
			//支付
			formatterStatus(row, column) {
				let status = ''
				if(row.type === 1){
					status = '提现'
				}else if(row.type === 2){
					status = '分佣'
				}else if(row.type === 3){
					status = '业务充值'
				}else if(row.type === 4){
					status = '余额充值'
				}else if(row.type === 5){
					status = '商品购买'
				}else if(row.type === 6){
					status = '店铺身份购买'
				}else if(row.type === 7){
					status = '平台身份购买'
				}else if(row.type === 8){
					status = '补货'
				}else if(row.type === 9){
					status = '金豆充值'
				}else if(row.type === 10){
					status = '金豆支出'
				}else if(row.type === 11){
					status = '店铺收入'
				}else if(row.type === 12){
					status = '手续费'
				}else if(row.type === 13){
					status = '便付劵充值'
				}else if(row.type === 14){
					status = '便付劵转赠'
				}else if(row.type === 15){
					status = '便付劵兑换金豆'
				}else if(row.type === 16){
					status = '商家会员钱包转平台钱包'
				}
				return status
			},
			getObl(){
				const _this = this
				const params = {
					name:null,
					nickName:null,
					mobile:null,
					status:null,
					id:null,
					pageNum:1,
					size:5,
					storeId:this.$route.params.id
				}
				params.pageNum = this.page
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/store/find/page',
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	const info = data.data.list
	                  	console.log(data)
	                  	_this.topObj = info[0]
	                }
	            })
			},
			exportExcel(){
				const _this = this
				if(this.startTime !== '' && this.startTime !== undefined){
					_this.startTime = state.formatDate(_this.startTime)
				}
				if(this.endTime !== '' && this.endTime !== undefined){
					_this.endTime = state.formatDate(_this.endTime)
				}
				const params = {
					type:'',
					startTime:_this.startTime,
					endTime:_this.endTime,
					storeId:this.$route.params.id,
					sort:'',
					source:''
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/platformInformation/store/account",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        window.location.href = data.msg
                    }
                })
			}
		},
		mounted() {
			this.getlist()
			this.getObl()
		}
	}

</script>

<style>
	.el-dialog--small {
    	width: 25%;
    	border-radius: 10px
	}	
</style>