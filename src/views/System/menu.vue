<template>
	<el-row :gutter="10">
	  <el-col :xs="8" :sm="8" :md="8" :lg="8"><!-- default-expand-all=""  展开节点-->
	  	<el-tree :data="MenuData" @node-click="handleNodeClick" :accordion='true' :expand-on-click-node="false" show-checkbox="" @check-change='clic' check-strictly node-key="id" ref="tree" highlight-current :props="defaultProps" style="border: none">
		</el-tree>
		<el-row :gutter="20" class="topbtn">
			<el-col :xs="6" :sm="6" :md="6" :lg="6">
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</el-col>
			<el-col :xs="6" :sm="6" :md="6" :lg="6">
				<el-button type="primary" @click="onEditBtn">修改</el-button>
			</el-col>
			<el-col :xs="6" :sm="6" :md="6" :lg="6">
				<el-button type="primary" @click="onDelBtn">删除</el-button>
			</el-col>
		</el-row>
	  </el-col>
	  <el-col :xs="16" :sm="16" :md="16" :lg="16">
	  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd1">添加</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="batchRemove" :disabled="this.delID.length===0">批量删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table :data="table" @selection-change="selsChange" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 800px;">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column type="index" label="序号">
			</el-table-column>
			<el-table-column prop="name" label="名称">
			</el-table-column>
			<el-table-column prop="resUrl" label="路径">
			</el-table-column>
			<el-table-column prop="isValid"  :formatter = "formatter" label="状态" >
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
					<el-button type="text" @click="handleeditTree(scope.$index, scope.row)">修改</el-button>
					<el-button type="text" @click="delTree(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	  </el-col>
	  <!--新增组织界面 -->
		<el-dialog title="新增菜单" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="状态：">
					<el-checkbox v-model="checked">是否有效</el-checkbox>
				</el-form-item>
				<el-form-item label="菜单名称：" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-upload class="upload-demo" action="http://image.sfdai.com/api/image" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
				<!-- <el-form-item label="菜单图标：">
					<el-input v-model="addForm.icon" style='width: 300px;' type='file'></el-input>
					<el-button type="primary" @click='addPic'>上传</el-button>
				</el-form-item> -->
				<el-form-item label="上级目录：">
					<el-cascader @change="clickon"  expand-trigger="hover" change-on-select v-model="menulist" :options="roleMenu" :show-all-levels="false"></el-cascader>
				</el-form-item>
				<el-form-item label="排序：">
					<el-input v-model="addForm.sort"></el-input>
				</el-form-item>
				<!-- <el-col :span='24'> -->
					<el-col :span='2' :offset="1">菜单类型：</el-col>
					<!-- <el-col :span='3'> -->
						<el-select v-model="type" placeholder="选择" style="padding-bottom: 10px;
    margin-top: -7px;
    margin-left: 5px;">
					      <el-option v-for="item in list" :label="item.label" :value="item.value">
					      </el-option>
					    </el-select>
					<!-- </el-col> -->
				<!-- </el-col> -->
				<el-form-item label="访问路径：">
					<el-input v-model="addForm.resUrl"></el-input>
				</el-form-item>
				<el-form-item label="描述：">
					<el-input type="textarea" v-model="addForm.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
			</div>
		</el-dialog>
		<!--修改菜单页面 -->
		<el-dialog title="修改菜单" v-model="showEdit" :close-on-click-modal="false">
			<el-form :model="editArr" label-width="120px" :rules="addFormRules">
				<el-form-item label="状态：">
					<el-checkbox v-model="EditValid">是否有效</el-checkbox>
				</el-form-item>
				<el-form-item label="菜单名称：" prop="name">
					<el-input v-model="editArr.label"></el-input>
				</el-form-item>
				<!-- <el-upload class="upload-demo" action="http://image.sfdai.com/api/image" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
				  <el-button size="small" type="primary">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload> -->
				<!-- <el-form-item label="菜单图标：">
					<el-input v-model="showEdit.icon" style='width: 300px;' type='file'></el-input>
					<el-button type="primary" @click='addPic'>上传</el-button>
				</el-form-item> -->
				<el-form-item label="上级目录：">
					<el-cascader @change="clickonEdit" expand-trigger="hover" change-on-select v-model="menulist" :options="roleMenu" :show-all-levels="false"></el-cascader>
				</el-form-item>
				<el-form-item label="排序：">
					<el-input v-model="editArr.sorting"></el-input>
				</el-form-item>
				<!-- <el-col :span='24'> -->
					<el-col :span='2' :offset="1">菜单类型：</el-col>
					<!-- <el-col :span='3'> -->
						<el-select v-model="edit_type" placeholder="选择" style="padding-bottom: 10px;
    margin-top: -7px;
    margin-left: 5px;">
					      <el-option v-for="item in list" :label="item.label" :value="item.value">
					      </el-option>
					    </el-select>
					<!-- </el-col> -->
				<!-- </el-col> -->
				<el-form-item label="访问路径：">
					<el-input v-model="editArr.resUrl"></el-input>
				</el-form-item>
				<el-form-item label="描述：">
					<el-input type="textarea" v-model="editArr.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showEdit = false">取消</el-button>
				<el-button type="primary" @click.native="treeEditSubmit" :loading="addLoading">确认</el-button>
			</div>
		</el-dialog>
		<!--新增人员界面-->
		<el-dialog title="新增角色" v-model="addFormVisible1" :close-on-click-modal="false">
			<el-form :model="addrole" label-width="180px" :rules="addFormRules" ref="addrole">
				<!-- <el-form-item label="状态：">
					<el-checkbox v-model="checked">是否有效</el-checkbox>
				</el-form-item> -->
				<el-form-item label="组织名称：" prop="name">
					<el-input v-model="addrole.name" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="用户角色："> -->
					<!-- <el-cascader expand-trigger="hover" :options="options" :show-all-levels="false"></el-cascader> -->
				<!-- </el-form-item> -->
				<el-form-item label="上级组织：">
					<el-input v-model="addrole.name2" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述描述：">
					<el-input type="textarea" v-model="addrole.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible1 = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
			</div>
		</el-dialog>

		<!--查看界面-->
		<el-dialog title="查看" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="180px" :rules="addFormRules" ref="addrole">
				<el-form-item label="状态：">
					<el-input v-model="editForm.isValid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路径：">
					<el-input v-model="editForm.resUrl" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<!-- <el-tree :data="data3" show-checkbox="" default-expand-all="" node-key="id" ref="tree" highlight-current :props="defaultProps" style="border: none">
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div> -->
		</el-dialog>
		<!-- 修改 -->
		<el-dialog title="修改" v-model="editFormVisible1" :close-on-click-modal="false">
			<el-form :model="editTree" label-width="180px" :rules="addFormRules" ref="editTree">
				<el-form-item label="状态：">
					<el-input v-model="editTree.isValid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="editTree.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路径：">
					<el-input v-model="editTree.resUrl" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible1 = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</el-row>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {sysUrl , editUser, addUser } from '../../api/api';
	export default {
		data() {
			return {
				ziTreeID:[],
				pID:'',
				curTreeID:'',//当前树节点的ID
				editFormVisible: false,//编辑界面是否显示
				editFormVisible1:false,
				checked:false,
				EditValid:false,
				type:'',
				selectedOptions:[],//默认上级菜单
				addLoading: false,
				editLoading: false,
				addFormVisible: false,//新增界面是否显示
				showEdit:false,// 显示修改页面
				addFormVisible1: false,//新增界面是否显示
				value:'',				//新增界面数据
				menulist:[],
				roleMenu: [],
				delID:[],
				editArr:[],
				edit_type:'',
				delArr:[],//树 删除数组id
				editForm:{},
				editTree:{},
				addForm: {
					name: '',
					parentId: '',
					resUrl: '',
					type: '',
					icon: '',
					description: '',
					isValid: '',
					sort:''
				},
				addrole: {
					name: '111',
					name1: '',
					name2: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
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
					label:'菜单'
				},{
					value:'2',
					label:'功能'
				},{
					value:'3',
					label:'按钮'
				}],
				listLoading:false,
				MenuData:[],
		        table:[],
		        fileList:[],
		        defaultProps: {
		          children: 'children',
		          label: 'label'
        		}
			}
		},
		methods: {
			clic(row,index,col){
				console.log(row,index,col)
				this.delArr = []
				this.delArr.push(row.id)
				this.editArr = row
				this.editArr.sorting = row.sort
				this.menulist = []
				this.menulist.push(row.id)
				console.log(this.menulist)
			},
			//修改节点树
			onEditBtn(){
				this.showEdit = true
				console.log(this.editArr)
				if(this.editArr.isValid === 1){
					this.EditValid = true
				}else{
					this.EditValid = false
				}
				if(this.editArr.type === 1){
					this.edit_type = '菜单'
				}else if(this.editArr.type === 2){
					this.edit_type = '功能'
				}else{
					this.edit_type = '按钮'
				}
				// console.log(this.editArr)
			},
			//删除树节点
			onDelBtn(){
				let _this = this
				console.log(1)
				const params = {
			            accountId:"1",
			            accessToken:"1",
			            resources:{
			            	id:this.delArr.join(',')
			            }
		        	}
		        console.log(params)
		        this.$confirm('确认删除该节点么吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/resources/del",
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
		             	_this.listAllParentMenu();
		             	_this.menulistFun()
		              }
		         	)
				}).catch(() => {

				});
			},
			//修改树节点
			treeEditSubmit(){
				let _this = this
				if(this.EditValid === false){
					_this.editArr.isValid = 0
				}else{
					_this.editArr.isValid = 1
				}
				const params = {
			            accountId:"1",
			            accessToken:"1",
			            account:{
			            	id:_this.editArr.id,
			            	name:_this.editArr.label,
			            	parentId:'13',//修改
			            	resUrl:_this.editArr.resUrl,
			            	type:_this.edit_type,
			            	// icon:'',
			            	description:_this.editArr.description,
			            	isValid:_this.editArr.isValid,
			            	sort:_this.editArr.sorting
			            }
		        	}
		        console.log(params)
		        this.$confirm('确认修改吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/resources/update",
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
		              }
		         	)
				}).catch(() => {

				});
				_this.showEdit = false
			},
			clickon(row){
				this.ziTreeID = row[row.length-1]
			},
			clickonEdit(row){
				this.ziTreeID = row[row.length-1]
				console.log(row)
				this.selectedOptions = row
			},
			handleRemove(file, fileList) {
		        console.log(file, fileList);
		      },
		      handlePreview(file) {
		        console.log(file);
		        console.log(this.fileList)
		      },
			addPic () {
		      $('input[type=file]').trigger('click')
		      return false
		    },
			formatter(row,column){
				const code = row.isValid;
				let stae
				if(code === 1){
					stae = '有效'
				}else{
					stae = '无效'
				}
				return stae
			},
			handleNodeClick(data) {
				this.table = []
				const list = data.children
				this.curTreeID = data.id
				if(!data.children){
	        		return
	        	}
				if(data.children[0].children){
					return
				}
				console.log(data)
				this.pID = data.id
	        	for(var i = 0;i<list.length;i++){
	        		let obj = {}
	        		obj.id = list[i].id
	        		obj.name = list[i].label
	        		obj.isValid = list[i].isValid
	        		obj.resUrl = list[i].resUrl
	        		obj.type = list[i].type
	        		obj.icon = list[i].icon
	        		obj.description = list[i].description
	        		obj.sort = list[i].sort
	   				this.table.push(obj)
	        	}
	        },
			listAllParentMenu() {
				let _this = this
				_this.MenuData = []
				this.listLoading = true;
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
		                		_this.nodes(list[i].nodes,chlid);
		                		_this.MenuData.push(father)
		                	}
		                }
		                console.log(_this.MenuData)
		            }
		        )
		        this.listLoading = false;
			},
			//解析tree数据及数据再整理
			nodes(list,chlid){
				for(var x = 0;x<list.length;x++){

					var childrens = {}
					childrens.id = list[x].id
					childrens.label = list[x].name
					childrens.isValid = list[x].isValid
		            childrens.resUrl = list[x].resUrl
					if(list[x].nodes.length !== 0){
						var chlids = []
						childrens.children = chlids
						this.nodes(list[x].nodes,chlids);
					}
					chlid.push(childrens)
				}
			},
			//新增页面的菜单树🌲
			menulistFun() {
				let _this = this
				_this.roleMenu = []
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
					var childrens = {};
					childrens.value = list[x].id;
					childrens.label = list[x].name;
					if(list[x].nodes.length !== 0){
						var chlids = []
						childrens.children = chlids
						this.menunodes(list[x].nodes,chlids);
					}
					chlid.push(childrens)
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//显示查看界面
			handleEdit: function (index, row) {
				console.log(row)
				this.editFormVisible = true;
				if(row.isValid === 1){
					row.isValid = '有效'
				}else{
					row.isValid = '无效'
				}
				this.editForm = row;
			},
			//修改
			handleeditTree: function (index, row) {
				this.editFormVisible1 = true;
				if(row.isValid === 1){
					row.isValid = '有效'
				}else{
					row.isValid = '无效'
				}
				this.editTree = row
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//显示新增界面
			handleAdd1: function () {
				this.addFormVisible1 = true;
				this.addrole = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//修改
			editSubmit: function () {
				let _this = this
				console.log(_this.editTree)
				const params = {
		            "accountId":"1",
		            "accessToken":"1",
		            "resources":{
		                  "id":_this.editTree.id,
		                  "name":_this.editTree.name,
		                  "parentId":_this.curTreeID,
		                  "type":_this.editTree.type,
		                  "icon":_this.editTree.icon,
		                  "description":_this.editTree.description,
		                  "isValid":_this.editTree.isValid,
		                  "sort":_this.editTree.sort,
		                  "resUrl":_this.editTree.resUrl
		            }
		        }
			    console.log(params)
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/resources/update",
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
		             	_this.getChildrenList(_this.pID)
						_this.editFormVisible1 = false;
		              }
		         	)
				}).catch(() => {

				});
			},
			// 删除节点
			delTree: function (index, row){
				let _this =this
				console.log(row)
				const params = {
		            "accountId":"1",
		            "accessToken":"1",
		            "account":{
		                  "id":row.id
		            }
		        }
		        this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/resources/del",
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
		             	_this.getChildrenList(_this.pID)
		              }
		         	)
				}).catch(() => {
				});
			},
			getChildrenList(id){
				let _this =this
				const params = {
		            "accountId":"1",
		            "accessToken":"1",
		            "resources":{
		                  "id":id
		            }
		        }
		        console.log(params)
		        $.post(sysUrl+"/backstage/resources/getChildrenList",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		                const list = response.obj
		                _this.table = []
		                for(var i = 0;i<list.length;i++){
		                	let obj = {}
			        		obj.id = list[i].id
			        		obj.name = list[i].name
			        		obj.isValid = list[i].isValid
			        		obj.resUrl = list[i].resUrl
			        		obj.type = list[i].type
			        		obj.icon = list[i].icon
			        		obj.description = list[i].description
			        		obj.sort = list[i].sort
			   				_this.table.push(obj)
		                }
		              }
		         	)
			},
			editSubmit1: function () {
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
								this.editFormVisible1 = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				console.log(this.menulist);
				console.log(this.checked);
				if(this.checked === true){
					this.addForm.isValid = 1
				}else {
					this.addForm.isValid = 0
				}
				let _this =this
				const params = {
		            "accountId":"1",
		            "accessToken":"1",
		            "resources":{
		                  name:this.addForm.name,
		                  parentId:this.ziTreeID,
		                  resUrl:this.addForm.resUrl,
		                  type:this.type,
		                  description:this.addForm.description,
		                  isValid:this.addForm.isValid,
		                  sort:this.addForm.sort
		            }
		        }
		        console.log(params)
		        this.$confirm('确认？', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(sysUrl+"/backstage/resources/add",
			             { param: JSON.stringify(params) },
			             function(data){
			             	const info = eval('(' + data + ')');
			                const response = JSON.parse(info);
			                console.log(response);
			                _this.addFormVisible = false
			                _this.listAllParentMenu();
			                _this.menulistFun();
			              }
			         );
				}).catch(() => {

				});
			},
			selsChange: function (sels) {
				this.delID = [];
				for(var i=0;i<sels.length;i++){
					this.delID.push(sels[i].id);
				}
			},
			//批量删除
			batchRemove: function () {
				let _this = this
				const params = {
		            "accountId":'1',
		            "accessToken":'1',
		            "ids":this.delID.join(',')
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
			              }
			         );
				}).catch(() => {

				});
			}
		},
		mounted() {
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