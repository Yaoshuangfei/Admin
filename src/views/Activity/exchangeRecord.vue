<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.mobilePhone" placeholder="手机号码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.realname" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getExchangeList">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">添加商品</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="exchange_list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="orderNo" label="订单号" width="120" >
			</el-table-column>
			<el-table-column prop="member.realname" label="用户名" width="125">
			</el-table-column>
			<el-table-column prop="member.mobilePhone" label="手机号码" width="120">
			</el-table-column>
			<el-table-column prop="commodityEntity.title" label="兑换商品" width="120">
			</el-table-column>
			<el-table-column prop="memberAddress.detail" label="收件地址" width="250">
			</el-table-column>
			<el-table-column prop="points" label="消费积分" width="100">
			</el-table-column>
			<el-table-column label="订单状态" width="100">
				<template scope="scope">
					<span v-show="scope.row.status === 0">等待审核</span>
					<span v-show="scope.row.status === 1">取消或作废</span>
					<span v-show="scope.row.status === 2">下单失败</span>
					<span v-show="scope.row.status === 3">下单成功</span>
					<span v-show="scope.row.status === 4">已完成/关闭</span>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="兑换时间" :formatter = "formatter" width="120">
			</el-table-column>
			<el-table-column prop="updateTime" label="更新时间" :formatter = "formatter" width="120">
			</el-table-column>
			<el-table-column prop="operation_people" label="操作人" width="120">
			</el-table-column>
			<el-table-column prop="finishTime" label="完成时间" :formatter = "formatter" width="120">
			</el-table-column>
			<el-table-column prop="remark" label="物流公司" width="120">
			</el-table-column>
			<el-table-column prop="expressNo" label="物流单号" width="120">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="text" size="small" v-if="scope.row.status === 0" @click="handleSend(scope.$index, scope.row)">发送</el-button>
					<el-button type="text" size="small" v-else>已发货</el-button>
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

		<!--发送界面-->
		<el-dialog title="发送审核" v-model="sendFormVisible" :close-on-click-modal="false">
			<el-form :model="sendForm" label-width="120px" :rules="sendFormRules" ref="sendForm">
				<el-form-item label="请选择物流公司:">
					<el-input v-model="sendForm.tracking_company" auto-complete="off"></el-input>
					<!-- <el-select v-model="sendForm.company" placeholder="请选择物流公司">
		      			<el-option v-for="item in tracking_companies" :label="item.label" :value="item.value">
		      			</el-option>
		    		</el-select> -->
	    		</el-form-item>
				<el-form-item label="请输入物流单号:">
					<el-input v-model="sendForm.tracking_number" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="sendFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="sendSubmit" :loading="sendLoading">发货</el-button>
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
					mobilePhone: '',
					realname: ''
				},
				users: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列

				sendFormVisible: false,//编辑界面是否显示
				sendLoading: false,
				sendFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//发送界面数据
				sendForm: {
					id: '',
					tracking_number: '',
					tracking_company: ''
				},
				tracking_companies:[{
					value:'选项1',
					label:'顺丰快递'
				},{
					value:'选项2',
					label:'申通快递'
				},{
					value:'选项3',
					label:'圆通快递'
				},{
					value:'选项4',
					label:'天天快递'
				}],

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
				exchange_list:[]
			}
		},
		methods: {
			formatter(row,column){
				const curTime = row[column.property];
				if(curTime === null) {
					return null
				}
				return new Date(parseInt(curTime)).toLocaleString();
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getExchangeList();
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
			handleSend: function (index, row) {
				this.sendFormVisible = true;
				this.sendForm = Object.assign({},row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;

			},
			//编辑
			sendSubmit: function () {
				this.$refs.sendForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							// this.sendLoading = true;
					        const params = {
					        	accountId: '',
					        	accessToken: '',
					        	resourceType: '',
					            page: {
					              pageSize: this.pageSize,
					              pageNum: this.page
					            },
					            mallOrderEntity: {
					            	id: this.sendForm.id,
					            	remark: this.sendForm.tracking_company,
					            	expressNo: this.sendForm.tracking_number,
					            }
					        }
					        let that = this
				         	$.post(baseUrl+"/admin/mallOrder/updateOrderExpressById",
					            { param: JSON.stringify(params) },function(data){
					            	// console.log(data)
					              	const info = JSON.parse(eval('(' + data + ')'));
					              	console.log(info)
					              	that.sendLoading = false
					              	if(info.res === state.HTTPCODE.SUCCEED){
					                	that.$message({
					                		message: info.resMsg,
					                		type: 'success'
					                	});
					                	that.sendFormVisible = false;
					                	that.getExchangeList();
					                	// that.exchange_list = info.obj.results
					                	// that.page = info.obj.pageNum
					                	// that.total = info.obj.totalRecord
					                	// that.pageSize = info.obj.pageSize
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
							//NProgress.start();
							// let para = Object.assign({}, this.editForm);
							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							//  editUser(para).then((res) => {
							// 	this.editLoading = false;
							// 	//NProgress.done();
							// 	this.$message({
							// 		message: '提交成功',
							// 		type: 'success'
							// 	});
							// 	this.$refs['sendForm'].resetFields();
							// 	this.sendFormVisible = false;
							// 	this.getUsers();
							// });
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
			// 积分商城兑换记录列表
			getExchangeList() {
				this.listLoading = true
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: '',
		            page: {
		              pageSize: this.pageSize,
		              pageNum: this.page
		            },
		            memberEntity: {
		            	mobilePhone: this.filters.mobilePhone,
		            	realname: this.filters.realname
		            }
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/mallOrder/getOrdersByMember",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	that.listLoading = false
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	that.exchange_list = info.obj.results
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
			this.getExchangeList();
		}
	}

</script>

<style scoped>

</style>