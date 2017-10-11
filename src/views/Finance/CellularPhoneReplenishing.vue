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
					<el-button type="primary" @click="exportExcel">导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
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
			<el-table-column prop="payType" :formatter='ispayType' label="充值来源">
			</el-table-column>
			<el-table-column prop="productPrice" label="充值金额">
			</el-table-column>
			<el-table-column prop="productName" label="原价">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="充值时间">
			</el-table-column>
		<!-- 	<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" size="small" @click="seeBtn(scope.$index, scope.row)">查看</el-button>
				</template>
			</el-table-column> -->
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
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
				radio: '0',
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
		          value: '',
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
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			getlist(){
				const _this = this
				this.listLoading = true
				if(this.startTime !== ''){
					_this.startTime = state.formatDate(_this.startTime)
				}
				if(this.endTime !== ''){
					_this.endTime = state.formatDate(_this.endTime)
				}
				const params = {
					pageNum:this.page,
					pageSize:20,
					startTime:_this.startTime,
					endTime:_this.endTime,
					attrName:'',
					mobile:'',
					userName:'',
					tags:this.filters.tags
				}
				if(this.filters.type === '1'){
					params.attrName = this.filters.value
				}else if(this.filters.type === '2'){
					params.mobile = this.filters.value
				}else if(this.filters.type === '3'){
					params.userName = this.filters.value
				}
				console.log(params)
				_this.cxparams = params
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/find/businessCard',
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
	                url:baseUrl+'/api/admin/userCashFlow/find/businessCard',
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
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
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
			ispayType(row, column){
				if(row.payType === 0){
					return '微信支付'
				}else if(row.payType === 1){
					return '支付宝支付'
				}else if(row.payType === 2){
					return '银联支付'
				}else if(row.payType === 3){
					return '余额支付'
				}else if(row.payType === 4){
					return '余额金豆混合支付'
				}else if(row.payType === 5){
					return '金豆支付'
				}else if(row.payType === 6){
					return '在线支付'
				}
			},
			exportExcel(){
				const params = {
					tags:this.filters.tags,
					type:'2',
					startTime:'',
					endTime:''
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/platformInformation/recharge",
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