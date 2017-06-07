<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="title" label="名称">
			</el-table-column>
			<el-table-column prop="description" label="说明">
			</el-table-column>
			<el-table-column prop="get_passwd" label="口令">
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
					<el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" :label-position="labelPosition" label-width="100px" :rules="addFormRules" ref="addForm">
				<el-row>
		  			<el-col :xs="24">
						<el-form-item label="类型:">
							<el-select v-model="addForm.type" placeholder="请选择">
							    <el-option
							      v-for="item in package_options"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
						  	</el-select>
						</el-form-item>
				  	</el-col>
				  	<el-col :xs="24">
						<el-form-item label="礼包名称:">
							<el-input v-model="addForm.title"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-form-item label="礼包说明:">
							<el-input type="textarea" v-model="addForm.description"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-form-item label="领取口令:">
							<el-input v-model="addForm.get_passwd" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-form-item label="发行总数:">
							<el-input v-model="addForm.tatal_send" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-form-item label="每人限领次数:">
							<el-input v-model="addForm.every_count" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-form-item label="开始时间:">
							<el-date-picker v-model="addForm.begin_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-form-item label="失效时间:">
							<el-date-picker v-model="addForm.end_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-checkbox-group class="checkbox-style" v-model="checkList">
						    <el-checkbox class="check-style" v-for="package in packages" :label="package">{{package}}</el-checkbox>
						 </el-checkbox-group>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	const packageOptions = ['红包理财券', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司'];
	export default {
		data() {
			return {
				labelPosition: 'left',
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					type: 10,
					title: '',
					description: '',
					get_passwd: '',
					tatal_send: '',
					every_count: '',
					begin_time: '',
					end_time: '',
				},
				checkList: [],
				packages: packageOptions,
				package_options: [{
		          value: 10,
		          label: '计划礼包'
		        }, {
		          value: 20,
		          label: '标的礼包'
		        }],
				table:[{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
				},{
					title:"五周年活动短信",
					description:"五周年活动短信五周年活动短信五周年活动短信五周年活动短信五周年活动",
					get_passwd:"元旦快乐",
					create_time:"2016.10.08 12:01:45"
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

<style lang="scss" scoped>
	.el-checkbox+.el-checkbox {
    	margin-left: 0px;
	}
	.checkbox-style{
		.check-style{
			width: 150px;
		}
	}
</style>