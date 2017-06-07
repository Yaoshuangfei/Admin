                 <template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="title" placeholder="产品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getlists">查询</el-button>
				</el-form-item>
				<router-link to="/productAdd">
					<el-form-item>
						<el-button type="primary">添加</el-button>
					</el-form-item>
				</router-link>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width:1000px">
			<el-table-column prop="title" label="产品名称">
			</el-table-column>
			<el-table-column prop="expectedAnnualRate" label="预计年化率">
			</el-table-column>
			<el-table-column prop="timeLimit" label="理财天数">
			</el-table-column>
			<el-table-column prop="financingAmount" label="融资金额">
			</el-table-column>
			<el-table-column prop="remainingAmount" label="剩余金额">
			</el-table-column>
			<el-table-column prop="buyPeopleCount" label="已购人数">
			</el-table-column>
			<el-table-column prop="productModulus" label="产品系数">
			</el-table-column>
			<el-table-column prop="status" label="产品状态">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<router-link :to="{ name: '理财产品修改', params: { id: scope.row.id }}">
						<el-button size="small">编辑</el-button>
					</router-link>
					<el-button type="danger" size="small" @click="handleLimit(scope.$index, scope.row)">权限</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">权限</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="product_name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--权限界面-->
		<el-dialog title="选择不可见地区" v-model="limitFormVisible" :close-on-click-modal="false">
			<el-form :model="limitForm" label-width="100px" :rules="limitFormRules" ref="limitForm">
				<el-form-item label="产品名称">
					<span>{{limitForm.product_name}}</span>
				</el-form-item>
				<div style="margin: 15px 0;"></div>
				<el-checkbox-group class="checkbox-style" v-model="checkList">
				    <el-checkbox class="check-style" v-for="city in cities" :label="city">{{city}}</el-checkbox>
				</el-checkbox-group>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
				<el-button @click.native="limitFormVisible = false">取消</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import { baseUrl , editUser, addUser } from '../../api/api';
	const cityOptions = ['嘉兴分公司', '上海分公司', '杭州分公司', '义乌分公司', '金华分公司', '绍兴分公司', '南京分公司', '湖州分公司'];
	export default {
		data() {
			return {
				title:'',
				users: [],
				total: 0,
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
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				limitFormVisible: false,//权限界面是否显示
				limitLoading: false,
				limitFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//权限界面数据
				limitForm: {
					product_name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				checkList: [],
				cities: cityOptions,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				table:[]
			}
		},
		methods: {
			getlists(){
				const _this = this
				_this.table = []
				// _this.listLoading = true;
				const params = {
					accountId:'1',
					accessToken:'1',
					resourcesType:'',
					page:{
						pageNum:_this.page,
						pageSize:'10'
					},
					financialProduct:{
						title:_this.title
					}
				}
				console.log(params)
				$.post(baseUrl+"/admin/financialProduct/getList",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj.results
		                console.log(response)
		                _this.total = response.obj.totalRecord
		                for(var i = 0;i<list.length;i++){
		                	_this.table.push(list[i])
		                	_this.table[i].expectedAnnualRate = list[i].expectedAnnualRate +list[i].addAnnualRate
		                }
		                console.log(_this.table)
						_this.listLoading = false;
		              }
		         	)
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlists();
			},
			//获取用户列表
			// getUsers() {
			// 	let para = {
			// 		page: this.page,
			// 		name: this.filters.name
			// 	};
			// 	this.listLoading = true;
			// 	//NProgress.start();
			// 	getUserListPage(para).then((res) => {
			// 		this.total = res.data.total;
			// 		this.users = res.data.users;
			// 		this.listLoading = false;
			// 		//NProgress.done();
			// 	});
			// },
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
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示权限界面
			handleLimit: function (index, row) {
				this.limitFormVisible = true;
				this.limitForm = Object.assign({}, row);
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
			}
		},
		mounted() {
			this.getlists();
		}
	}

</script>

<style lang="scss" scoped>
	.el-checkbox+.el-checkbox {
    margin-left: 0px;
	}
	.checkbox-style{
		// margin-left: 15px;
		.check-style{
			width: 150px;
		}
	}
</style>