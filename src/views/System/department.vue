<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入关键字"></el-input>
				</el-form-item>
				<el-select v-model="filters.value" placeholder="请选择">
			      <el-option v-for="item in list" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="userList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增用户</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;min-width: 1080px;">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column type="index" label="序号">
			</el-table-column>
			<el-table-column prop="loginName" label="登录名">
			</el-table-column>
			<el-table-column prop="name" label="用户名">
			</el-table-column>
			<el-table-column prop="roleName" label="用户角色">
			</el-table-column>
			<el-table-column prop="mobile" label="联系电话">
			</el-table-column>
			<el-table-column prop="isValid" :formatter = 'states' label="状态">
			</el-table-column>
			<el-table-column prop="createTime" :formatter = "formatter" label="最近登录时间">
			</el-table-column>
			<el-table-column prop="loginIp" label="最近登录IP">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <span v-for="item in permitBtn">
						<el-button @click="handleEdit(scope.$index, scope.row)"  v-if ="item.name === '查看' " type="text">{{item.name}}</el-button>
						<el-button v-if ="item.name === '修改' " @click="alter(scope.$index, scope.row)"  type="text">{{item.name}}</el-button>
						<el-button v-if ="item.name === '密码重置' " type="text">{{item.name}}</el-button>
						<el-button v-if ="item.name === '删除' " type="text" @click="handleDel(scope.$index, scope.row)">{{item.name}}</el-button>
					</span> -->
					<span>
						<el-button @click="handleEdit(scope.$index, scope.row)"  type="text">查看</el-button>
						<el-button @click="alter(scope.$index, scope.row)"  type="text">修改</el-button>
						<el-button type="text">密码重置</el-button>
						<el-button type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</span>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--查看用户资料-->
		<el-dialog title="查看用户资料" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="状态：">
					<el-checkbox :disabled="true" v-model="seecheck">是否有效</el-checkbox>
				</el-form-item>
				<!-- <el-form-item label="登录名：" prop="name">
					<el-input v-model="addForm.loginname" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="用户角色：">
					<el-cascader :disabled="true" expand-trigger="hover" v-model="alertOptions" :options="options" :show-all-levels="false"></el-cascader>
				</el-form-item>
				<el-form-item label="用户名：">
					<el-input :disabled="true" v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：">
					<el-input :disabled="true" v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：">
					<el-input :disabled="true" v-model="editForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述：">
					<el-input :disabled="true" type="textarea" v-model="editForm.description"></el-input>
				</el-form-item>
			</el-form>
			<!-- <div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div> -->
		</el-dialog>
		<!--修改用户资料-->
		<el-dialog title="修改" v-model="editalter" :close-on-click-modal="false">
			<el-form :model="alterForm" label-width="120px" :rules="alterFormRules" ref="alterForm">
				<el-form-item label="状态：">
					<el-checkbox v-model="altercheck">是否有效</el-checkbox>
				</el-form-item>
				<!-- <el-form-item label="登录名：" prop="name">
					<el-input v-model="addForm.loginname" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="用户角色：">
					<el-cascader expand-trigger="hover" v-model="alertOptions" :options="roleTreeArr" :show-all-levels="false"></el-cascader>
				</el-form-item>
				<el-form-item label="用户名：">
					<el-input v-model="alterForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：">
					<el-input v-model="alterForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：">
					<el-input v-model="alterForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述：">
					<el-input type="textarea" v-model="alterForm.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editalter = false">取消</el-button>
				<el-button type="primary" @click.native="alterSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增用户界面-->
		<el-dialog title="新增用户" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="状态：">
					<el-checkbox v-model="checked">是否有效</el-checkbox>
				</el-form-item>
				<el-form-item label="登录名：" prop="name">
					<el-input v-model="addForm.loginname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户角色：">
					<el-cascader expand-trigger="hover" v-model="selectedOptions" :options="roleTreeArr" :show-all-levels="false"></el-cascader>
				</el-form-item>
				<el-form-item label="用户名：">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：">
					<el-input v-model="addForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：">
					<el-input v-model="addForm.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述：">
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
	import {sysUrl , editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				// arryid:[],
				arryidfind:[],
				seecheck: false,
				altercheck:false,
				selectedOptions:[],
				alertOptions:[],
				accountId:'',
				accessToken:'',
				permitBtn:[],
				checked:false,
				value:'',
				total: 0,
				page: 1,
				list:[{
					value:'选项1',
					label:'全部'
				},{
					value:'选项2',
					label:'有效'
				},{
					value:'选项3',
					label:'无效'
				}],
				filters: {
					name: '',
					value:''
				},
				options: [
				{
		          value: '商富',
		          label: '商富',
		          children: [{
		            value: '研发部',
		            label: '研发部',
		            children: [{
		              value: '普通角色',
		              label: '普通角色'
		            }, {
		              value: '管理员',
		              label: '管理员'
		            }]
		          }, {
		            value: '商务部',
		            label: '商务部',
		            children: [{
		              value: '普通角色',
		              label: '普通角色'
		            }, {
		              value: '管理员',
		              label: '管理员'
		            }]
		          }, {
		            value: '设计部',
		            label: '设计部',
		            children: [{
		              value: '普通角色',
		              label: '普通角色'
		            }, {
		              value: '管理员',
		              label: '管理员'
		            }]
		          }, {
		            value: '人事部',
		            label: '人事部',
		            children: [{
		              value: '普通角色',
		              label: '普通角色'
		            }, {
		              value: '管理员',
		              label: '管理员'
		            }]
		          }, {
		            value: '财务部',
		            label: '财务部',
		            children: [{
		              value: '普通角色',
		              label: '普通角色'
		            }, {
		              value: '管理员',
		              label: '管理员'
		            }]
		          }]
		        },
		        {
		          value: '合作伙伴',
		          label: '合作伙伴',
		          children: [
		          {
		            value: '中国移动',
		            label: '中国移动'
		          },
		          {
		            value: '中国电信',
		            label: '中国电信'
		          },
		          {
		            value: '1',
		            label: '国务院'
		          }
		          ]
		        }
		        ],
		        roleTreeArr:[],
				users: [],
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editalter: false,//修改是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				alterFormRules: {
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
				alterForm: {},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					loginname: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
					// value: [
					// 	{ required: true, message: '请输入用户角色', trigger: 'blur' }
					// ]
				},
				//新增界面数据
				addForm: {
					loginname: '',
					email:'',
					phone:'',
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				table: []
			}
		},
		methods: {
			formatter(row,column){
				let curTime = row.createTime;
				curTime = new Date(curTime).toLocaleString()
				return curTime
			},
			states(row,column){
				let value = '';
				if(row.isValid === 1){
					value = '有效'
				}else {
					value = '无效'
				}
				return value
			},
			userList() {
				let _this = this;
				let params = {};
				this.listLoading = true;
				// console.log(_this.filters.name);
				// console.log(_this.filters.value);
				if(_this.filters.name !== '' || _this.filters.value !== ''){
					console.log(1)
					params = {
			            "accountId":"1",
			            "accessToken":"1",
			            "menu":"2",
			            "page":{
			                "pageSize":"10",
			                "pageNum":this.page
			                },
			            "account":{
			                  // "loginName":,
			                  "keyWord":_this.filters.name,
			                  // "roleId":"",
			                  "isValid":_this.filters.value
			            }
			        };
				}else{
					params = {
				            "accountId":"1",
				            "accessToken":"1",
				            "menu":"2",
				            "page":{
				                "pageSize":"10",
				                "pageNum":this.page
				                }
				    }
				}
				// console.log(params)
		          $.post(sysUrl+"/backstage/account/findByPage",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	// if(response.res === 1000000){

		             	// }else{

		             	// }
		                // console.log(response);
		                _this.table = response.obj.list.results;
		                _this.listLoading = false;
		                _this.permitBtn = response.obj.permitBtn;
		                _this.total = response.obj.list.totalRecord;
		                _this.page = response.obj.list.pageNum;
		                _this.accessToken = response.accessToken;
		                _this.accountId = response.accountId;
		                // console.log(_this.permitBtn);
		              }
		         );

			},
			//获取角色树
			roleTree() {
				let _this = this
				const params = {
		            "accountId":"1",
		            "accessToken":"1"
		        }
		        $.post(sysUrl+"/backstage/account/roleTree",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj;
		                // let father = {}
		                console.log(list);
		                var father = {}
		                for(var i = 0;i<list.length;i++){
		                	var father = {}
		                	father.value = list[i].id
		                	father.label = list[i].name
		                	// _this.arryid.push(list[i])
		                	if(list[i].nodes.length !==0){
		                		var chlid = []
		                		father.children = chlid
		                		_this.nodes(list[i].nodes,chlid);
		                		_this.roleTreeArr.push(father)
		                	}
		                }
		                // console.log(_this.roleTreeArr)
		              }
		        )
			},
			//解析tree数据及数据再整理
			nodes(list,chlid){
				// console.log(chlid)
				for(var x = 0;x<list.length;x++){
					var childrens = {}
					childrens.value = list[x].id
					childrens.label = list[x].name
					// this.arryid.push(list[x])
					if(list[x].nodes.length !== 0){
						var chlids = []
						childrens.children = chlids
						this.nodes(list[x].nodes,chlids);
					}
					chlid.push(childrens)
				}
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.userList();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					console.log(this.users);
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
					console.log(this.users);
				});
			},
			//删除
			handleDel: function (index, row) {
				console.log(row);
				let _this = this
				const params = {
		            "accountId":"1",
		            "accessToken":"1",
		            "account":{
		                  "accountId":row.accountId
		            }
		        }
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/account/del",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
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
		             	_this.userList();
						_this.listLoading = false;
		              }
		         	)
				}).catch(() => {

				});
			},
			//显示查看界面
			handleEdit: function (index, row) {
				console.log(row)
				this.editForm = row;
				if(row.isValid === 1){
					this.seecheck = true
				}else if(row.isValid === 0){
					this.seecheck = false
				}
				console.log(this.seecheck)
				this.editFormVisible = true;
			},
			//显示修改界面
			alter: function (index, row) {
				console.log(row)
				const _this = this
				this.alterForm = row
				console.log(this.alterForm)
				if(row.isValid === 1){
					this.altercheck = true
				}else {
					this.altercheck = false
				}
				// role1
				// let editID = 'role1'
				// _this.findID(editID);

				// 显示用户角色  arryidfind
				const params = {
		            "accountId":"1",
		            "accessToken":"1",
		            "account":{
		                  "accountId":row.accountId
		            }
		        }
		        console.log(params);
		        $.post(sysUrl+"/backstage/account/find",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                const roleId = response.obj.roleId
	                _this.alertOptions = roleId.split('-')
	                const index = _this.alertOptions.length-1
	                _this.alertOptions.splice(index, 1)
	                console.log(_this.alertOptions)
	              }
	         	)
		        this.editalter = true;
			},
			// findID(id){
			// 	if(id === '0'){
			// 		return
			// 	}
			// 	let  curID = ''
			// 	console.log(this.arryid)
			// 	for(var i = 0;i<this.arryid.length;i++){
			// 		if(id === this.arryid[i].id){
			// 			curID = this.arryid[i].pId
			// 			this.findID(curID)
			// 		}
			// 	}
			// },
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					loginname :'',
					phone: '',
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
			//修改
			alterSubmit: function () {
				let _this = this
				let status
				if(_this.altercheck === true){
					status = 1
				}else {
					status = 0
				}
				const params = {
		            "accountId":"1",
		            "accessToken":"1",
		            "account":{
		                  "accountId":_this.alterForm.accountId,
		                  "name":_this.alterForm.name,
		                  "email":_this.alterForm.email,
		                  "isValid":status,
		                  "roleId":_this.alterForm.roleId,
		                  "updateTime":_this.alterForm.updateTime,
		                  "description":_this.alterForm.description,
		                  "login_ip":_this.alterForm.login_ip,
		                  "login_time":_this.alterForm.login_time,
		                  "mobile":_this.alterForm.mobile
		            }
		        }
		        console.log(params);
				this.$confirm('确认修改吗？', '提示', {}).then(() => {
					// this.editLoading = true;
					$.post(sysUrl+"/backstage/account/update",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	if(response.res === 1000000){
							_this.$message({
								message: '修改成功',
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: '修改失败',
								type: 'error'
							});
		             	}
						_this.listLoading = false
						_this.editalter = false
						_this.userList();
		              }
		         	)
				});
			},
			//新增
			addSubmit: function () {
					let _this = this
					let editvalid = ''
					if(_this.checked === false){
						editvalid = 0
					}else if(_this.checked === true){
						editvalid = 1
					}
					// _this.selectedOptions[0].
					let roleid = _this.selectedOptions[_this.selectedOptions.length-1]
					roleid = roleid.replace('role','')
					console.log(_this.selectedOptions);
					const params = {
			            "accountId":"1",
			            "accessToken":"1",
			            "account":{
			                  "loginName": _this.addForm.loginname,
			                  "roleId":roleid,
			                  "email":_this.addForm.email,
			                  "isValid": editvalid,
			                  "mobile": _this.addForm.phone,
			                  "description": _this.addForm.addr,
			                  "name": _this.addForm.name
			            }
			        }
			        console.log(params)
			        this.$confirm('确认新增该用户吗?', '提示', {
					type: 'warning'
					}).then(() => {
				         $.post(sysUrl+"/backstage/account/add",
			             { param: JSON.stringify(params) },
			             function(data){
			             	const info = eval('(' + data + ')');
			                const response = JSON.parse(info);
			             	if(response.res === 1000000){
								_this.$message({
									message: '新增用户成功',
									type: 'success'
								});
			             	}else{
								_this.$message({
									message: '新增用户失败',
									type: 'error'
								});
			             	}
			             	_this.addFormVisible = false;
							_this.userList();
			                console.log(response);
			              }
			         	)
			        }).catch(() => {

					});
			},
			selsChange: function (sels) {
				this.sels = [];
				console.log(sels);
				for(var i=0;i<sels.length;i++){
					this.sels.push(sels[i].accountId);
				}
				console.log(this.sels.join(','));
			},
			//批量删除
			batchRemove: function () {
				console.log(this.sels);
				let _this = this;
				const params = {
		            "accountId":this.accountId,
		            "accessToken":this.accessToken,
		            "ids":this.sels.join(',')
		        };
		        console.log(params)
		        this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/resources/delBatch",
			             { param: JSON.stringify(params) },
			             function(data){
			             	const info = eval('(' + data + ')');
			                const response = JSON.parse(info);
			                console.log(response);
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
			                _this.userList();
			              }
			         );
					}).catch(() => {

				});
			}
		},
		mounted() {
			this.userList();
			this.roleTree();
		}
	}

</script>

<style scoped>

</style>