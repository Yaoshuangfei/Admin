<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-select v-model="filters.channelId" placeholder="请选择渠道" clearable>
			      <el-option v-for="item in selectChannels" :label="item.name" :value="item.id">
			      </el-option>
			    </el-select>
				<span class="demonstration">开始时间：</span>
		        <el-date-picker v-model="filters.startTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
		        <span class="demonstration">至：</span>
		        <el-date-picker v-model="filters.endTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
				<el-form-item>
					<el-button type="primary" v-on:click="getSourceDataList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="statistics_list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="dateTime" :formatter = "formatter" label="日期" width="150">
			</el-table-column>
			<el-table-column prop="memberNumber" label="注册人数" width="150">
			</el-table-column>
			<el-table-column prop="bindBankMemberNumber" label="绑卡人数" width="150">
			</el-table-column>
			<el-table-column prop="otherBindBankMemberNumber" label="其他绑卡数" width="150">
			</el-table-column>
			<el-table-column prop="firstInvestmentMemberNumber" label="首次投资人数" width="150">
			</el-table-column>
			<el-table-column prop="investmentMoney" label="投资金额（元）" width="150">
			</el-table-column>
			<el-table-column prop="reInvestmentMemberNumber" label="复投人数" width="150">
			</el-table-column>
			<el-table-column prop="investmentMoneyActual" label="投资金额（元）" width="150">
			</el-table-column>
			<el-table-column prop="investmentTotalMoney" label="投资总金额（元）" width="150">
			</el-table-column>
			<el-table-column prop="investmentTotalMoneyActual" label="实际投资金额（元）" width="150">
			</el-table-column>
			<el-table-column label="操作" min-width="120">
				<template scope="scope">
					<el-button type="text" size="small" @click="returnDetail(scope.row.id)">导出明细</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
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
				value1:'',
				value2:'',
				selectChannels: [],
				// list:[{
				// 	value:'选项1',
				// 	label:'IOS'
				// },{
				// 	value:'选项1',
				// 	label:'91助手'
				// }],
				filters: {
					channelId: '',
					startTime: '',
					endTime: ''
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
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				statistics_list: []
			}
		},
		methods: {
			// 时间格式转换
			// 时间格式转换
			formatter(row,column){
				const curTime = row[column.property];
				if(curTime === null) {
					return null
				}
				return new Date(parseInt(curTime)).toLocaleString().replace('00:00:00', '');
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getSourceDataList();
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
			// 获得渠道
			getChannelsList() {
				this.listLoading = true
				const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: ''
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/channel/getAllChannels",
		            { param: JSON.stringify(params) },function(data){
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
	                	that.selectChannels = info.obj
		            }
		       );
	         	that.listLoading = false
         	},
			// 请求渠道数据统计列表
			getSourceDataList() {
				this.listLoading = true
				let startTime = '', endTime = ''
				if(this.filters.startTime === '' || this.filters.startTime === undefined) {
					startTime = ''
				} else {
					startTime = this.filters.startTime.getTime()
					console.log(startTime)
				}
				if(this.filters.endTime === '' || this.filters.endTime === undefined) {
					endTime = ''
				} else {
					endTime = this.filters.endTime.getTime()
					console.log(endTime)
				}
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: '',
		            page: {
		              pageSize: this.pageSize,
		              pageNum: this.page
		            },
		            channelId: this.filters.channelId,
		            startTime: startTime.toString(),
		            endTime: endTime.toString()
		            // toLocaleString()
		        }
		        console.log(baseUrl)
		        let that = this
	         	$.post(baseUrl+"/admin/channelStatistical/getStatisticalByParams",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	that.listLoading = false
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	that.statistics_list = info.obj.results
		                	that.page = info.obj.pageNum
		                	that.total = info.obj.totalRecord
		                	that.pageSize = info.obj.pageSize
		                	// console.log(_this.table)
		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
		                	alert(info.resMsg)
		              	}else if(info.res === state.HTTPCODE.FAIL){
		              		alert(info.resMsg)
		              	}
		            }
		       );
         	},
         	// 导出明细
         	returnDetail(detailId) {
         	    console.log(detailId)
         	    const params = {
         	        id: detailId,
         	        accountId: '',
		        	accessToken: '',
		        	resourceType: '',
         	    }
				let that = this
	         	$.post(baseUrl+"/admin/channelStatistical/export",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	that.listLoading = false
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	this.excel_url = response.data.value.file_path
         	                this.final_excel_url = `http://${this.url}${this.excel_url}`
         	                window.location.href = this.final_excel_url
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
			this.getChannelsList();
			this.getSourceDataList();
		}
	}

</script>

<style scoped>

</style>