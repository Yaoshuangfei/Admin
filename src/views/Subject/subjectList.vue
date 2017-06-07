<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.borrowRealname" placeholder="借款人姓名"></el-input>
				</el-form-item>
				  <el-form-item>
					<el-input v-model="filters.borrowMobilePhone" placeholder="借款人手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.subjectTitle" placeholder="标的名称"></el-input>
				</el-form-item>
				<el-select v-model="filters.subjectType" clearable placeholder="请选择标的类型">
			      <el-option v-for="item in selectSubjectTypes" :label="item.title" :value="item.id">
			      </el-option>
			    </el-select>
			    <el-select v-model="filters.subjectStatus" clearable placeholder="标的状态">
			      <el-option v-for="item in selectSubjectStatus" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getList">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="SubjectList" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="subjectId" label="序号" width="120" >
			</el-table-column>
			<el-table-column prop="contractNo" label="合同号" width="125">
			</el-table-column>
			<el-table-column prop="mobilePhone" label="手机号码" width="125">
			</el-table-column>
			<el-table-column prop="borrowerName" label="真实姓名" width="120">
			</el-table-column>
			<el-table-column prop="title" label="借款标题" width="250">
			</el-table-column>
			<el-table-column prop="financingAmount" label="借款金额（元）" width="120">
			</el-table-column>
			<el-table-column prop="purchaseMinAmount" label="最小认购单位（元）" width="120">
			</el-table-column>
			<el-table-column prop="expectedAnnualRate" label="利率（%）" width="100">
				<template scope="scope">
					<span>{{scope.row.expectedAnnualRate}}</span>
					<span v-if="scope.row.addAnnualRate === 0 || scope.row.addAnnualRate === null"></span>
					<span v-else> + {{scope.row.addAnnualRate}}</span>
				</template>
			</el-table-column>
			<el-table-column label="借款期限" width="120">
				<template scope="scope">
					<span v-if="scope.row.repaymentId === 1">{{scope.row.timeLimit}}天</span>
					<span v-else-if="scope.row.repaymentId === 2">{{scope.row.timeLimit}}个月</span>
					<span v-else></span>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" :formatter = "formatter" label="发布时间" width="160">
			</el-table-column>
			<el-table-column label="投标记录" width="100">
				<template scope="scope">
					<el-button type="text" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="updateTime" :formatter = "formatter" label="复审时间" width="160">
			</el-table-column>
			<el-table-column prop="remainingAmount" label="标的可购买金额(元)" width="120">
			</el-table-column>
			<el-table-column prop="status" label="状态" :formatter = "formatterState" width="100">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<router-link class="routerColor" v-if="scope.row.status === 0 && scope.row.disabled === 0" :to="{ name: '查看或发布标的', params: { borrowId: scope.row.borrowId, subjectId: scope.row.subjectId}}">发布</router-link>
					<router-link class="routerColor" v-else :to="{ name: '查看或发布标的', params: { borrowId: scope.row.borrowId, subjectId: scope.row.subjectId}}">查看</router-link>
					<el-button v-if="scope.row.status === 0 && scope.row.disabled === 0" type="text" @click="handleCheck(scope.$index, scope.row)">打回待审</el-button>
					<!-- <router-link to="see">打回待审</router-link> -->
					<el-button v-if="scope.row.status === 200" type="text" @click="handleMatch(scope.$index, scope.row)">金额匹配</el-button>
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
		<el-dialog  v-model="editFormVisible" :close-on-click-modal="false">
			<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 50%;">
				<el-table-column prop="id" label="ID">
				</el-table-column>
				<el-table-column prop="number" label="投标人">
				</el-table-column>
				<el-table-column prop="name" label="投标金额">
				</el-table-column>
				<el-table-column prop="user_name" label="有效投标金额">
				</el-table-column>
				<el-table-column prop="loan_number" label="奖励">
				</el-table-column>
				<el-table-column prop="loan_number" label="回收本息">
				</el-table-column>
				<el-table-column prop="min_company" label="投标类型">
				</el-table-column>
				<el-table-column prop="interest_rate" label="投标时间">
				</el-table-column>
			</el-table>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;margin: 20px 0;">
			</el-pagination>
		</el-dialog>
		<!--金额匹配界面-->
		<el-dialog  title="金额匹配" v-model="matchFormVisible" :close-on-click-modal="false">
			<el-form :model="matchInfo" label-width="160px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标的名称：">
					<span>{{matchInfo.name}}</span>
				</el-form-item>
				<el-form-item label="发布时间：">
					<span>{{matchInfo.createTime}}</span>
				</el-form-item>
				<el-form-item label="周期：">
					<span style="font-size: 18px">{{matchInfo.cycle}}</span>
				</el-form-item>
				<el-form-item label="标的总金额（元）：">
					<span style="font-size: 18px">{{matchInfo.totalMoney}}</span>
				</el-form-item>
				<el-form-item label="剩余金额（元）：">
					<span style="color: red; font-size: 18px">{{matchInfo.remainingAmount}}</span>
				</el-form-item>
				<el-form-item label="本次匹配（元）：">
					<span style="color: red; font-size: 18px">{{matchInfo.matchMoney}}</span>
				</el-form-item>
			</el-form>
			<el-table :data="matchInvestors" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 50%;">
				<el-table-column prop="name" label="投资人">
				</el-table-column>
				<el-table-column prop="remainingAmount" label="剩余金额">
				</el-table-column>
				<el-table-column prop="remainingTime" label="剩余时间（天）">
				</el-table-column>
				<el-table-column label="匹配金额">
					<template scope="scope">
				        <input style="width: 80%" v-model="scope.row.matchMoney">
			      	</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click="handleMember" :loading="memberLoading">+添加投资人</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 可选会员列表 -->
		<el-dialog title="可选会员列表" v-model="memberFormVisible" :close-on-click-modal="false">
			<el-col :span="24" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="memberForm.bdname" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type='primary' v-on:click="getList">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span='24' style='margin-bottom: 20px;'>
				<el-table :data="table1" border highlight-current-row v-loading="listLoading" style="width: 100%">
					<el-table-column prop="id" label="用户姓名"  >
					</el-table-column>
					<el-table-column prop="user_name" label="投资金额"  >
					</el-table-column>
					<el-table-column prop="user_name" label="剩余投资金额"  >
					</el-table-column>
					<el-table-column prop="user_name" label="剩余投资期限(天)"  >
					</el-table-column>
					<el-table-column type='selection' label="选择"  >
					</el-table-column>
				</el-table>
			</el-col>
			<div slot="footer" class="dialog-footer" style="text-align: left;
    margin-left: 40%;">
				<el-button type="primary" @click.native="memberSubmit" :loading="memberLoading">保存</el-button>
				<el-button type="primary" @click.native="memberFormVisible = false">取消</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<!-- <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
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
		</el-dialog> -->
	</section>
