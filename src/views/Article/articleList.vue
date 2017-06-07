<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="文章标题关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加一级类目</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="news" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px">
			<el-table-column type="index" label="序号">
			</el-table-column>
			<el-table-column prop="title" label="标题">
			</el-table-column>
			<el-table-column prop="description" label="关键字说明">
			</el-table-column>
			<el-table-column prop="nid" label="识别ID(nid)">
			</el-table-column>
			<el-table-column label="内容管理">
				<template scope="scope">
					<router-link :to="{ name: '新闻资讯', params: { id: scope.row.id }}">
						<el-button  type="text" size="small">管理下一级内容</el-button>
					</router-link>
				</template>
			</el-table-column>
			<el-table-column label="操作" >
				<template scope="scope">
					<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="关键字说明">
					<el-input v-model="editForm.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="识别ID(nid)">
					<el-input v-model="editForm.nid" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加一级类目" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="关键字说明">
					<el-input v-model="addForm.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="识别ID(nid)">
					<el-input v-model="addForm.nid" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl , editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				curID:0,
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
					id:'',
					title:'',
					description:'',
					nid:''
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
					title: '',
					description: '',
					nid: ''
				},
				news:[]
			}
		},
		methods: {
			//获取文章列表
			getarticleList(){
				const _this = this
				_this.news = []
				_this.curID = 0
				_this.listLoading = true
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            page:{
		            	pageNum:this.page,
		            	pageSize:'10'
		            }
				}
				console.log(params)
				$.post(baseUrl+"/admin/articleType/findAtricleTypeByPage",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj.results
		                _this.total = response.obj.totalRecord
		                console.log(response)
		                for(var i = 0;i<list.length;i++){
		                	let obj ={}
		                	obj.deleted = list[i].deleted
		                	obj.description = list[i].description
		                	obj.id = list[i].id
		                	obj.nid = list[i].nid
		                	obj.title = list[i].title
		                	_this.news.push(obj)
		                }
		                _this.listLoading = false
		              }
		         );
			},
			public(params,url){
				$.post(baseUrl+url,
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                return response
		              }
		         );
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				if(this.curID === 0){
					this.getarticleList();
				}else if(this.curID === 1){
					this.query();
				}
			},
			//查询文章列表
			query() {
				const _this = this
				_this.news = []
				_this.curID = 1
				_this.listLoading = true
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            title:_this.filters.name,
		            page:{
		            	pageNum:this.page,
		            	pageSize:'10'
		            }
				}
				console.log(params)
				$.post(baseUrl+"/admin/articleType/findArticleTypeByTitle",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj.results
		                console.log(response)
		                if(list === null){
		                	alert("查询内容不存在")
		                	_this.listLoading = false
		                	return
		                }
		                for(var i = 0;i<list.length;i++){
		                	let obj ={}
		                	obj.deleted = list[i].deleted
		                	obj.description = list[i].description
		                	obj.id = list[i].id
		                	obj.nid = list[i].nid
		                	obj.title = list[i].title
		                	_this.news.push(obj)
		                }
		                _this.listLoading = false
		              }
		         );
			},
			//添加一级类目
			addSubmit: function () {
				const _this = this
				// _this.listLoading = true
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            articleTypeEntity:{
		            	title:_this.addForm.title,
		            	description:_this.addForm.description,
		            	nid:_this.addForm.nid
		            }
				}
				console.log(params)
				this.$confirm('确认添加该类目吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(baseUrl+"/admin/articleType/insertArticleType",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		                _this.addFormVisible = false
		             	if(response.res === 1000000){
							_this.$message({
								message: '添加成功',
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg,
								type: 'error'
							});
		             	}
		     			_this.getarticleList()
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
			//编辑 editForm
			editSubmit: function () {
				const _this = this
				console.log(_this.editForm)
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            articleTypeEntity:{
		            	id:_this.editForm.id,
		            	title:_this.editForm.title,
		            	description:_this.editForm.description,
		            	nid:_this.editForm.nid
		            }
				}
				console.log(params)
				this.$confirm('确认添加该类目吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(baseUrl+"/admin/articleType/updateArticleTypeById",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		                _this.editFormVisible = false
		             	if(response.res === 1000000){
							_this.$message({
								message: '添加成功',
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg,
								type: 'error'
							});
		             	}
		     			_this.getarticleList()
						_this.listLoading = false;
		              }
		         	)
				}).catch(() => {

				});
			},
			//删除
			handleDel: function (index, row) {
				const _this = this
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            id:row.id
				}
				console.log(row.params)
				this.$confirm('确认删除该类目吗?', '提示', {
					type: 'warning'
				}).then(() => {
					_this.listLoading = true
					$.post(baseUrl+"/admin/articleType/deleteTypeById",
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
								message: response.resMsg,
								type: 'error'
							});
		             	}
		     			_this.getarticleList()
						_this.listLoading = false;
		              }
		         	)
				}).catch(() => {

				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
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
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getarticleList();
		}
	}

</script>

<style scoped>

</style>