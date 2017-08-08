<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true">
				<el-date-picker v-model="startTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
		        <span class="demonstration">至</span>
		        <el-date-picker v-model="endTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="支付银行"></el-input>
				</el-form-item> -->
				<el-form-item label="业务充值类型">
					<el-select v-model="filters.tags" clearable>
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
				    <el-input v-model="filters.value"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getlist">搜索</el-button>
					<el-button type="primary">导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderInformation" @selection-change="selsChange" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column type="index" label="序号">
			</el-table-column>
			<el-table-column prop="userName" label="昵称">
			</el-table-column>
			<el-table-column prop="mobile" label="手机号">
			</el-table-column>
			<el-table-column prop="attrName" label="充值号码">
			</el-table-column>
			<el-table-column prop="quantity" :formatter='formatterType' label="充值类型">
			</el-table-column>
			<el-table-column prop="productPrice" label="充值金额">
			</el-table-column>
			<el-table-column prop="costPrice" label="原价">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="充值时间">
			</el-table-column>
			<el-table-column prop="orderStatus" :formatter='formatterStatus' label="状态">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" size="small" v-if="scope.row.orderStatus !== 11" @click="shenheBtn(scope.row)">审核</el-button>
					<el-button type="text" size="small" @click="upBtn(scope.row)">充值</el-button>
					<el-button type="text" size="small" @click="notpassBtn(scope.row)">不通过</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<el-button type="danger" @click="batchRemove" :disabled="this.delID.length===0">批量审核</el-button>
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
				delID:[],
				radio: '0',
				startTime:'',
				endTime:'',
				checked: true,
				value:'',
				value1:'',
				value2:'',
				selectSubjectStatus: [
				{
					value:'',
					label:'全部'
				},{
					value:'1',
					label:'话费充值'
				},{
					value:'2',
					label:'流量充值'
				},{
					value:'3',
					label:'加油卡'
				},{
					value:'4',
					label:'视频充值'
				}],
				options: [{
		          value: '0',
		          label: '全部'
		        }, {
		          value: '1',
		          label: '充值号码'
		        }, {
		          value: '2',
		          label: '手机号码'
		        }, {
		          value: '3',
		          label: '用户名'
		        }],
				filters: {
					tags: '',
					value:'',
					type:''
				},
				users: [],
				total: 100,
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

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				orderDetails: {
				},
				orderInformation:[],
				cxparams:{}
			}
		},
		methods: {
			// 批量删除
			selsChange: function (sels) {
				this.delID = [];
				for(var i=0;i<sels.length;i++){
					this.delID.push(sels[i].id);
				}
				console.log(this.delID)
			},
			// 批量删除
			batchRemove(){
				const _this = this
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/check/businessCard',
	                data:JSON.stringify(this.delID),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	_this.getlist()
	                }
	            })
			},
			//单个删除
			shenheBtn(row){
				const _this = this
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/check/businessCard',
	                data:JSON.stringify([row.id]),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	_this.getlist()
	                }
	            })
			},
			//充值
			upBtn(row) {
				console.log(row)
				const _this = this
				const params = {
					id:row.id
				}
				console.log(params)
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/finish/businessCard',
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	_this.getlist()
	                }
	            })
			},
			notpassBtn(row){
				const _this = this
				const params = {
					id:row.id
				}
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/fail/businessCard',
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	_this.getlist()
	                }
	            })
			},
			getlist(){
				const _this = this
				_this.listLoading = true
					// console.log(_this.startTime.toISOString())
					// console.log(_this.endTime.toISOString())
					
				if(this.startTime !== ''){
					_this.startTime = state.formatDate(_this.startTime)
				}
				if(this.endTime !== ''){
					_this.endTime = state.formatDate(_this.endTime)
				}
				const params = {
					pageNum:this.page,
					pageSize:10,
					startTime:_this.startTime,
					endTime:_this.endTime,
					attrName:'',
					mobile:'',
					userName:'',
					orderStatus:'',
					tags:this.filters.tags
				}
				console.log(params)
				if(this.filters.type === '1'){
					params.attrName = this.filters.value
				}else if(this.filters.type === '2'){
					params.mobile = this.filters.value
				}else if(this.filters.type === '3'){
					params.userName = this.filters.value
				}
				_this.cxparams = params
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/manage/businessCard',
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                	const info = data.data
	                  	console.log(info)
	                  	_this.total = info.total
	                  	_this.orderInformation = info.list
	                  	_this.startTime = ''
	                  	_this.endTime = ''
	                  	_this.listLoading = false
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
	                url:baseUrl+'/api/admin/userCashFlow/manage/businessCard',
	                data:JSON.stringify(_this.cxparams),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	const info = data.data.list
	                  	_this.total = data.data.total
	                  	_this.orderInformation = info
	                  	console.log(info)
	                }
	            })
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
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
			formatterTime(row, column){
				let curTime = row.createTime;
                curTime = new Date(curTime).toLocaleString()
                return curTime
			},
			formatterType(row, column){
				let type = ''
				if(row.quantity === 1){
					type = '话费充值'
				}else if(row.quantity === 2){
					type = '流量充值'
				}else if(row.quantity === 3){
					type = '加油卡'
				}else if(row.quantity === 4){
					type = '视频充值'
				}
				return type
			},
			formatterStatus(row, column){
				let status = ''
				if(row.orderStatus === 2){
					status = '充值中'
				}else if(row.orderStatus === 8){
					status = '已完成'
				}else if(row.orderStatus === 11){
					status = '审核中'
				}
				return status
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