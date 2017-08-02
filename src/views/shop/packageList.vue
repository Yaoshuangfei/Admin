<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true" :model="filters">
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
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column type="index" label="序号">
			</el-table-column>
			<el-table-column prop="name" label="店铺名">
			</el-table-column>
			<el-table-column prop="coreUser.nickName" label="用户名">
			</el-table-column>
			<el-table-column prop="coreUser.mobile" label="手机号">
			</el-table-column>
			<el-table-column prop="orderSum" label="销量">
			</el-table-column>
			<el-table-column prop="turnoverSum" label="交易额">
			</el-table-column>
			<el-table-column prop="coreUser.availableIncome" label="账户余额">
			</el-table-column>
			<el-table-column prop="withdrawalsSum" label="已提现金额">
			</el-table-column>
			<el-table-column prop="status" :formatter='formatterType' label="状态">
			</el-table-column>
			<el-table-column prop="poundage" label="手续费1/%">
			</el-table-column>
			<el-table-column prop="serviceFeeSum" label="手续费总额">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" size="small" @click="seeBtn(scope.row)">查看</el-button>
					<el-button type="text" v-if='scope.row.status === 0' size="small" @click="passBtn(scope.row)">通过</el-button>
					<el-button type="text" v-if='scope.row.status === 0 ' size="small" @click="notpassBtn(scope.row)">不通过</el-button>
					<el-button type="text" v-if='scope.row.status === 3' size="small" @click="enableBtn(scope.row)">启用</el-button>
					<el-button type="text" v-if='scope.row.status === 1' size="small" @click="closeBtn(scope.row)">禁用</el-button>
					<!-- <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="店铺详情" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="orderDetails" label-width="120px">
				<el-form-item label="店铺名称">
					<div>{{orderDetails.name }}</div>
					<!-- <el-input v-model="addForm.name" type="text" auto-complete="off"></el-input> -->
				</el-form-item>
				<el-form-item label="用户名">
					<div>{{orderDetails.nickName}}</div>
				</el-form-item>
				<el-form-item label="手机号">
					<div>{{orderDetails.mobile }}</div>
				</el-form-item>
				<el-form-item label="店铺销量">
					<div>{{orderDetails.orderSum }}</div>
				</el-form-item>
				<el-form-item label="店铺营业额">
					<div>{{orderDetails.turnoverSum }}</div>
				</el-form-item>
				<el-form-item label="账户余额">
					<el-input style="width:100px" v-model="orderDetails.availableIncome"></el-input>
				</el-form-item>
				<el-form-item label="已提现金额">
					<div>{{orderDetails.withdrawalsSum}}</div>
				</el-form-item>
				<el-form-item label="违规记录">
					<div>{{orderDetails.illegalSum}}</div>
				</el-form-item>
				<el-form-item label="手续费">
					<div>{{orderDetails.withdrawalsSum}}</div>
				</el-form-item>
				<el-col :span='24'><h3>身份认证信息</h3></el-col>
				<el-form-item label="法人姓名">
					<div>{{orderDetails.coreUspAuthentication.realName}}</div>
				</el-form-item>
				<el-form-item label="法人身份证号">
					<div>{{orderDetails.coreUspAuthentication.legalCardCode}}</div>
				</el-form-item>
				<el-form-item label="手机号">
					<div>{{orderDetails.coreUspAuthentication.storeMobile}}</div>
				</el-form-item>
				<el-form-item label="银行名称">
					<div>{{orderDetails.coreUspAuthentication.bankName}}</div>
				</el-form-item>
				<el-form-item label="对公账户账号">
					<div>{{orderDetails.coreUspAuthentication.bankCode}}</div>
				</el-form-item>
				<el-form-item label="运营地址">
					<div>{{orderDetails.coreUspAuthentication.theAddress}}</div>
				</el-form-item>
				<el-form-item label="法人身份证">
					<img style="width: 100px" v-if="orderDetails.coreUspAuthentication.cardImgF !== '' " :src="orderDetails.coreUspAuthentication.cardImgF">
				</el-form-item>
				<el-form-item label="法人手持身份证">
					<img style="width: 100px" v-if="orderDetails.coreUspAuthentication.cardImgW  !== '' "  :src="orderDetails.coreUspAuthentication.cardImgW">
				</el-form-item>
				<el-form-item label="营业执照">
					<img style="width: 100px" v-if="orderDetails.coreUspAuthentication.businessLicense  !== '' "  :src="orderDetails.coreUspAuthentication.businessLicense">
				</el-form-item>
				<el-form-item label="银行开户许可证">
					<img style="width: 100px" v-if="orderDetails.coreUspAuthentication.bankImgW  !== '' "  :src="orderDetails.coreUspAuthentication.bankImgW">
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
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
				checked: true,
				value:'',
				value1:'',
				value2:'',
				selectSubjectStatus: [
				{
					value:'',
					label:'全部'
				},{
					value:1,
					label:'审核通过'
				},{
					value:2,
					label:'审核未通过'
				},{
					value:0,
					label:'待审核'
				}],
				options: [{
		          value: '0',
		          label: '全部'
		        }, {
		          value: '1',
		          label: '店铺名'
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
					name:'',
					nickName:'',
					mobile:'',
					orderSum:'',
					turnoverSum:'',
					availableIncome:'',
					withdrawalsSum:'',
					illegalSum:'',
					poundage:'',
					logo:'',
					id:'',
					coreUspAuthentication:{
						realName:'',
						legalCardCode:'',
						storeMobile:'',
						bankName:'',
						bankCode:'',
						theAddress:'',
						cardImgF:'',
						cardImgW:'',
						businessLicense:'',
						bankImgW:'',
					}
				},
				orderInformation:[]
			}
		},
		methods: {
			formatterType(row,column){
				let type = ''
				if(row.status === 0){
					type = '待审核'
				}else if(row.status === 1){
					type = '审核通过'
				}else if(row.status === 2){
					type = '审核未通过'
				}else if(row.status === 3){
					type = '禁用'
				}
				return type
			},
			getlist(){
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
				console.log(params)
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
                    }
                });
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			passBtn(row){
				const _this = this
				const params = {
					id:row.id
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/store/pass/status",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	if(data.code === 1){
                    		 _this.getlist()
                    	}
                    }
                });
			},
			notpassBtn(row){
				const _this = this
				const params = {
					id:row.id
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/store/notPass/status",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	if(data.code === 1){
                    		 _this.getlist()
                    	}
                    }
                });
			},
			enableBtn(row){
				const _this = this
				const params = {
					id:row.id
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/store/enable/status",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	if(data.code === 1){
                    		 _this.getlist()
                    	}
                    }
                });
			},
			closeBtn(row){
				const _this = this
				const params = {
					id:row.id
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/store/close/status",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	if(data.code === 1){
                    		 _this.getlist()
                    	}
                    }
                });
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
			seeBtn: function (row) {
				this.editFormVisible = true;
				console.log(row)
				this.orderDetails.name = row.name
				this.orderDetails.nickName = row.coreUser.nickName
				this.orderDetails.mobile = row.coreUser.mobile
				this.orderDetails.orderSum = row.orderSum
				this.orderDetails.turnoverSum = row.turnoverSum
				this.orderDetails.availableIncome = row.coreUser.availableIncome
				this.orderDetails.withdrawalsSum = row.withdrawalsSum
				this.orderDetails.illegalSum = row.illegalSum
				this.orderDetails.poundage = row.poundage
				this.orderDetails.logo = row.logo
				this.orderDetails.id = row.id
				if(row.coreUspAuthentication !== null){
					this.orderDetails.coreUspAuthentication.realName = row.coreUspAuthentication.realName
					this.orderDetails.coreUspAuthentication.legalCardCode = row.coreUspAuthentication.legalCardCode
					this.orderDetails.coreUspAuthentication.storeMobile = row.coreUspAuthentication.storeMobile
					this.orderDetails.coreUspAuthentication.bankName = row.coreUspAuthentication.bankName
					this.orderDetails.coreUspAuthentication.bankCode = row.coreUspAuthentication.bankCode
					this.orderDetails.coreUspAuthentication.theAddress = row.coreUspAuthentication.theAddress
					this.orderDetails.coreUspAuthentication.cardImgF = row.coreUspAuthentication.cardImgF
					this.orderDetails.coreUspAuthentication.cardImgW = row.coreUspAuthentication.cardImgW
					this.orderDetails.coreUspAuthentication.businessLicense = row.coreUspAuthentication.businessLicense
					this.orderDetails.coreUspAuthentication.bankImgW = row.coreUspAuthentication.bankImgW
				}

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
				const _this = this
				const params = {
					id:this.orderDetails.id,
					poundage:this.orderDetails.poundage,
					availableIncome:this.orderDetails.availableIncome
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/store/update/data",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	if(data.code === 1){
                    		_this.editFormVisible = false
                    		_this.getlist()
                    	}
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