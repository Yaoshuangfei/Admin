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
		<el-table :data="templateList" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="description" label="名称" width="300" >
			</el-table-column>
			<el-table-column prop="templateContent" label="内容" width="500" >
			</el-table-column>
			<el-table-column prop="createTime" :formatter = "formatter" label="创建时间" width="200" >
			</el-table-column>
			<el-table-column label="操作" min-width="200">
				<template scope="scope">
					<!-- <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
					<el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="添加短信" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" :label-position="labelPosition" label-width="50px" :rules="addFormRules" ref="addForm">
				<el-row>
		  			<el-col :xs="24" :md="24">
		  				<div style="height: 15px;width: 100%;"></div>
		  			</el-col>
		  			<el-col :xs="24" :md="24">
		  				<el-form-item label="名称:">
							<el-input v-model="addForm.description" auto-complete="off"></el-input>
						</el-form-item>
		  			</el-col>
		  			<el-col :xs="24" :md="24">
		  				<el-input :rows="7" placeholder='尊敬的［用户名］您好，具体的内容' v-model='addForm.templateContent' type="textarea"></el-input>
		  				<span class="pull-right">{{ addMessageLength }}</span>
		  				<span class="pull-right">字数统计</span>
		  			</el-col>
		  			<el-col :xs="24" :md="24">
		  				<el-button type="primary" size="small" @click="addCustomerName">用户名</el-button>
		  			</el-col>
	  			</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<!-- <el-dialog title="编辑短信" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" :label-position="labelPosition" label-width="50px" :rules="editFormRules" ref="editForm">
				<el-row>
		  			<el-col :xs="24" :md="24">
		  				<div style="height: 15px;width: 100%;"></div>
		  			</el-col>
		  			<el-col :xs="24" :md="24">
		  				<el-form-item label="名称:">
							<el-input v-model="editForm.description" auto-complete="off"></el-input>
						</el-form-item>
		  			</el-col>
		  			<el-col :xs="24" :md="24">
		  				<el-input :rows="7" placeholder='尊敬的［用户名］您好，具体的内容' v-model='editForm.templateContent' type="textarea"></el-input>
		  				<span class="pull-right">{{ editMessageLength }}</span>
		  				<span class="pull-right">字数统计</span>
		  			</el-col>
		  			<el-col :xs="24" :md="24">
		  				<el-button type="primary" size="small" @click="editCustomerName">用户名</el-button>
		  			</el-col>
	  			</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog> -->
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
				labelPosition: 'left',
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列

				// editFormVisible: false,//编辑界面是否显示
				// editLoading: false,
				// editFormRules: {
				// 	name: [
				// 		{ required: true, message: '请输入姓名', trigger: 'blur' }
				// 	]
				// },
				//编辑界面数据
				// editForm: {
				// 	description: '',
				// 	templateContent: ''
				// },
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					description: '',
					templateContent: ''
				},
				templateList: [],
				realName: '[realname]'
			}
		},
		computed: {
            addMessageLength () {
                return this.addForm.templateContent.length + 0
            }
            // editMessageLength () {
            //     return this.editForm.templateContent.length + 0
            // }
        },
		methods: {
			// 时间格式转换
			formatter(row,column){
				const curTime = row[column.property];
				if(curTime === null || curTime === '') {
					return null
				}
				return new Date(parseInt(curTime)).toLocaleString();
			},
			addCustomerName() {
                this.addForm.templateContent += this.realName
            },
            // editCustomerName() {
            //     this.editForm.templateContent += this.realName
            // },
			handleCurrentChange(val) {
				this.page = val;
				this.getTemplatesList();
			},
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
			            messageTemplateId: row.id
			        }
			        let that = this
		         	$.post(baseUrl+"/admin/messageTemplate/deleteTemplateById",
			            { param: JSON.stringify(params) },function(data){
			              	const info = JSON.parse(eval('(' + data + ')'));
			              	console.log(info)
			              	if(info.res === state.HTTPCODE.SUCCEED){
			              		that.$message({
			              			message: info.resMsg,
			              			type: 'success'
			              		});
			              		that.getTemplatesList()
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
		         	that.listLoading = false;
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
			// editSubmit: function () {
			// 	this.$refs.editForm.validate((valid) => {
			// 		if (valid) {
			// 			this.$confirm('确认提交吗？', '提示', {}).then(() => {
			// 				this.editLoading = true;
			// 				//NProgress.start();
			// 				const params = {
			// 		        	accountId: '',
			// 		        	accessToken: '',
			// 		        	resourceType: '',
			// 		            messageTemplateEntity: {
			// 		              	description: this.addForm.description,
			// 		              	templateContent: this.addForm.templateContent

			// 		            }
			// 		        }
			// 		        console.log(params)
			// 		        let that = this
			// 	         	$.post(baseUrl+"/admin/messageTemplate/addMessageTemplate",
			// 		            { param: JSON.stringify(params) },function(data){
			// 		              	const info = JSON.parse(eval('(' + data + ')'));
			// 		              	console.log(info)
			// 		              	that.addLoading = false;
			// 		              	if(info.res === state.HTTPCODE.SUCCEED){
			// 		              		// console.log(info.resMsg)
			// 		              		that.addFormVisible = false;
			// 		              		that.$message({
			// 		              			message: info.resMsg,
			// 		              			type: 'success'
			// 		              		});
			// 		              		that.getTemplatesList();
			// 		                	// that.$router.push({ name: '审核标的', params: { borrowId: row.borrowId }})
			// 		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
			// 		                	that.$message({
			// 		              			message: info.resMsg,
			// 		              			type: 'error'
			// 		              		});
			// 		              	}else if(info.res === state.HTTPCODE.FAIL){
			// 		              		that.$message({
			// 		              			message: info.resMsg,
			// 		              			type: 'error'
			// 		              		});
			// 		              	}
			// 		            }
			// 		       );
			// 			});
			// 		}
			// 	});
			// },
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							const params = {
					        	accountId: '',
					        	accessToken: '',
					        	resourceType: '',
					            messageTemplateEntity: {
					              	description: this.addForm.description,
					              	templateContent: this.addForm.templateContent

					            }
					        }
					        console.log(params)
					        let that = this
				         	$.post(baseUrl+"/admin/messageTemplate/addMessageTemplate",
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
					              		that.getTemplatesList();
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
			// 短信模板管理列表
			getTemplatesList() {
				this.listLoading = true
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: '',
		            page: {
		              pageSize: this.pageSize,
		              pageNum: this.page
		            }
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/messageTemplate/getAllTemplateByPage",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	that.listLoading = false
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	that.templateList = info.obj.results
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
			this.getTemplatesList();
		}
	}

</script>

<style scoped>

</style>