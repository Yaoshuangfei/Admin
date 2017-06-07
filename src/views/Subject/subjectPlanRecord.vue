<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="计划名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
			    <el-select v-model="value" placeholder="订单状态">
			      <el-option v-for="item in list" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
			    <el-select v-model="value1" placeholder="处理状态">
			      <el-option v-for="item in list1" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getlist">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="id" label="订单号">
			</el-table-column>
			<el-table-column prop="jhnane" label="计划名称">
			</el-table-column>
			<el-table-column prop="phone" label="手机号码">
			</el-table-column>
			<el-table-column prop="username" label="客户姓名">
			</el-table-column>
			<el-table-column prop="gmje" label="购买金额">
			</el-table-column>
			<el-table-column prop="nhsy" label="年化收益">
			</el-table-column>
			<el-table-column prop="yqsy" label="预期收益">
			</el-table-column>
			<el-table-column prop="xmqx" label="项目期限">
			</el-table-column>
			<el-table-column prop="gmtime" label="购买时间">
			</el-table-column>
			<el-table-column prop="tzly" label="投资来源">
			</el-table-column>
			<el-table-column prop="state" label="订单状态">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button v-if='scope.row.index === 1' type='text' size="small" @click="handleEdit(scope.$index, scope.row)">匹配标的</el-button>
					<el-button v-else-if='scope.row.index === 0' :disabled="true" type='text' size="small" @click="handleEdit(scope.$index, scope.row)">已处理</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
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
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="订单编号：">
					{{editForm.id}}
				</el-form-item>
				<el-form-item label="手机号码：">
					{{editForm.phone}}
				</el-form-item>
				<el-form-item label="用户名：">
					{{editForm.username}}
				</el-form-item>
				<el-form-item label="购买时间：">
					{{editForm.gmtime}}
				</el-form-item>
				<el-form-item label="购买金额：">
					{{editForm.gmje}}
				</el-form-item>
				<el-col :span="24" style="font-size: 2em;font-weight: 500;margin-left: 35px;"><span style="color:red;">15</span>天计划总金额：20000,还差：<span style="color:red;">10000</span></el-col>
				<el-col :span='24'></el-col>
				<el-col :span='24'>
					<el-table :data="pplist" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 800px;">
						<el-table-column prop="bdname" label="标的的项目名称">
						</el-table-column>
						<el-table-column prop="zje" label="总金额">
						</el-table-column>
						<el-table-column prop="syje" label="剩余金额">
						</el-table-column>
						<el-table-column type="selection" label="是否匹配">
							<!-- <template scope="scope">
								<el-checkbox v-model="false">111</el-checkbox>
							</template> -->
						</el-table-column>
						<el-table-column prop="ppje" label="匹配金额">
						</el-table-column>
					</el-table>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="margin-left: -100px;margin-top: 20px;">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">取消</el-button>
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

	export default {
		data() {
			return {
				checked: true,
				value:'',
				value1:'',
				value2:'',
				pplist:[],
				list:[{
					value:'选项1',
					label:'成功'
				},{
					value:'选项1',
					label:'失败'
				},{
					value:'选项1',
					label:'等待'
				},{
					value:'选项1',
					label:'已完成'
				},{
					value:'选项1',
					label:'作废'
				}],
				list1:[{
					value:'选项1',
					label:'待处理'
				},{
					value:'选项1',
					label:'已处理'
				}],
				filters: {
					name: ''
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
					username: '',
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
				table:[]
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				// this.getUsers();
			},
			//获取用户列表
			getlist() {
				let _this = this
				const params = {
					accountId: '1',
					accessToken: '1',
					page: {
						pageNum: this.page,
						pageSize: '10'
					},
					subjectOrderSearchParams:{
						orderNo:'',
						status:'',
						beePlan:{
							title:''
						},
						member:{
							mobilePhone:'',
							realname:''
						}
					}
				};
				console.log(params)
				this.listLoading = true;
				$.post(baseUrl+"/admin/beePlan/order/getList",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	if(response.res === 1000000){
							_this.$message({
								message: '成功',
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg,
								type: 'error'
							});
		             	}
		             	_this.getlist();
		              }
		         	)
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
						// this.getUsers();
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
								// this.getUsers();
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
								// this.getUsers();
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
						// this.getUsers();
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

<style scoped>

</style>