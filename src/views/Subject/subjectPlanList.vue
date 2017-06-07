<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="计划名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker
				      v-model="beginTime"
				      type="date"
				      placeholder="开始时间">
				    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-date-picker
				      v-model="endTime"
				      type="date"
				      placeholder="结束时间">
				    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<router-link :to="{ name: '计划发布', params: { id: 10101010101 ,index: 9}}">
						<el-button  type="primary" >新增计划</el-button>
					</router-link>
					<!-- <el-button type="primary" @click="handleAdd">发布计划</el-button> -->
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="计划ID" width="120" >
			</el-table-column>
			<el-table-column prop="title" label="名称" width="125">
			</el-table-column>
			<el-table-column prop="isNewer" label="角标" width="120">
			</el-table-column>
			<el-table-column prop="financingAmount" label="融资金额" width="120">
			</el-table-column>
			<el-table-column prop="subjectAmount" label="标的总金额" width="120">
			</el-table-column>
			<el-table-column prop="remainingAmount" label="剩余金额" width="120">
			</el-table-column>
			<el-table-column prop="expectedAnnualRate" label="预期年化" width="80">
			</el-table-column>
			<el-table-column prop="addAnnualRate" label="活动年化" width="80">
			</el-table-column>
			<el-table-column prop="purchaseMinAmount" label="最小起购" width="120">
			</el-table-column>
			<el-table-column prop="purchaseLimitCount" label="购买次数" width="120">
			</el-table-column>
			<el-table-column prop="purchaseLimitPerPeople" label="购买上线" width="120">
			</el-table-column>
			<el-table-column prop="beginTime" label="开始时间" width="120">
			</el-table-column>
			<el-table-column prop="timeLimit" label="项目期限" width="120" >
			</el-table-column>
			<el-table-column prop="bearingTheWayId" label="计息方式" width="140">
			</el-table-column>
			<el-table-column prop="repaymentId" label="还款方式" width="100">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="100">
			</el-table-column>
			<el-table-column label="查看" width="100">
				<template scope="scope">
					<!--  <el-button  type="text" size="small" @click="handleEdit(scope.$index, scope.row)">追加标的</el-button> -->
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
					<!-- <router-link :to="{ name: '计划发布', params: { id: scope.row.id }}">
						<el-button  type="text" >查看</el-button>
					</router-link> -->
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<router-link :to="{ name: '计划发布', params: { id: scope.row.id, index : 0}}">
						<el-button  type="text" >编辑</el-button>
					</router-link>
					<router-link :to="{ name: '计划发布', params: { id: scope.row.id, index : 1}}">
						<el-button  type="text" >查看详情</el-button>
					</router-link>
					<!-- <el-button v-if="scope.row.index === 0" type="text" size="small" @click="handleEdit(scope.$index, scope.row)">开启___匹配投资</el-button>
					<el-button v-else-if="scope.row.index === 1" type="text" size="small" @click="handleEdit(scope.$index, scope.row)">关闭___匹配投资</el-button> -->
					<!-- <el-button v-else type="text" size="small" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button> -->
					<!-- <router-link :to="{ name: '计划发布', params: { id: 010101010101 }}">
						<el-button  type="primary" >发布计划</el-button>
					</router-link> -->
					<!-- <router-link style="color:#20a0ff;text-decoration:none;font-size: 12px" v-else type="text" size="small" to='/addPlan'>查看详情</router-link> -->
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

		<!--编辑界面-->
		<el-dialog title="计划标的列表" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="计划名称：">
					<el-input v-model="editForm.jhName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="发布时间：">
					<el-input v-model="editForm.rongzi" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="预计年化：">
					<el-input v-model="editForm.shiji" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="计划周期(天)：">
					<el-input v-model="editForm.shenyu" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :span='24' class='head'>
					<span>剩余周期：</span>
					<span>15天</span>
				</el-col>
				<el-col :span='24' class='head'>
					<span>计划金额：</span>
					<span>20000</span>
				</el-col>
				<el-col :span='24' class='head'>
					<span>剩余待匹配金额(元)：</span>
					<span style="color: red">20000</span>
				</el-col>
				<el-col :span='24'>
					<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;">
						<el-table-column type='index' ></el-table-column>
						<el-table-column prop="id" label="标的项目名称" ></el-table-column>
						<el-table-column prop="id" label="总金额" ></el-table-column>
						<el-table-column prop="id" label="剩余金额" ></el-table-column>
						<el-table-column prop="id" label="周期" ></el-table-column>
					</el-table>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editFormVisible = false">关闭</el-button>
				<!-- <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button> -->
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
				value:'',
				endTime:'',
				beginTime:'',
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
					jhName: '',
					rongzi: '',
					shiji: '',
					shenyu: '',
					name1: '',
					name2: ''
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
			getList() {
				const _this = this
				_this.table = []
				const params = {
					accountId:"1",
		            accessToken:"1",
		            resourcesType:'',
		            page:{
		            	pageNum:'1',
		            	pageSize:'10'
		            },
		            beePlan:{
		            	title:_this.filters.title,
			            beginTime:_this.beginTime,
			            endTime:_this.endTime
		            }
				};
				this.listLoading = true;
				console.log(params)
				$.post(baseUrl+"/admin/beePlan/getList ",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                console.log(response)
	                const list = response.obj.results
	                if(list === null){
	                	_this.listLoading = false
	                	return
	                }
	                console.log(list)
	                for(var i = 0;i<list.length;i++){
	                	var obj = {}
	                	obj.id = list[i].id
	                	obj.title = list[i].title
	                	obj.isNewer = list[i].isNewer
	                	obj.financingAmount = list[i].financingAmount
	                	obj.subjectAmount = list[i].subjectAmount
	                	obj.remainingAmount = list[i].remainingAmount
	                	obj.expectedAnnualRate = list[i].expectedAnnualRate
	                	obj.addAnnualRate = list[i].addAnnualRate
	                	obj.purchaseMinAmount = list[i].purchaseMinAmount
	                	obj.purchaseLimitCount = list[i].purchaseLimitCount
	                	obj.purchaseLimitPerPeople = list[i].purchaseLimitPerPeople
	                	obj.beginTime = list[i].beginTime
	                	obj.timeLimit = list[i].timeLimit
	                	obj.bearingTheWayId = list[i].bearingTheWayId
	                	obj.repaymentId = list[i].repaymentId
	                	obj.status = list[i].status
	                	_this.table.push(obj)
	                }
	     //         	if(response.res === 1000000){
						// _this.$message({
						// 	message: '发布成功',
						// 	type: 'success'
						// });
	     //         	}else{
						// _this.$message({
						// 	message: '发布失败',
						// 	type: 'success'
						// });
	     //         	}
					_this.listLoading = false;
	              }
	         	)
			},
			//删除
			handleDel: function (index, row) {
				console.log(row)
				const _this = this
				_this.listLoading = false;
				const params = {
					accountId:"1",
		            accessToken:"1",
		            resourcesType:'',
		            id:row.id
				};
				console.log(params)
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(baseUrl+"/admin/beePlan/delete",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                console.log(response)
	             	if(response.res === 1000000){
						_this.$message({
							message: '删除成功',
							type: 'success'
						});
	             	}else{
						_this.$message({
							message: '删除失败',
							type: 'error'
						});
	             	}
	             	_this.getList();
					_this.listLoading = false;
	              }
	         	)
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
			this.getList();
		}
	}

</script>

<style scoped>
	.head{
		font-size: 22px;
		font-weight: bold;
		margin-left: 20px;
	}
	.el-input{
		width: 400px;
	}
	.el-textarea{
		width: 400px;
	}
</style>