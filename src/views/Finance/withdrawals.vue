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
				<el-form-item label="状态">
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
					<el-button type="primary" v-on:click="exportExcel">导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="userName" label="用户名">
			</el-table-column>
			<el-table-column prop="realName" label="姓名">
			</el-table-column>
			<el-table-column prop="mobile" label="手机号">
			</el-table-column>
			<el-table-column prop="amount" label="金额">
			</el-table-column>
			<el-table-column label="支付方式">
				<template scope="scope">
					<div>{{scope.row.bankCode}}</div>
					<div>{{scope.row.bankName}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="status" :formatter='formatter' label="状态">
			</el-table-column>
			<el-table-column prop="remarks" label="备注">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间">
			</el-table-column>
			<el-table-column prop="updateTime" :formatter='formatterTime1' label="更新时间">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button v-if='scope.row.index === 1' type='text' size="small" @click="handleEdit(scope.$index, scope.row)">暂停</el-button>
					<el-button v-else-if='scope.row.index === 0' :disabled="true" type='text' size="small" @click="handleEdit(scope.$index, scope.row)">已处理</el-button> -->
					<!-- <el-button type="text" size="small" @click="seeBtn(scope.$index, scope.row)">查看</el-button> -->
					<el-button type="text" v-if='scope.row.status === 1' size="small" @click="clearBtn(scope.row)">不通过</el-button>
					<el-button type="text" v-if='scope.row.status === 1' size="small" @click="uploadBtn(scope.row)">打款</el-button>
					<!-- <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--不通过-->
		<el-dialog title="不通过" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form  label-width="100px">
				<el-form-item label="不通过理由">
					<el-input v-model="notogood" type="text"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="clearSubmit" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
		<!--通过-->
		<el-dialog title="通过" v-model="okVisible" :close-on-click-modal="false" >
			<el-form  label-width="100px">
				<el-form-item label="备注">
					<el-input v-model="togood" type="text"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="okSubmit" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="okVisible = false">关闭</el-button>
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
				okVisible:false,
				togood:'',
				okId:'',
				notogood:'',
				notogoodId:'',
				table:[],
				radio: '0',
				startTime:'',
				endTime:'',
				checked: true,
				value:'',
				value1:'',
				value2:'',
				selectSubjectStatus: [
				{
					value:'1',
					label:'申请中'
				},{
					value:'2',
					label:'完成'
				},{
					value:'3',
					label:'提现失败'
				}],
				options: [{
		          value: '1',
		          label: '手机号码'
		        }, {
		          value: '2',
		          label: '用户名'
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

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				orderDetails: {
				},
				orderInformation:[{
					orderNumber :'145877458784524c',
					courierNumber :'145877458784524c',
					userName:'吸引力量',
					amountPaid :'300',
					orderTotal :'900',
					orderStatus :'待付款',
					paymentMethod :'微信支付',
					creationTime:'2017-09-08 17:09',
					deliveryTime:'2017-09-08 17:09',
					commodityName:'雨花说'
				}],
				cxparams:{}
			}
		},
		methods: {
			getlist(){
				const _this = this
				this.togood = ''
				this.notogood = ''
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
					userName:'',
					mobile:'',
					status:this.filters.status
				}
				if(this.filters.type === '1'){
					params.mobile = this.filters.name
				}else if(this.filters.type === '2'){
					params.userName = this.filters.name
				}
				console.log(params)
				this.cxparams = params
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userWithdrawal/findPage',
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                	const info = data.data
	                  	console.log(info)
	                  	_this.table = info.list
	                  	_this.total = info.total
	                  	_this.startTime = ''
	                  	_this.endTime = ''
	                  	for (var i = 0; i < _this.table.length; i++) {
	                  		_this.table[i].amount = '-'+_this.table[i].amount
	                  	}
	                }
	            })
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			getcxlist(){
				const _this = this
				const params = _this.cxparams
				params.pageNum = this.page
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/selectFlowList',
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
			// 打款
			uploadBtn(row){
				this.okVisible = true
				console.log(row)
				this.okId = row.id
			},
			okSubmit(){
				const _this = this
				const params = {
					id:this.okId,
					remarks:this.togood
				}
				console.log(params)
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userWithdrawal/finish',
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	if(data.code === 1){
	                  		_this.okVisible = false
	                  		_this.getlist()
	                  	}else {
	                  		alert(data.msg)
	                  	}
	                  	
	                }
	            })
			},
			// 不通过
			clearBtn(row){
				this.editFormVisible = true
				this.notogoodId = row.id
			},
			clearSubmit(){
				const _this = this
				const params = {
					id:this.notogoodId,
					remarks:this.notogood
				}
				console.log(params)
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userWithdrawal/checkfail',
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	_this.editFormVisible = false
	                  	_this.getlist()
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
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
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
			formatterTime(row, column){
				let curTime = row.createTime;
                curTime = new Date(curTime).toLocaleString()
                return curTime
			},
			formatterTime1(row, column){
				let curTime = row.updateTime;
				if(curTime === null){
					return curTime
				}
                curTime = new Date(curTime).toLocaleString()
                return curTime
			},
			formatter(row, column){
				let type = ''
				if(row.status === 1){
					type = '申请中 '
				}else if(row.status === 2){
					type = '完成'
				}else if(row.status === 3){
					type = '提现失败'
				}
				return type
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
					status:this.filters.status,
					source:'',
					startTime:this.startTime,
					endTime:this.endTime
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/platformInformation/withdrawals",
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