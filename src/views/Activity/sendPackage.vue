<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.memberName" placeholder="用户名"></el-input>
				</el-form-item>
				<span>至今未投资过用户：</span>
				<el-form-item>
					<el-date-picker style="width: 215px" v-model="filters.investDeadline" type="datetime" placeholder="按日期这个是指投资过一次">
		        	</el-date-picker>
				</el-form-item>
				<span>注册时间：</span>
		        <el-date-picker v-model="filters.registeredStartTime" type="datetime" placeholder="选择日期时间">
		        </el-date-picker>
		        <span>至：</span>
		        <el-date-picker v-model="filters.registeredEndTime" type="datetime" placeholder="选择日期时间">
		        </el-date-picker>
		        <br>
				<span>用户投资金额：</span>
				<el-form-item>
					<el-input v-model="filters.minInvestMoney" placeholder=""></el-input>
				</el-form-item>
				<span>至</span>
				<el-form-item>
					<el-input v-model="filters.maxInvestMoney" placeholder=""></el-input>
				</el-form-item>
				<span>分组标识：</span>
				<el-select v-model="filters.mark" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in groupMarks"
				      :label="item.title"
				      :value="item.id">
				    </el-option>
			  	</el-select>
				<span>短信模板：</span>
				<el-select v-model="filters.template" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in selectTemplates"
				      :label="item.description"
				      :value="item.id">
				    </el-option>
			  	</el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getPackageList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">发送短信</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="usersList" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="selection" width="55" >
			</el-table-column>
			<el-table-column prop="id" label="序号" width="100" >
			</el-table-column>
			<el-table-column prop="realname" label="用户名" width="120" >
			</el-table-column>
			<el-table-column prop="mobilePhone" label="手机号码" width="125">
			</el-table-column>
			<el-table-column label="会员等级" width="120" >
				<template scope="scope">
			      	<span v-if='scope.row.levelId === 10'>普通会员</span>
					<span v-else-if='scope.row.levelId === 20'>vip会员</span>
					<span v-else-if='scope.row.levelId === 30'>svip会员</span>
					<span v-else></span>
				</template>
			</el-table-column>
			<el-table-column prop="accountCash.useMoney" label="账户余额(元)" width="120">
			</el-table-column>
			<el-table-column prop="accountCash.collection" label="待收金额(元)" width="120">
			</el-table-column>
			<el-table-column prop="accountCash.collectionRate" label="待收利息(元)" width="120">
			</el-table-column>
			<el-table-column prop="createFrom" label="客户来源" width="120">
			</el-table-column>
			<el-table-column prop="invitedMobilePhone" label="邀请人" width="120">
			</el-table-column>
			<!-- <el-table-column label="是否自动提现" width="120">
				<template scope="scope">
			      	<span v-show="scope.row.auto_widthdrawal === true">是</span>
			      	<span v-show="scope.row.auto_widthdrawal ===  false">否</span>
				</template>
			</el-table-column>
			<el-table-column label="是否自定投标" width="120">
				<template scope="scope">
			      	<span v-show="scope.row.auto_bid === true">是</span>
			      	<span v-show="scope.row.auto_bid ===  false">否</span>
				</template>
			</el-table-column>
			<el-table-column label="是否电子签名" width="120">
				<template scope="scope">
			      	<span v-show="scope.row.auto_sign === true">是</span>
			      	<span v-show="scope.row.auto_sign ===  false">否</span>
				</template>
			</el-table-column> -->
			<el-table-column prop="createTime" :formatter = "formatter" label="注册时间" width="150">
			</el-table-column>
			<el-table-column prop="lastLoginTime" :formatter = "formatter" label="最近登录" width="150">
			</el-table-column>
			<el-table-column label="银行卡管理" width="120">
				<template scope="scope">
					<el-button type="text" size="small" v-if="scope.row.hadBindCard === 1" @click="handleBankDetail(scope.$index, scope.row)">详情</el-button>
					<el-button type="text" size="small" v-else>未绑定</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="text" size="small">详情</el-button>
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

		<!--银行卡详情界面-->
		<el-dialog title="银行卡管理" v-model="bankDetailFormVisible" :close-on-click-modal="false">
			<el-form :model="bankDetail" label-width="80px">
				<el-form-item label="用户ID" prop="name">
					<span>{{bankDetail.memberId}}</span>
				</el-form-item>
				<el-form-item label="手机号码">
					<span>{{bankDetail.mobilePhone}}</span>
				</el-form-item>
				<el-form-item label="客户姓名">
					<span>{{bankDetail.realname}}</span>
				</el-form-item>
				<el-form-item :label="bankDetail.bankId">
					<span>{{bankDetail.bankTitle}}</span>
				</el-form-item>
				<el-form-item label="银行卡号">
					<span>{{bankDetail.bankCardId}}</span>
				</el-form-item>
			</el-form>
		</el-dialog>

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
		<el-dialog title="发送短信" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row>
		  			<el-col :xs="24" :md="24">
		  				<el-select v-model="addForm.name" placeholder="请选择">
				  		    <el-option
				  		      v-for="item in message_titles"
				  		      :label="item.label"
				  		      :value="item.value">
				  		    </el-option>
		  				</el-select>
		  			</el-col>
		  			<el-col :xs="24" :md="24">
		  				<div style="height: 15px;width: 100%;"></div>
		  			</el-col>
		  			<el-col :xs="24" :md="24">
		  				<el-input :rows="7" placeholder='尊敬的［用户名］您好，具体的内容' v-model='messageContent' type="textarea"></el-input>
		  				<span class="pull-right">{{ messageLength }}</span>
		  				<span class="pull-right">字数统计</span>
		  			</el-col>
		  			<el-col :xs="24" :md="24">
		  			</el-col>
	  			</el-row>
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
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, baseUrl } from '../../api/api';
	import { state } from '../../vuex/state'
	export default {
		data() {
			return {
				groupMarks: [],
				selectTemplates: [],
				messageContent: '',
				value:'',
				value1:'',
				value2:'',
				list:[{
					value:'选项1',
					label:'注册未投资客户'
				}],
				filters: {
					memberName: '',
					investDeadline: '',
					registeredStartTime: '',
					registeredEndTime: '',
					minInvestMoney: '',
					maxInvestMoney: '',
					template: '',
					mark: ''
				},
				users: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列

				bankDetailFormVisible: false,//银行卡详情界面是否显示
				bankDetail: {},

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
					messageContent: ''
				},
				message_titles: [{
		          value: '',
		          label: '请选择短信内容'
		        }, {
		          value: '100',
		          label: '五周年庆短信'
		        }],
				usersList: []
			}
		},
		computed: {
            messageLength () {
                return this.messageContent.length + 0
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
			handleCurrentChange(val) {
				this.page = val;
				this.getPackageList();
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
			//显示银行卡详情界面
			handleBankDetail: function (index, row) {
				// this.bankDetailFormVisible = true;
				// this.editForm = Object.assign({}, row);
				this.listLoading = true
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: '',
		            memberId: row.id
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/bankCardRecord/findBankCardRecordByMemberId",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	that.listLoading = false
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj)
		                	that.bankDetail = info.obj
		                	that.bankDetailFormVisible = true
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
			// 获得分组标识
			getAllGroupList() {
				this.listLoading = true
				const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: ''
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/activity/getAllGroup",
		            { param: JSON.stringify(params) },function(data){
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
	                	that.groupMarks = info.obj
		            }
		       );
	         	that.listLoading = false
         	},
			// 短信模板请求
			getAllTemplatesList() {
				this.listLoading = true
				const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: ''
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/messageTemplate/getAllTemplates",
		            { param: JSON.stringify(params) },function(data){
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
	                	that.selectTemplates = info.obj
		            }
		       );
	         	that.listLoading = false
         	},
			// 发送红包管理列表
			getPackageList() {
				this.listLoading = true
				let registeredStartTime = '', registeredEndTime = '', investDeadline = ''
				if(this.filters.registeredStartTime === '' || this.filters.registeredStartTime === undefined) {
					registeredStartTime = ''
				} else {
					registeredStartTime = this.filters.registeredStartTime.getTime()
					console.log(registeredStartTime)
				}
				if(this.filters.registeredEndTime === '' || this.filters.registeredEndTime === undefined) {
					registeredEndTime = ''
				} else {
					registeredEndTime = this.filters.registeredEndTime.getTime()
					console.log(registeredEndTime)
				}
				if(this.filters.investDeadline === '' || this.filters.investDeadline === undefined) {
					investDeadline = ''
				} else {
					investDeadline = this.filters.investDeadline.getTime()
					console.log(investDeadline)
				}
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: '',
		            page: {
		              pageSize: this.pageSize,
		              pageNum: this.page
		            },
		            activityMemberSelectParams: {
		            	memberName: this.filters.memberName,
		            	registeredStartTime: registeredStartTime.toString(),
		            	registeredEndTime: registeredEndTime.toString(),
		            	minInvestMoney: this.filters.minInvestMoney,
		            	maxInvestMoney: this.filters.maxInvestMoney,
		            	investDeadline: investDeadline.toString()
		            }
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/member/activitySelectMember",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	that.listLoading = false
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	that.usersList = info.obj.results
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
			// 获得分组标识
			this.getAllGroupList();
			// 获得短信模版
			this.getAllTemplatesList();
			this.getPackageList();
		}
	}

</script>

<style scoped>

</style>