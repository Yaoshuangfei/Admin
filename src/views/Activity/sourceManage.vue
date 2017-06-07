<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.channelName" placeholder="渠道名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' v-on:click="getSourceList">查询</el-button>
					<el-button type="primary" @click="handleAdd">添加渠道</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="generalize_channer_list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="name" label="渠道名称" width="150">
			</el-table-column>
			<el-table-column prop="key" label="渠道标识" width="150">
			</el-table-column>
			<el-table-column prop="url" label="渠道链接" width="150">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="150">
			</el-table-column>
			<el-table-column label="渠道类型" width="150">
				<template scope="scope">
			      <span v-show="scope.row.type === 100">APP分包</span>
			      <span v-show="scope.row.type === 200">H5渠道</span>
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="150">
			</el-table-column>
			<el-table-column label="操作" min-width="120">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="渠道名称:">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="渠道标识:">
					<el-input v-model="editForm.key" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="渠道类型:">
				    <el-select  v-model="editForm.type" clearable>
				    	<el-option
								v-for="item in sourceType"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="渠道链接:">
					<el-input v-model="editForm.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注:">
					<el-input :rows="6" type="textarea" v-model="editForm.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加渠道" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="渠道名称:">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="渠道标识:">
					<el-input v-model="addForm.key" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="渠道类型:">
				    <el-select  v-model="addForm.type" clearable>
				    	<el-option
								v-for="item in sourceType"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="渠道链接:">
					<el-input v-model="addForm.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注:">
					<el-input :rows="6" type="textarea" v-model="addForm.remark"></el-input>
				</el-form-item>
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
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, baseUrl } from '../../api/api';
	import { state } from '../../vuex/state'
	export default {
		data() {
			return {
				filters: {
					channelName: ''
				},
				users: [],
				total: 0,
				page: 1,
				pageSize: 10,
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
					id: '',
					name: '',
					key: '',
					url: '',
					type: '',
					remark: ''
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
					key: '',
					url: '',
					type: '',
					remark: ''
				},
				sourceType: [{
					value: 100,
					label:'APP分包'
				},{
					value: 200,
					label:'H5渠道'
				}],
				generalize_channer_list: []
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getSourceList();
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
					const params = {
			        	accountId: '',
			        	accessToken: '',
			        	resourceType: '',
			            id: row.id
			        }
			        console.log(params)
			        let that = this
		         	$.post(baseUrl+"/admin/channel/deleteChannelById",
			            { param: JSON.stringify(params) },function(data){
			              	const info = JSON.parse(eval('(' + data + ')'));
			              	console.log(info)
			              	that.listLoading = false;
			              	if(info.res === state.HTTPCODE.SUCCEED){
			              		// console.log(info.resMsg)
			              		that.$message({
			              			message: info.resMsg,
			              			type: 'success'
			              		});
			              		that.getSourceList();
			                	// that.$router.push({ name: '审核标的', params: { borrowId: row.borrowId }})
			              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
			                	that.$message({
			              			message: info.resMsg,
			              			type: 'error'
			              		});
			              	}else if(info.res === state.HTTPCODE.FAIL){
			              		that.$message({
			              			message: info.resMsg,
			              			type: 'error'
			              		});
			              	}
			            }
			       );
					// NProgress.start();
					// let para = { id: row.id };
					// removeUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '删除成功',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
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
							const params = {
					        	accountId: '',
					        	accessToken: '',
					        	resourceType: '',
					            channelEntity: {
					            	id: this.editForm.id,
					              	name: this.editForm.name,
					              	key: this.editForm.key,
					              	url: this.editForm.url,
					              	type: this.editForm.type,
					              	remark: this.editForm.remark
					            }
					        }
					        console.log(params)
					        let that = this
				         	$.post(baseUrl+"/admin/channel/updateChannelById",
					            { param: JSON.stringify(params) },function(data){
					              	const info = JSON.parse(eval('(' + data + ')'));
					              	console.log(info)
					              	that.editLoading = false;
					              	if(info.res === state.HTTPCODE.SUCCEED){
					              		// console.log(info.resMsg)
					              		that.editFormVisible = false;
					              		that.$message({
					              			message: info.resMsg,
					              			type: 'success'
					              		});
					              		that.getSourceList();
					                	// that.$router.push({ name: '审核标的', params: { borrowId: row.borrowId }})
					              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
					                	that.$message({
					              			message: info.resMsg,
					              			type: 'error'
					              		});
					              	}else if(info.res === state.HTTPCODE.FAIL){
					              		that.$message({
					              			message: info.resMsg,
					              			type: 'error'
					              		});
					              	}
					            }
					       );
							//NProgress.start();
							// let para = Object.assign({}, this.editForm);
							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							// editUser(para).then((res) => {
							// 	this.editLoading = false;
							// 	//NProgress.done();
							// 	this.$message({
							// 		message: '提交成功',
							// 		type: 'success'
							// 	});
							// 	this.$refs['editForm'].resetFields();
							// 	this.editFormVisible = false;
							// 	this.getUsers();
							// });
						});
					}
				});
			},
			//添加渠道
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							const params = {
					        	accountId: '',
					        	accessToken: '',
					        	resourceType: '',
					            channelEntity: {
					              	name: this.addForm.name,
					              	key: this.addForm.key,
					              	url: this.addForm.url,
					              	type: this.addForm.type,
					              	remark: this.addForm.remark
					            }
					        }
					        console.log(params)
					        let that = this
				         	$.post(baseUrl+"/admin/channel/addChannel",
					            { param: JSON.stringify(params) },function(data){
					              	const info = JSON.parse(eval('(' + data + ')'));
					              	console.log(info)
					              	that.addLoading = false;
					              	if(info.res === state.HTTPCODE.SUCCEED){
					              		// console.log(info.resMsg)
					              		that.addFormVisible = false;
					              		that.$message({
					              			message: info.resMsg,
					              			type: 'success'
					              		});
					              		that.getSourceList();
					                	// that.$router.push({ name: '审核标的', params: { borrowId: row.borrowId }})
					              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
					                	that.$message({
					              			message: info.resMsg,
					              			type: 'error'
					              		});
					              	}else if(info.res === state.HTTPCODE.FAIL){
					              		that.$message({
					              			message: info.resMsg,
					              			type: 'error'
					              		});
					              	}
					            }
					       );
							// that.$refs['addForm'].resetFields();
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
			// 请求渠道数据列表
			getSourceList() {
				this.listLoading = true
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: '',
		            page: {
		              pageSize: this.pageSize,
		              pageNum: this.page
		            },
		            channelName: this.filters.channelName
		        }
		        console.log(baseUrl)
		        let that = this
	         	$.post(baseUrl+"/admin/channel/findChannelsByTitle",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	that.listLoading = false
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	that.generalize_channer_list = info.obj.results
		                	that.page = info.obj.pageNum
		                	that.total = info.obj.totalRecord
		                	that.pageSize = info.obj.pageSize
		                	// console.log(_this.table)
		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
		                	that.$message({
		                		message: info.resMsg,
		                		type: 'error'
		                	});
		              	}else if(info.res === state.HTTPCODE.FAIL){
		              		that.$message({
		                		message: info.resMsg,
		                		type: 'error'
		                	});
		              	}
		            }
		       );
         	}
		},
		mounted() {
			this.getSourceList();
		}
	}

</script>

<style scoped>

</style>