</template>

<script>
	import util from '../../common/js/util';
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, baseUrl } from '../../api/api';
	import { state } from '../../vuex/state'

	export default {
		data() {
			return {
				value:'',
				value1:'',
				value2:'',
				//金额匹配信息
				matchInfo: {
					name:'金华-雪佛兰科鲁兹-质押标',
					createTime: '2017-03-22 19:50:34',
					cycle: '15天周期',
					totalMoney: 20000,
					remainingAmount: 10000,
					matchMoney: 200
				},
				// 投资人匹配
				matchInvestors: [{
					name:'张三',
					remainingAmount: 160000,
					remainingTime: 30
				},{
					name:'张三',
					remainingAmount: 160000,
					remainingTime: 30
				}],
				memberFormVisible: false,//会员列表页面是否显示
				memberLoading: false,
				memberForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				selectSubjectTypes:[],

				// subjectTypes:[{
				// 	value:'100',
				// 	label:'新手标'
				// },{
				// 	value:'200',
				// 	label:'手机专享标'
				// },{
				// 	value:'300',
				// 	label:'定向标/VIP标'
				// },{
				// 	value:'400',
				// 	label:'普通标'
				// },{
				// 	value:'500',
				// 	label:'理财产品匹配专用标'
				// },{
				// 	value:'600',
				// 	label:'计划标的'
				// }],

				selectSubjectStatus:[{
					value:'0',
					label:'待发布'
				},{
					value:'100',
					label:'预告'
				},{
					value:'200',
					label:'可购买'
				},{
					value:'300',
					label:'已售完'
				},{
					value:'400',
					label:'计息中'
				},{
					value:'500',
					label:'已兑付'
				},{
					value:'600',
					label:'匹配中'
				}],
				list2:[{
					value:'选项1',
					label:'平台自用'
				},{
					value:'选项1',
					label:'微钱进'
				}],
				filters: {
					borrowRealname: '',
					borrowMobilePhone: '',
					subjectType: '',
					subjectTitle: '',
					subjectStatus: '',
				},
				SubjectList: [],
				users: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列

				matchFormVisible: false,//金额匹配界面是否显示
				matchLoading: false,

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
				table: [
					{ id: '11', number: '请输入姓名', user_name: 'blur', loan_number: 222 }],
				table1: [
					{ id: '11', number: '请输入姓名', user_name: 'blur', loan_number: 222 }]
			}
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
			// 状态显示转换
			formatterState(row,column){
				return row[column.property] == 0 ? '待发布' : row[column.property] == 100 ? '预告' : row[column.property] == 200 ? '可购买' : row[column.property] == 300 ? '已售完' : row[column.property] == 400 ? '计息中' : row[column.property] == 500 ? '已兑付' : row[column.property] == 600 ? '匹配中' : '未知';
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getList();
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
			// 获得标的类型
			getSubjectTypeList() {
				this.listLoading = true
		        let that = this
	         	$.post(baseUrl+"/admin/subject/getSubjectTypeList",
		            function(data){
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
	                	that.selectSubjectTypes = info
		            }
		       );
	         	that.listLoading = false
         	},
         	// 获得标的列表
			getList() {
				this.listLoading = true
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		            page: {
		              pageSize: this.pageSize,
		              pageNum: this.page
		            },
		            subjectSearchParams: {
		            	borrowRealname: this.filters.borrowRealname,
		            	borrowMobilePhone: this.filters.borrowMobilePhone,
		            	subjectType: parseInt(this.filters.subjectType),
		            	subjectTitle: this.filters.subjectTitle,
		            	subjectStatus: parseInt(this.filters.subjectStatus)
		            }
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/subject/getList",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	that.SubjectList = info.obj.results
		                	that.page = info.obj.pageNum
		                	that.total = info.obj.totalRecord
		                	that.pageSize = info.obj.pageSize
		                	console.log(that.SubjectList)
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
	         	that.listLoading = false
         	},
			//打回待审
			handleCheck: function (index, row) {
				this.$confirm('是否打回待审?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					const params = {
			        	accountId: '',
			        	accessToken: '',
			            subjectId: row.subjectId
			        }
			        let that = this
		         	$.post(baseUrl+"/admin/subject/cancel",
			            { param: JSON.stringify(params) },function(data){
			              	const info = JSON.parse(eval('(' + data + ')'));
			              	console.log(info)
			              	if(info.res === state.HTTPCODE.SUCCEED){
			              		console.log(info.resMsg)
			                	that.$router.push({ name: '审核标的', params: { borrowId: row.borrowId }})
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
						//NProgress.done();
						// this.getUsers();
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示匹配界面
			handleMatch: function (index, row) {
				this.matchFormVisible = true;
				this.matchForm = Object.assign({}, row);
			},
			handleMember: function (index, row) {
				this.memberFormVisible = true;
				this.memberForm = Object.assign({}, row);
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
			matchSubmit: function () {
				this.$refs.matchForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.matchLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.matchForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.matchLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.matchFormVisible = false;
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
			this.getSubjectTypeList();
			this.getList();
		}
	}

</script>

<style scoped>
	.el-form-item{
		margin-bottom: 0px;
	}
	.routerColor{
		color: #20a0ff;
		text-decoration: none;
	}
</style>