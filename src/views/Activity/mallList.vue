<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-select v-model="filters.categoryId" placeholder="商品分类" clearable>
			      <el-option v-for="item in commodityList" :label="item.title" :value="item.id">
			      </el-option>
			    </el-select>
				<el-form-item>
					<el-input v-model="filters.title" placeholder="商品标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCommodityList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加商品</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="mall_list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="title" label="标题" width="120" >
			</el-table-column>
			<el-table-column prop="commodityCategory.title" label="分类" width="125">
			</el-table-column>
			<el-table-column prop="count" label="库存数量" width="120">
			</el-table-column>
			<el-table-column prop="restCount" label="剩余数量" width="120">
			</el-table-column>
			<el-table-column label="VIP等级" width="120">
				<template scope="scope">
					<span v-if='scope.row.levelId === 10'>普通会员</span>
					<span v-else-if='scope.row.levelId === 20'>vip会员</span>
					<span v-else-if='scope.row.levelId === 30'>svip会员</span>
					<span v-else></span>
				</template>
			</el-table-column>
			<el-table-column label="类型" width="120">
				<template scope="scope">
					<span v-if='scope.row.typeId === 10'>虚拟商品</span>
					<span v-else-if='scope.row.typeId === 20'>实物商品</span>
					<span v-else></span>
				</template>
			</el-table-column>
			<el-table-column prop="index" label="排序" width="80">
			</el-table-column>
			<el-table-column label="展示缩略图" width="140">
				<template scope="scope">
					<img class="goods-image-thumb" :src='scope.row.imageThumb'>
				</template>
			</el-table-column>
			<el-table-column prop="consumptionPoints" label="消耗积分" width="120">
			</el-table-column>
			<el-table-column label="是否是活动" width="120">
				<template scope="scope">
					<span v-if='scope.row.isActivity === true'>是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column label="是否发布" width="120">
				<template scope="scope">
					<span v-if='scope.row.isRelease === true'>是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-row :gutter="10">
					<el-col :xs="24" :md="12">
						<el-form-item label="商品分类:">
							<el-select v-model="editForm.categoryId" placeholder="请选择">
				      			<el-option v-for="item in commodityList" :label="item.title" :value="item.id">
				      			</el-option>
				    		</el-select>
			    		</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="商品标题:">
							<el-input v-model="editForm.title" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="库存数量:">
							<el-input type="number" v-model="editForm.count" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="商品性质:">
							<el-select v-model="editForm.typeId" placeholder="请选择">
				      			<el-option v-for="item in add_type" :label="item.label" :value="item.value">
				      			</el-option>
				    		</el-select>
			    		</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="排序:">
							<el-input type="number" v-model="editForm.index" auto-complete="off"></el-input>
			    		</el-form-item>
					</el-col>
					<el-col :xs="24" :md="24">
						<el-form-item label="更换封面:">
							<img class="goods-image-thumb" :src='editForm.imageThumb'>
							<!-- 上传图片 -->
							<form style="position:relative;">
							    <input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
							    <button type="button" class="el-button el-button--primary el-button--small">
							    	<span>点击上传</span>
							    </button>
							    <button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button>
							    <span style="display: block;font-size: 12px">{{ imageChange }}</span>
							</form>
			    		</el-form-item>
					</el-col>
					<el-col :xs="24" :md="24">
						<el-form-item label="描述:">
							<el-input :rows="4" type="textarea" v-model="editForm.description"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加商品" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="10">
					<el-col :xs="24" :md="12">
						<el-form-item label="商品分类:">
							<el-select v-model="addForm.category" placeholder="请选择">
				      			<el-option v-for="item in commodityList" :label="item.title" :value="item.id">
				      			</el-option>
				    		</el-select>
			    		</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="商品标题:">
							<el-input v-model="addForm.title" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="库存数量:">
							<el-input type="number" v-model="addForm.count" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="商品性质:">
							<el-select v-model="addForm.type" placeholder="请选择">
				      			<el-option v-for="item in add_type" :label="item.label" :value="item.value">
				      			</el-option>
				    		</el-select>
			    		</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="排序:">
							<el-input type="number" v-model="addForm.index" auto-complete="off"></el-input>
			    		</el-form-item>
					</el-col>
					<el-col :xs="24" :md="24">
						<el-form-item label="上传封面:">
							<!-- 上传图片 -->
							<form style="position:relative;">
							    <input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
							    <button type="button" class="el-button el-button--primary el-button--small">
							    	<span>点击上传</span>
							    </button>
							    <button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button>
							    <span style="display: block;font-size: 12px">{{ imageChange }}</span>
							</form>
			    		</el-form-item>
					</el-col>
					<el-col :xs="24" :md="24">
						<el-form-item label="描述:">
							<el-input :rows="4" type="textarea" v-model="addForm.description"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
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
				add_type:[{
					value: 10,
					label:'虚拟'
				},{
					value: 20,
					label:'实物'
				}],
				commodityList:[],
				filters: {
					categoryId: '',
					title: ''
				},
				total: 0,
				page: 1,
				pageSize: 10,
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
					id: '',
					categoryId: '',
					title: '',
					count: '',
					typeId: '',
					imageThumb: '',
					index: '',
					description: ''
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
					category: '',
					title: '',
					count: '',
					type: '',
					index: '',
					description: ''
				},
				mall_list:[],
				// 表单
				formData: new FormData(),
				// 将上传图片的名字保存
				fileImg: ''
			}
		},
		computed: {
		    // 实时更新上传图片的名字，仅读取，值只须为函数
		    imageChange: function () {
		      return this.fileImg
		    }
	    },
		methods: {
			// 添加或编辑清空上传图片
			clear(){
				let btn = document.getElementById("btnClear");
     			let files = document.getElementById("fileInput");
     			this.fileImg = '';
				// for IE, Opera, Safari, Chrome
		        if (files !== null && files.value) {
		        //     files.outerHTML = files.outerHTML;
		        // } else { // FF(包括3.5)
	            	files.value = "";
	            	this.formData = new FormData()
		        }
			},
			// 添加或编辑上传图片
			upload (event) {
				this.formData = new FormData()
                let file = event.target.files[0]
                // console.log(file)
                const self = this
                // const flag = this.flag
                if (file) {
                	console.log('存在file', file)
                	this.fileImg = file.name
                    // console.log(this.formData)
                    this.formData.append('file', file)
                } else {
                	this.fileImg = ''
                	console.log('不存在file', file)
                	this.formData = new FormData()
                }
            },
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCommodityList();
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					const params = {
			        	accountId: '',
			        	accessToken: '',
			        	resourceType: '',
			            id: row.id
			        }
			        let that = this
		         	$.post(baseUrl+"/admin/commodity/deleteCommodityById",
			            { param: JSON.stringify(params) },function(data){
			              	const info = JSON.parse(eval('(' + data + ')'));
			              	console.log(info)
			              	if(info.res === state.HTTPCODE.SUCCEED){
			              		that.$message({
			              			message: info.resMsg,
			              			type: 'success'
			              		});
			              		that.getCommodityList()
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
					// NProgress.start();
					// let para = { id: row.id };
					// removeUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '删除成功',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				// 打开编辑前先清空上传处图片
				this.clear();
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				// 打开添加前先清空上传处图片
				this.clear();
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							// this.editLoading = true;
							const _this= this
							// const flag = this.flag
							// console.log(flag)
							const params={
								accountId:'1',
								accessToken:'1',
								resourceType:'',
								commodityEntity: {
									id: this.editForm.id,
									categoryId: this.editForm.categoryId,
									title: this.editForm.title,
									count: this.editForm.count,
									typeId: this.editForm.typeId,
									index: this.editForm.index,
									description: this.editForm.description,
								}
							}
							this.formData.append('param', JSON.stringify(params))
							// console.log(this.formData)
			                _this.$http.post(baseUrl+"/admin/commodity/updateCommodityById", _this.formData, {
	                        	progress(event) {
		                            //传递给父组件的progress方法
		                            // _this.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
		                        }
                            })
                            .then(response => {
                            	_this.formData = new FormData()
                            	console.log(response)
                            	const info = JSON.parse(eval('(' + response.bodyText + ')'));
                                // const info = response.body
                                console.log(info.res)
                                _this.editLoading = false;
                                if(info.res === state.HTTPCODE.SUCCEED){
        		                	_this.$message({
        		                		message: info.resMsg,
        		                		type: 'success'
        		                	});
        		                	_this.editFormVisible = false;
        		                	_this.getCommodityList();
        		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
        		                	_this.$message({
        		                		message: info.resMsg,
        		                		type: 'error'
        		                	});
        		              	}else if(info.res === state.HTTPCODE.FAIL){
        		              		_this.$message({
        		              			message: info.resMsg,
        		              			type: 'error'
        		              		});
        		              	}
                                // if (result.hash && result.key) {
                                //     //传递给父组件的complete方法
                                //     _this.$emit('complete', 200 , result, flag)
                                //     //让当前target可以重新选择
                                //     event.target.value = null
                                // } else {
                                //     _this.$emit('complete', 500, result, flag)
                                // }
                            }, error => _this.$emit('complete', 500, error.message))
							//NProgress.start();
							// let para = Object.assign({}, this.editForm);
							// para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							// editUser(para).then((res) => {
							// 	this.editLoading = false;
							// 	//NProgress.done();
							// 	this.$message({
							// 		message: '提交成功',
							// 		type: 'success'
							// 	});
							// 	this.$refs['editForm'].resetFields();
							// 	this.editFormVisible = false;
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
							// this.addLoading = true;
							const _this= this
							// const flag = this.flag
							// console.log(flag)
							const params={
								accountId:'1',
								accessToken:'1',
								resourceType:'',
								commodityEntity: {
									categoryId: this.addForm.category,
									title: this.addForm.title,
									count: this.addForm.count,
									typeId: this.addForm.type,
									index: this.addForm.index,
									description: this.addForm.description,
								}
							}
							this.formData.append('param', JSON.stringify(params))
							// console.log(this.formData)
			                _this.$http.post(baseUrl+"/admin/commodity/addCommodity", _this.formData, {
	                        	progress(event) {
		                            //传递给父组件的progress方法
		                            // _this.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
		                        }
                            })
                            .then(response => {
                            	console.log(response)
                            	const info = JSON.parse(eval('(' + response.bodyText + ')'));
                                // const info = response.body
                                console.log(info.res)
                                _this.addLoading = false;
                                if(info.res === state.HTTPCODE.SUCCEED){
        		                	_this.$message({
        		                		message: info.resMsg,
        		                		type: 'success'
        		                	});
        		                	_this.addFormVisible = false;
        		                	_this.getCommodityList();
        		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
        		                	_this.$message({
        		                		message: info.resMsg,
        		                		type: 'error'
        		                	});
        		              	}else if(info.res === state.HTTPCODE.FAIL){
        		              		_this.$message({
        		              			message: info.resMsg,
        		              			type: 'error'
        		              		});
        		              	}
                                // if (result.hash && result.key) {
                                //     //传递给父组件的complete方法
                                //     _this.$emit('complete', 200 , result, flag)
                                //     //让当前target可以重新选择
                                //     event.target.value = null
                                // } else {
                                //     _this.$emit('complete', 500, result, flag)
                                // }
                            }, error => _this.$emit('complete', 500, error.message))
						});
					}
				});
			},
			//图片上传
			handleRemove(file, fileList) {
		        console.log(file, fileList);
	      	},
	      	handlePreview(file) {
		        console.log(file);
	      	},
	      	// 获得商品分类
			getCommodityCategoryList() {
				// this.listLoading = true
				const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: ''
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/commodityCategory/getAllCategory",
		            { param: JSON.stringify(params) },function(data){
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
	                	that.commodityList = info.obj
		            }
		       	);
	         	that.listLoading = false
         	},
         	// 商品管理列表
			getCommodityList() {
				this.listLoading = true
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: '',
		            page: {
		              pageSize: this.pageSize,
		              pageNum: this.page
		            },
		            commodityEntity: {
		            	categoryId: this.filters.categoryId,
		            	title: this.filters.title
		            }
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/commodity/getCommodityByParams",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	that.listLoading = false
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	that.mall_list = info.obj.results
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
			this.getCommodityCategoryList();
			this.getCommodityList();
		}
	}

</script>

<style lang="scss">
	.goods-image-thumb{
		width: 100px;
	}
	.el-upload-list__item{
		.el-upload-list__item-thumbnail{
			width: 100px;
		}
	}
	.btn{
		display: inline-block;
		width: 100%;
	}
  	.el-upload__input{
  		display:none;
  	}
  	.el-upload{display:inline-block;text-align:center;cursor:pointer}
</style>