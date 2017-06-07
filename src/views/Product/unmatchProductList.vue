<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="标的名称"></el-input>
				</el-form-item>
		        <el-date-picker v-model="filters.time" type="datetime" placeholder="到期时间">
		        </el-date-picker>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="unmatch_product" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="title" label="产品名称" width="120" >
			</el-table-column>
			<el-table-column prop="realname" label="姓名" width="125">
			</el-table-column>
			<el-table-column prop="regular_time_limit" label="理财天数" width="120">
			</el-table-column>
			<el-table-column prop="create_time" label="购买时间" width="180">
			</el-table-column>
			<el-table-column prop="regular_start_time" label="开始时间" width="180">
			</el-table-column>
			<el-table-column prop="regular_end_time" label="到期时间" width="180">
			</el-table-column>
			<el-table-column prop="remaining_time" label="剩余时间" width="80">
			</el-table-column>
			<el-table-column prop="investment_amount_wait" label="未匹配金额" width="120">
			</el-table-column>
			<el-table-column prop="status" label="订单状态" min-width="120">
				<template scope="scope">
			      	<span v-show="scope.row.status === 100">下单失败</span>
			      	<span v-show="scope.row.status === 200">下单成功</span>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: '',
					time: ''
				},
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
				unmatch_product:[{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 200
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 200
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				},{
					title: '商富1号-19',
					realname: '周峙辰',
					regular_time_limit: '100天',
					create_time: '2016-10-10 10:40:31',
					regular_start_time: '2016-10-11 10:40:31',
					regular_end_time: '2017-01-19 10:40:31',
					remaining_time: '101天',
					investment_amount_wait: '30000元',
					status: 100
				}]
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
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
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
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
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>