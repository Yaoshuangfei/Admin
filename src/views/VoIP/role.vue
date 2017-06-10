<template>
	<el-row :gutter="10">
	  <el-col :xs="8" :sm="8" :md="8" :lg="8">
	  <!-- default-expand-all="" -->
	  	<el-tree :data="MenuData" check-strictly  @node-click="handleNodeClick" :expand-on-click-node="false" node-key="id" ref="tree" highlight-current :props="defaultProps" style="border: none">
		</el-tree>
		<!-- <router-link to="/user">好么 </router-link> -->
		<el-row :gutter="20" class="topbtn">
			<el-col :xs="6" :sm="6" :md="6" :lg="6">
				<el-button type="primary" @click="handleEdit">授权</el-button>
			</el-col>
			<el-col :xs="6" :sm="6" :md="6" :lg="6">
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</el-col>
			<el-col :xs="6" :sm="6" :md="6" :lg="6">
				<el-button type="primary"  @click="editTreeBtn">修改</el-button>
			</el-col>
			<el-col :xs="6" :sm="6" :md="6" :lg="6">
				<el-button type="primary"  @click="delTreeBtn">删除</el-button>
			</el-col>
		</el-row>
	  </el-col>
	  <el-col :xs="16" :sm="16" :md="16" :lg="16">
	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入关键字"></el-input>
				</el-form-item>
				<el-select v-model="value" placeholder="请选择">
			      <el-option v-for="item in list" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
				<el-form-item>
					<el-button type="primary" @click="queryBtn">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd1">添加</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table :data="table" @selection-change="selsChange" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 800px;">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column type="index" label="序号">
			</el-table-column>
			<el-table-column prop="name" label="角色名称">
			</el-table-column>
			<el-table-column prop="isValid" :formatter = "formatter" label="状态" >
			</el-table-column>
			<!-- <el-table-column prop="description" label="职务描述">
			</el-table-column> -->
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>v-for="item in permitBtn" v-if ="item.name === '授权' "-->
					<!-- <span > -->
						<el-button type="text" @click="authorizationBtn(scope.$index, scope.row)">授权</el-button>
						<el-button type="text" @click="seeBtn(scope.$index, scope.row)">查看</el-button>
						<el-button type="text" @click="editBtn(scope.$index, scope.row)">修改</el-button>
						<el-button type="text" @click="delBtn(scope.$index, scope.row)">删除</el-button>
					<!-- </span> -->
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	  </el-col>
	  <!--新增组织界面-->
		<el-dialog title="新增机构组织" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addorganizeForm" label-width="180px" :rules="addFormRules" ref="addorganizeForm">
				<!-- <el-form-item label="状态：">
					<el-checkbox v-model="checked">是否有效</el-checkbox>
				</el-form-item> -->
				<el-form-item label="组织名称：" prop="name">
					<el-input v-model="addorganizeForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="用户角色："> -->
					<!-- <el-cascader expand-trigger="hover" :options="options" :show-all-levels="false"></el-cascader> -->
				<!-- </el-form-item> -->
				<el-form-item label="上级组织：">
					<el-cascader @change="clickonEdit" :clearable='true' expand-trigger="hover" change-on-select v-model="menulist" :options="roleMenu" :show-all-levels="false"></el-cascader>
				</el-form-item>
				<el-form-item label="描述描述：">
					<el-input type="textarea" v-model="addorganizeForm.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addorganize" :loading="addLoading">保存</el-button>
			</div>
		</el-dialog>

		<!--新增人员界面-->
		<el-dialog title="新增角色" v-model="roleshow" :close-on-click-modal="false">
			<el-form :model="addRole" label-width="180px" :rules="addFormRules" ref="addRole">
				<el-form-item label="状态：">
					<el-checkbox v-model="addchecked">是否有效</el-checkbox>
				</el-form-item>
				<el-form-item label="角色名称：" prop="name">
					<el-input v-model="addRole.name" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="用户角色："> -->
					<!-- <el-cascader expand-trigger="hover" :options="options" :show-all-levels="false"></el-cascader> -->
				<!-- </el-form-item> -->
				<!-- <el-form-item label="上级组织：">
					<el-input v-model="addRole.name2" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="描述：">
					<el-input type="textarea" v-model="addRole.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="roleshow = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
			</div>
		</el-dialog>

		<!--机构组织授权-->
		<el-dialog title="机构组织授权" default-expand-all	 v-model="editFormVisible" :close-on-click-modal="false">
			<el-tree :data="AllParentMenu"  @check-change='clic' show-checkbox="" default-expand-all="" node-key="id" ref="tree" highlight-current :props="defaultProps" style="border: none">
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="roleAllSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!-- 修改 -->
		<el-dialog title="机构组织修改" default-expand-all	 v-model="editTree" :close-on-click-modal="false">
			<el-form :model="editOrganize" label-width="180px" :rules="addFormRules" ref="editOrganize">
				<el-form-item label="组织名称：" prop="name">
					<el-input v-model="editOrganize.name" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="上级组织：">
					<el-input v-model="editOrganize.pId" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="描述描述：">
					<el-input type="textarea" v-model="editOrganize.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editTree = false">取消</el-button>
				<el-button type="primary" @click.native="editOrganizeSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--角色授权-->
		<el-dialog title="角色授权"  v-model="authorizationVisible" :close-on-click-modal="false">
			<el-tree :data="AllParentMenu" @check-change='roleClic' show-checkbox="" default-expand-all="" node-key="id" ref="treeRole" highlight-current :props="defaultProps" style="border: none">
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="authorizationVisible = false">取消</el-button>
				<el-button type="primary" @click.native="roleSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--查看-->
		<el-dialog title="查看" v-model="seeVisible" :close-on-click-modal="false">
			<el-form :model="seeForm" label-width="180px" ref="addRole">
				<el-form-item label="状态：">
					<el-checkbox v-model="seechecked">是否有效</el-checkbox>
				</el-form-item>
				<el-form-item label="角色名称：">
					<el-input v-model="seeForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="用户角色："> -->
					<!-- <el-cascader expand-trigger="hover" :options="options" :show-all-levels="false"></el-cascader> -->
				<!-- </el-form-item> -->
				<!-- <el-form-item label="上级组织：">
					<el-input v-model="addRole.name2" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="描述：">
					<el-input type="textarea" v-model="seeForm.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="seeVisible = false">取消</el-button>
			</div>
		</el-dialog>
		<!--修改-->
		<el-dialog title="修改" v-model="editVisible" :close-on-click-modal="false">
			<el-form :model="editRoleForm" label-width="180px" :rules="addFormRules" ref="addRole">
				<el-form-item label="状态：">
					<el-checkbox v-model="editchecked">是否有效</el-checkbox>
				</el-form-item>
				<el-form-item label="角色名称：" prop="name">
					<el-input v-model="editRoleForm.name"></el-input>
				</el-form-item>
				<!-- <el-form-item label="用户角色："> -->
					<!-- <el-cascader expand-trigger="hover" :options="options" :show-all-levels="false"></el-cascader> -->
				<!-- </el-form-item> -->
				<!-- <el-form-item label="上级组织：">
					<el-input v-model="addRole.name2" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="描述：">
					<el-input type="textarea" v-model="editRoleForm.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editRoleSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</el-row>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import { sysUrl , editUser, addUser } from '../../api/api';
	export default {
		data() {
			return {
				total:0,
				page:1,
				treeRole:{},
				tree:{},
				menulist:[],
				roleMenu: [],
				curId:'',
				value:'',
				sels:[],
				seeForm:{},
				editRoleForm:{},
				seechecked:false,
				editFormVisible: false,//编辑界面是否显示
				authorizationVisible:false,
				seeVisible:false,
				editVisible:false,
				editTree:false,
				checked:false,
				addLoading: false,
				editLoading: false,
				addFormVisible: false,//新增界面是否显示
				roleshow: false,//新增界面是否显示
				addchecked:false,
				editchecked:false,
				listLoading:false,
				MenuData:[],
				AllParentMenu:[],
				rolist:[],
				rolistinit:[],
				response:[],
				ORGauthorization:[],//组织授权
				authorization:[],//授权
				edit:[],//修改
				role_arr:[],
				role_arrinit:[],
				pID:'',
				ziTreeID:'',
				addRole:{},
				fatherRoleID:'',
				//新增界面数据
				addorganizeForm: {},
				editOrganize: {},
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					value: [
						{ required: true, message: '请输入用户角色', trigger: 'blur' }
					]
				},
				filters: {
					name: ''
				},
				list:[{
					value:'1',
					label:'有效'
				},{
					value:'0',
					label:'无效'
				}],
		        table:[],
		        defaultProps: {
		          children: 'children',
		          label: 'label'
        		}
			}
		},
		methods: {
			//获取树节点id
			clic(row,index){
				console.log(row,index)
				this.role_arr = []
				if(index === true){
					this.role_arrinit.push(row.id)
					var json = {};
					for(var i = 0; i < this.role_arrinit.length; i++){
					  if(!json[this.role_arrinit[i]]){
					   this.role_arr.push(this.role_arrinit[i]);
					   json[this.role_arrinit[i]] = 1;
					  }
					}
					this.role_arrinit = this.role_arr
				}else if(index ===false){
					Array.prototype.indexOf = function(val) {
					for (var i = 0; i < this.length; i++) {
					if (this[i] == val) return i;
					}
					return -1;
					};
					Array.prototype.remove = function(val) {
					var index = this.indexOf(val);
					if (index > -1) {
					this.splice(index, 1);
					}
					};
					this.role_arrinit.remove(row.id);
					this.role_arr = this.role_arrinit
				}
				console.log(this.role_arr)
			},
			roleClic(row,index){
				console.log(row,index)
				this.rolist = []
				if(index === true){
					this.rolistinit.push(row.id)
					var json = {};
					for(var i = 0; i < this.rolistinit.length; i++){
					  if(!json[this.rolistinit[i]]){
					   this.rolist.push(this.rolistinit[i]);
					   json[this.rolistinit[i]] = 1;
					  }
					}
					this.rolistinit = this.rolist
				}else if(index ===false){
					Array.prototype.indexOf = function(val) {
					for (var i = 0; i < this.length; i++) {
					if (this[i] == val) return i;
					}
					return -1;
					};
					Array.prototype.remove = function(val) {
					var index = this.indexOf(val);
					if (index > -1) {
					this.splice(index, 1);
					}
					};
					this.rolistinit.remove(row.id);
					this.rolist = this.rolistinit
				}
				console.log(this.rolist)
			},
			handleNodeClick(data) {
				const _this = this
				_this.table = []
				console.log(data)
				this.pID = data.pId
				this.fatherRoleID = data.id
				this.editOrganize.name = data.label
				this.editOrganize.pId = data.pId
				this.editOrganize.id = data.id
				console.log(this.fatherRoleID)
				// if(data.children){
	   //      		return
	   //      	}
				// this.table = []
				// const list = data.children
				// this.curTreeID = data.id
				// if(data.children[0].children){
				// 	return
				// }
				this.curId = data.id;
				console.log(this.curId)
				this.role_list()
				// const params = {
				// 		accountId:"1",
		  //           	accessToken:"1",
		  //           	menu:this.curId,
		  //           	page:{
		  //           		pageSize:'10',
		  //           		pageNum:'1'
		  //           	},
		  //           	role:{
		  //           		orgId:this.curId,
		  //           		// keyWord:'' ,
		  //           		isValid:'1'
		  //           	}
				// 	}
				// $.post(sysUrl+"/backstage/org/role/findByPage",
		  //            { param: JSON.stringify(params) },
		  //            function(data){
		  //            	const info = eval('(' + data + ')');
		  //               const response = JSON.parse(info);
		  //               const list = response.obj.list;
		  //               console.log(response)
		  //               _this.permitBtn = response.obj.response
		  //               for(var i = 0;i<list.results.length;i++){
		  //               	// console.log(list.results[i].name)
		  //               	var obj = {}
		  //               	obj.name = list.results[i].name
		  //               	obj.isValid = list.results[i].isValid
		  //               	obj.description = list.results[i].description
		  //               	obj.id = list.results[i].id
		  //               	obj.updateTime = list.results[i].updateTime
		  //               	_this.table.push(obj)
		  //               }
		  //               console.log(_this.table)
		  //       })
	        },
			//查询
			queryBtn() {
				const _this =this
				_this.table = []
				_this.listLoading = true
				let valueValid = this.value
				console.log(this.filters.name)
				console.log(valueValid)
				const params = {
					accountId:"1",
	            	accessToken:"1",
	            	menu:'1',
	            	page:{
	            		pageSize:'10',
	            		pageNum:'1'
	            	},
	            	role:{
	            		orgId:this.fatherRoleID,
	            		keyWord:this.filters.name,
	            		isValid:valueValid
	            	}
				}
				console.log(params)
				$.post(sysUrl+"/backstage/org/role/findByPage",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj.list;
		                console.log(response)
		                _this.permitBtn = response.obj.response
		                for(var i = 0;i<list.results.length;i++){
		                	var obj = {}
		                	obj.name = list.results[i].name
		                	obj.isValid = list.results[i].isValid
		                	obj.description = list.results[i].description
		                	obj.id = list.results[i].id
		                	obj.updateTime = list.results[i].updateTime
		                	_this.table.push(obj)
		                }
		                console.log(_this.table)
		                _this.listLoading = false
		             	if(response.res === 1000000){
							_this.$message({
								message:response.resMsg ,
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg ,
								type: 'error'
							});
		             	}
		              }
		         	)
			},
			// 新增角色
			addSubmit(){
				const _this = this
				let stat =''
				if(_this.addchecked === true){
					stat = 1
				}else{
					stat = 0
				}
				const params = {
					accountId:'1',
					accessToken:'1',
					role:{
						name:_this.addRole.name,
						orgId:_this.fatherRoleID,
						isValid:stat,
						description:_this.addRole.addr
					}
				}
				console.log(params)
				this.$confirm('确认添加吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/org/role/add",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	if(response.res === 1000000){
							_this.$message({
								message:response.resMsg ,
								type: 'success'
							});
							_this.role_list()
		             	}else{
							_this.$message({
								message: response.resMsg ,
								type: 'error'
							});
		             	}
		             	_this.roleshow = false
		              }
		         	)
				}).catch(() => {

				});
			},
			// 修改组织
			editTreeBtn(){
				this.editTree = true
			},
			editOrganizeSubmit(){
				let _this = this
				const params = {
					accountId:'1',
					accessToken:'1',
					org:{
						name:_this.editOrganize.name,
						pId:_this.editOrganize.pId,
						id:_this.editOrganize.id,
						description:_this.editOrganize.description
					}
				}
				console.log(params)
				this.$confirm('确认修改吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/org/role/updateOrg",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	if(response.res === 1000000){
							_this.$message({
								message:response.resMsg ,
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg ,
								type: 'error'
							});
		             	}
		             	_this.editTree = false
		             	_this.getPreOrgTree();
		              }
		         	)
				}).catch(() => {

				});
			},
			// 删除组织
			delTreeBtn(){
				let _this = this
				const params = {
					accountId:'1',
					accessToken:'1',
					org:{
						id:_this.fatherRoleID
					}
				}
				this.$confirm('确认删除该节点么吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/org/role/delOrg",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	if(response.res === 1000000){
							_this.$message({
								message:response.resMsg ,
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg ,
								type: 'error'
							});
		             	}
		             	_this.getPreOrgTree()
		              }
		         	)
				}).catch(() => {

				});
			},
			handleCurrentChange(val) {
				this.page = val;
				this.role_list()
			},
			//组织授权
			handleEdit: function (index, row) {
				const _this = this
				let arr = []
				// this.$refs.tree.setCheckedKeys([]);
				_this.editFormVisible = true
				this.ORGauthorization = Object.assign({}, row);
				console.log(this.ORGauthorization)
				console.log(this.fatherRoleID)
				const params = {
					accountId:'1',
					accessToken:'1',
					orgId:_this.fatherRoleID
				}
				$.post(sysUrl+"/backstage/org/role/orglistAuthorized",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                const list = response.obj
	                console.log(response)
	                for(var i = 0;i<list.length;i++){
	                	arr.push(list[i].id)
	                }
	                 _this.$refs.tree.setCheckedKeys(arr);
	            	}
	         	)
			},
			//角色授权
			authorizationBtn: function (index, row) {
				const _this = this
				var arrRole = []
				console.log(arrRole)
				 _this.authorizationVisible = true;
				_this.authorization = row;
				console.log(_this.authorization)
				console.log(_this.fatherRoleID)
				console.log(_this.authorization.id)
				const params = {
					accountId:'1',
					accessToken:'1',
					roleId:_this.authorization.id
				}
				console.log(params)
				$.post(sysUrl+"/backstage/org/role/listAuthorized",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                const list = response.obj
	                console.log(response)
	                for(var i = 0;i<list.length;i++){
	                	arrRole.push(list[i].id)
	                }
	                _this.$refs.treeRole.setCheckedKeys(arrRole);
	              }
	         	)
			},
			roleAllSubmit(){
				let _this = this
				console.log(_this.fatherRoleID)
				const params = {
					accountId:'1',
					accessToken:'1',
					orgId:_this.fatherRoleID,
					resourcesIds:this.role_arr.join(',')
				}
				console.log(params)
				this.$confirm('确认授权吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/org/role/saveOrgAuthorized",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	if(response.res === 1000000){
							_this.$message({
								message:response.resMsg ,
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg ,
								type: 'error'
							});
		             	}
		             	console.log('关闭')
		             	_this.editFormVisible = false
		              }
		         	)
				}).catch(() => {

				});
			},
			//角色查看
			seeBtn: function (index, row) {
				if(row.isValid === 1){
					this.seechecked = true
				}else {
					this.seechecked = false
				}
				this.seeVisible = true;
				this.seeForm = row
			},
			//角色修改
			editBtn: function (index, row) {
				if(row.isValid === 1){
					this.editchecked = true
				}else {
					this.editchecked = false
				}
				this.editVisible = true;
				this.editRoleForm = row
			},
			editRoleSubmit(){
				let startChek
				if(this.editchecked === true){
					startChek = 1
				}else{
					startChek = 0
				}
				const _this = this
				console.log(this.editchecked)
				const params = {
					accountId:'1',
					accessToken:'1',
					role:{
						id:_this.editRoleForm.id,
						name:_this.editRoleForm.name,
						description:_this.editRoleForm.description,
						isValid:startChek
					}
				}
				console.log(params)
				this.$confirm('确认修改吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/org/role/update",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		                _this.editVisible =false
		             	if(response.res === 1000000){
							_this.$message({
								message:response.resMsg ,
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg ,
								type: 'error'
							});
		             	}
		             	// _this.getPreOrgTree()
		             	_this.role_list()
		              }
		         	)
				}).catch(() => {

				});
			},
			//角色删除
			delBtn: function (index, row) {
				const _this = this
				const params = {
					accountId:'1',
					accessToken:'1',
					role:{
						id:row.id
					}
				}
				console.log(params)
				this.$confirm('确认删除吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/org/role/del",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		                _this.addFormVisible =false
		             	if(response.res === 1000000){
							_this.$message({
								message:'删除成功' ,
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: '删除失败' ,
								type: 'error'
							});
		             	}
		             	// _this.getPreOrgTree()
		             	_this.role_list()
		              }
		         	)
				}).catch(() => {

				});
			},
			//角色授权
			roleSubmit: function () {
				const _this = this
				const params = {
					accountId:'1',
					accessToken:'1',
					roleId:_this.authorization.id,
					resourcesIds:_this.rolist.join(',')
				}
				console.log(params)
				this.$confirm('确认授权吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/org/role/saveAuthorized",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		                _this.authorizationVisible =false
		             	if(response.res === 1000000){
							_this.$message({
								message:response.resMsg ,
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg ,
								type: 'error'
							});
		             	}
		              }
		         	)
				}).catch(() => {

				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//显示新增界面
			handleAdd1: function () {
				this.roleshow = true;
			},
			//新增
			addorganize: function () {
				let _this = this
				console.log(_this.ziTreeID)
				const params = {
					accountId:'1',
					accessToken:'1',
					org:{
						name:_this.addorganizeForm.name,
						pId:_this.ziTreeID,
						description:_this.addorganizeForm.description
					}
				}
				console.log(params)
				this.$confirm('确认新增吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/org/role/addOrg",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		                _this.addFormVisible =false
		             	if(response.res === 1000000){
							_this.$message({
								message:response.resMsg ,
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg ,
								type: 'error'
							});
		             	}
		             	_this.getPreOrgTree()
		              }
		         	)
				}).catch(() => {

				});
			},
			formatter(row,column){
				if(row.isValid === 1){
					return '有效'
				}else{
					return '无效'
				}
			},
			clickonEdit(row){
				this.ziTreeID = row[row.length-1]
				console.log(row)
				this.selectedOptions = row
			},
			// 批量删除
			selsChange: function (sels) {
				this.sels = [];
				console.log(sels);
				for(var i=0;i<sels.length;i++){
					this.sels.push(sels[i].id);
				}
				console.log(this.sels.join(','));
			},
			batchRemove: function () {
				const _this = this
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            ids:this.sels.join(',')
		        }
		        console.log(params)
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/org/role/delBatch",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		                _this.addFormVisible =false
		             	if(response.res === 1000000){
							_this.$message({
								message:"删除成功",
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: "删除失败" ,
								type: 'error'
							});
		             	}
		             	_this.getPreOrgTree()
		             	_this.role_list()
		              }
		         	)
				}).catch(() => {

				});
			},
			getPreOrgTree() {
				let _this = this
				_this.MenuData = []
				const params = {
		            accountId:"1",
		            accessToken:"1"
		        }
		        $.post(sysUrl+"/backstage/org/role/getOrgTree",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj;
		                console.log(list)
		                var father = {}
		                for(var i = 0;i<list.length;i++){
		                	var father = {}
		                	father.id = list[i].id
		                	father.pId = list[i].pId
		                	father.label = list[i].name
		                	if(list[i].nodes.length !==0){
		                		var chlid = []
		                		father.children = chlid
		                		_this.nodes(list[i].nodes,chlid);
		                		_this.MenuData.push(father)
		                	}
		                }
		                console.log(_this.MenuData)
		            }
		        )
			},
			nodes(list,chlid){
				for(var x = 0;x<list.length;x++){
					var childrens = {}
					childrens.id = list[x].id
					childrens.pId = list[x].pId
					childrens.label = list[x].name
					if(list[x].nodes.length !== 0){
						var chlids = []
						childrens.children = chlids
						this.nodes(list[x].nodes,chlids);
					}
					chlid.push(childrens)
				}
			},
			listAllParentMenu() {
				let _this = this
				const params = {
		            "accountId":"1",
		            "accessToken":"1"
		        }
		        $.post(sysUrl+"/backstage/resources/listAllParentMenu",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj.list;
		                console.log(list)
		                var father = {}
		                for(var i = 0;i<list.length;i++){
		                	var father = {}
		                	father.id = list[i].id
		                	father.label = list[i].name
		                	father.isValid = list[i].isValid
		                	father.resUrl = list[i].resUrl
		                	father.type = list[i].type
		                	father.icon = list[i].icon
		                	father.description = list[i].description
		                	father.sort = list[i].sort
		                	if(list[i].nodes.length !==0){
		                		var chlid = []
		                		father.children = chlid
		                		_this.arentNodes(list[i].nodes,chlid);
		                		_this.AllParentMenu.push(father)
		                	}
		                }
		                console.log(_this.MenuData)
		            }
		        )
			},
			//解析tree数据及数据再整理
			arentNodes(list,chlid){
				for(var x = 0;x<list.length;x++){

					var childrens = {}
					childrens.id = list[x].id
					childrens.label = list[x].name
					childrens.isValid = list[x].isValid
		            childrens.resUrl = list[x].resUrl
					if(list[x].nodes.length !== 0){
						var chlids = []
						childrens.children = chlids
						this.arentNodes(list[x].nodes,chlids);
					}
					chlid.push(childrens)
				}
			},
			menulistFun() {
				let _this = this
				const params = {
		            "accountId":"1",
		            "accessToken":"1"
		        }
		        $.post(sysUrl+"/backstage/org/role/getOrgTree",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj;
		                console.log(response)
		                var father = {}
		                for(var i = 0;i<list.length;i++){
		                	var father = {}
		                	father.value = list[i].id
		                	father.label = list[i].name
		                	if(list[i].nodes.length !==0){
		                		var chlid = []
		                		father.children = chlid
		                		_this.menunodes(list[i].nodes,chlid);
		                		_this.roleMenu.push(father)
		                	}
		                }
		            }
		        )
		        console.log(this.roleMenu)
		    },
			//解析tree数据及数据再整理
			menunodes(list,chlid){
				for(var x = 0;x<list.length;x++){
					var childrens = {}
					childrens.value = list[x].id
					childrens.label = list[x].name
					if(list[x].nodes.length !== 0){
						var chlids = []
						childrens.children = chlids
						this.menunodes(list[x].nodes,chlids);
					}
					chlid.push(childrens)
				}
			},
			// 获取角色
			role_list(){
				const _this = this
				_this.table =[]
				_this.listLoading = true
				const params = {
						accountId:"1",
		            	accessToken:"1",
		            	menu:this.curId,
		            	page:{
		            		pageSize:'10',
		            		pageNum:this.page
		            	},
		            	role:{
		            		orgId:this.curId,
		            		// keyWord:'' ,
		            		isValid:''
		            	}
					}
				$.post(sysUrl+"/backstage/org/role/findByPage",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj.list;
		                console.log(response)
		                _this.total = response.obj.list.totalRecord
		                _this.permitBtn = response.obj.response
		                for(var i = 0;i<list.results.length;i++){
		                	// console.log(list.results[i].name)
		                	var obj = {}
		                	obj.name = list.results[i].name
		                	obj.isValid = list.results[i].isValid
		                	obj.description = list.results[i].description
		                	obj.id = list.results[i].id
		                	obj.updateTime = list.results[i].updateTime
		                	_this.table.push(obj)
		                }
		                console.log(_this.table)
		                _this.listLoading = false
		        })
			}
		},
		mounted() {
			this.getPreOrgTree();
			this.listAllParentMenu();
			this.menulistFun();
		}
	};
</script>

<style>
  .topbtn{
  	margin-top:50px;
  }
</style>