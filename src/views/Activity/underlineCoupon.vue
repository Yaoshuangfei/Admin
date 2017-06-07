<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="标题"></el-input>
				</el-form-item>
				<span style="line-height: 2.5;">是否直接投放：
					<el-radio-group v-model="filters.choice">
					    <el-radio :label="3">是</el-radio>
					    <el-radio :label="6">否</el-radio>
					</el-radio-group>
				</span>
				<span class="demonstration">开始时间：</span>
		        <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间">
		        </el-date-picker>
		        <span class="demonstration">失效时间：</span>
		        <el-date-picker v-model="value2" type="datetime" placeholder="选择日期时间">
		        </el-date-picker>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> -->
				<router-link to="/underlineCouponAdd">
					<el-form-item>
						<el-button type="primary">添加</el-button>
					</el-form-item>
				</router-link>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="coupon" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="title" label="标题" width="120" >
			</el-table-column>
			<el-table-column prop="type" label="券类型" width="125">
			</el-table-column>
			<el-table-column prop="min_buy_money" label="最低购买金额" width="120">
			</el-table-column>
			<el-table-column prop="max_buy_money" label="最高购买金额" width="120">
			</el-table-column>
			<el-table-column prop="begin_time" label="使用起始时间" width="250">
			</el-table-column>
			<el-table-column prop="end_time" label="使用结束时间" width="250">
			</el-table-column>
			<el-table-column prop="every_count" label="限领次数" width="120">
			</el-table-column>
			<el-table-column prop="out_count" label="共发数量" width="80">
			</el-table-column>
			<el-table-column prop="left_count" label="剩余数量" width="80">
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间" width="120">
			</el-table-column>
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<router-link :to="{ name: '修改线下理财券', params: { id: post_id }}">
						<el-button size="small">操作</el-button>
					</router-link>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
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
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				post_id: '123',
				value2:'',
				value1:'',
				filters: {
					name: '',
					phone: '',
					choice:'',
					end_time:'',
					start_time:''
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
				coupon:[{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
				},{
					title: '范丽芳加息券',
					type: 10,
					min_buy_money: 450000,
					max_buy_money: 550000,
					begin_time: '2017-04-17 14:47:00',
					end_time: '2017-04-18 00:00:00',
					every_count: 1,
					out_count: 1,
					left_count: 0,
					create_time: '2017-04-17 14:46:18'
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