<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="文章标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="findArticle">查询</el-button>
				</el-form-item>
				<el-form-item>
					<router-link :to="{ name: '添加文章', params: { id: this.$route.params.id }}">
						<el-form-item>
							<el-button type="primary">发布文章</el-button>
						</el-form-item>
					</router-link>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="news" border highlight-current-row v-loading="listLoading"  style="width: 100%;min-width: 1080px">
			<el-table-column prop="id" label="ID" width='150'>
			</el-table-column>
			<el-table-column prop="title" label="标题" width='300'>
			</el-table-column>
			<el-table-column prop="updateTime" :formatter = "formatter" label="发布时间" width='200'>
			</el-table-column>
			<el-table-column prop="sortIndex" label="排序" width='150'>
			</el-table-column>
			<el-table-column label="是否隐藏" width='150'>
				<template scope="scope">
					<span v-if="scope.row.disabled === 0">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" >
				<template scope="scope">
					<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
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
		<el-dialog title="详情" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题">
					<el-input v-model="editForm.title"></el-input>
				</el-form-item>
				<el-form-item label="文章来源">
					<el-input v-model="editForm.source"></el-input>
				</el-form-item>
				<el-form-item label="文章作者">
					<el-input v-model="editForm.author"></el-input>
				</el-form-item>
				<el-form-item label="发布时间">
					<el-input v-model="editForm.updateTime"></el-input>
				</el-form-item>
				<!-- <el-form-item label="内容简介"> -->
					<!-- <el-input v-model="editForm.description"></el-input> -->
				<!-- </el-form-item> -->
				<el-form-item label="内容">
					<el-input v-model="editForm.body"></el-input>
				</el-form-item>
			</el-form>
			<!-- <div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div> -->
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加一级类目" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="关键字说明">
					<el-input v-model="addForm.key" auto-complete="off"></el-input>
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
				filters: {
					title: ''
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
					title: '',
					key: '',
					nid: ''
				},
				news:[]
			}
		},
		methods: {
			formatter(row,column){
				let curTime = row.createTime;
				curTime = new Date(curTime).toLocaleString()
				return curTime
			},
			// 获取文章列表
			getArticlelist(){
				const _this = this
				_this.news = []
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            articleTypeEntity:{
		            	id:_this.$route.params.id,
		            },
		            page:{
		            	pageNum:_this.page,
		            	pageSize:'10'
		            }
				}
				// console.log(params)
				$.post(baseUrl+"/admin/article/findArticleByTypeId",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj.results
		                if(list === null ){
		                	alert("查询内容不存在")
		                	_this.listLoading = false
		                	return
		                }
		                _this.total = response.obj.totalRecord
		                // console.log(response)
		                for(var i = 0;i<list.length;i++){
		                	let obj ={}
		                	obj.author = list[i].author
		                	obj.body = list[i].body
		                	obj.createTime = list[i].createTime
		                	obj.id = list[i].id
		                	obj.title = list[i].title
		                	obj.source = list[i].source
		                	obj.articleTypeId = list[i].articleTypeId
		                	obj.updateTime = list[i].updateTime
		                	obj.disabled = list[i].disabled
		                	obj.sortIndex = list[i].sortIndex
		                	_this.news.push(obj)
		                }
		                _this.listLoading = false
		              }
		         );
			},
			handleCurrentChange(val) {
				this.page = val;
				console.log(this.page)
				this.getArticlelist();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				const _this = this
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            articleEntity:{
		            	id:row.id,
		            }
				}
				console.log(params)
				console.log(row)
				this.$confirm('确认删除该记录么吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(baseUrl+"/admin/article/deleteArticleById",
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
		     			_this.getArticlelist()
						_this.listLoading = false;
		              }
		         	)
				}).catch(() => {

				});
			},
			// 查询
			findArticle(){
				const _this = this
				_this.news = []
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            page:{
		            	pageNum:'1',
		            	pageSize:'10'
		            },
		            articleEntity:{
		            	articleTypeId:_this.$route.params.id,
		            	title:_this.filters.title
		            }
				}
				console.log(params)
				$.post(baseUrl+"/admin/article/findArticleByArticle",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj.results
		                console.log(response)
		                for(var i = 0;i<list.length;i++){
		                	let obj ={}
		                	obj.author = list[i].author
		                	obj.body = list[i].body
		                	obj.createTime = list[i].createTime
		                	obj.id = list[i].id
		                	obj.title = list[i].title
		                	obj.source = list[i].source
		                	obj.articleTypeId = list[i].articleTypeId
		                	obj.updateTime = list[i].updateTime
		                	obj.disabled = list[i].disabled
		                	obj.sortIndex = list[i].sortIndex
		                	_this.news.push(obj)
		                }
						// _this.listLoading = false;
		              }
		         	)
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				console.log(row)
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
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
			}
		},
		mounted() {
			this.getArticlelist();
		}
	}

</script>

<style scoped>

</style>