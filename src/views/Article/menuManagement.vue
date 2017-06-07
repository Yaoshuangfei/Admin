<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
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
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增菜单</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="iconUrl" label="图标">
				<template scope="scope">
					<img class="goods-image-thumb" :src='scope.row.iconUrl'>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="名称">
			</el-table-column>
			<el-table-column prop="value" label="跳转地址">
			</el-table-column>
			<el-table-column prop="index" label="排序值">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button v-if='scope.row.index === 1' type='text' size="small" @click="handleEdit(scope.$index, scope.row)">暂停</el-button> -->
					<!-- <el-button v-else-if='scope.row.index === 0' :disabled="true" type='text' size="small" @click="handleEdit(scope.$index, scope.row)">已处理</el-button> -->
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
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="图标名称：">
					<el-input v-model="editForm.title"></el-input>
				</el-form-item>
				<el-form-item label="排序值">
					<el-input v-model="editForm.index"></el-input>
				</el-form-item>
				<el-form-item label="图片：">
					<img class="goods-image-thumb" :src='editForm.iconUrl'>
					<form style="position:relative;">
					    <input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
					    <button type="button" class="el-button el-button--primary el-button--small">
					    	<span>点击上传</span>
					    </button>
					    <button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button>
					    <span style="display: block;font-size: 12px">{{ imageChange }}</span>
					</form>
				</el-form-item>
				<el-col :span="24" style=" ">
					<el-col :span='5' :offset='1'>
						<el-select v-model="entryType" placeholder="请选择链接类型">
					    	<el-option v-for="item in options" :label="item.label" :value="item.value">
					    	</el-option>
					  </el-select>
					</el-col>
					<el-col :span='6' :offset='1'>
						<el-input v-model="value" auto-complete="off"></el-input>
					</el-col>
				</el-col>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">取消</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="图标名称：">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序值：">
					<el-input v-model="addForm.index" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :span="24">
					<el-col :span='5' :offset='1'>
						<el-select v-model="enterType" placeholder="请选择链接类型">
					    	<el-option v-for="item in options" :label="item.label" :value="item.value">
					    	</el-option>
					  </el-select>
					</el-col>
					<el-col :span='6' :offset='1'>
						<el-input v-model="value" auto-complete="off"></el-input>
					</el-col>
				</el-col>
				<el-col :xs="24" :md="24">
						<el-form-item label="图片:">
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
				<el-button style="margin-left: 43%;" type='primary' @click='add'>提交</el-button>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<!-- <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button> -->
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
				checked: true,
				entryType:'',
				enterType:'',
				// 表单
				formData: new FormData(),
				// 将上传图片的名字保存
				fileImg: '',
				formData: new FormData(),
				value:'',
				value1:'',
				value2:'',
				options: [{
		          value: '10',
		          label: '标的ID'
		        }, {
		          value: '30',
		          label: 'H5页面'
		        }, {
		          value: '20',
		          label: '文章链接'
		        }, {
		          value: '40',
		          label: '每日签到'
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
				table:[{
					id:"充值预热",
					jhnane:'',
					phone:"",
					username:"",
					gmje:'',
					index:1
				},{
					id:"安全保障",
					jhnane:'',
					phone:"",
					username:"",
					gmje:'',
					index:1
				},{
					id:"新手指南",
					jhnane:'',
					phone:"",
					username:"",
					gmje:'',
					index:1
				},{
					id:"分享有礼",
					jhnane:'',
					phone:"",
					username:"",
					gmje:'',
					index:1
				}]
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
                console.log(file)
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
            // 编辑
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
								mainMenuEntity: {
									title: this.editForm.title,
									index: this.editForm.index,
									entryType: this.entryType,
									id:this.editForm.id,
									value: this.value,
									iconUrl:this.editForm.iconUrl
								}
							}
							console.log(params)
							this.formData.append('param', JSON.stringify(params))
							// console.log(this.formData)
			                _this.$http.post(baseUrl+"/admin/mainMenu/updateMainMenuById", _this.formData, {
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
        		              	_this.editFormVisible = false;
        		                _this.getlist();
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
			getlist(){
				const _this = this
				_this.table = []
				const params = {
					accountId:'1',
					accessToken:'1',
					resourceType:'',
					page:{
						pageNum:_this.page,
						pageSize:'10'
					}
				}
				console.log(params)
				$.post(baseUrl+'/admin/mainMenu/getAllMainMenu',
				{param: JSON.stringify(params)},
				function(data){
					const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                const list = response.obj.results
	                console.log(response)
	                _this.total = response.obj.totalRecord
	                for(var i = 0;i<list.length;i++){
	                	_this.table.push(list[i])
	                }
				})
			},
			// add(){
			// 	const _this= this
			// 	const flag = this.flag
			// 	_this.table = []
			// 	const params={
			// 		accountId:'1',
			// 		accessToken:'1',
			// 		resourceType:'',
			// 		mainMenuEntity:{
			// 			title:this.addForm.title,
			// 			index:this.addForm.index,
			// 			entryType:this.enterType,
			// 			value:this.value
			// 		}
			// 	}
			// 	console.log(params)
   //              this.formData.append('param', JSON.stringify(params) )
   //              _this.$http.post(baseUrl+'/admin/mainMenu/addMainMenu', _this.formData, {
   //                      progress(event) {
   //                          //传递给父组件的progress方法
   //                          _this.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
   //                      }
   //                  })
   //                  .then(response => {
   //                  	console.log(response)
   //                      const result = response.body
   //                      _this.addFormVisible = false
   //                      _this.getlist();
   //                      if (result.hash && result.key) {
   //                          //传递给父组件的complete方法
   //                          _this.$emit('complete', 200 , result, flag)
   //                          //让当前target可以重新选择
   //                          event.target.value = null
   //                      } else {
   //                          _this.$emit('complete', 500, result, flag)
   //                      }
   //                  }, error => _this.$emit('complete', 500, error.message), flag)
			// },
			add(){
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
							const _this= this
							_this.table = []
							const params={
								accountId:'1',
								accessToken:'1',
								resourceType:'',
								mainMenuEntity:{
									title:this.addForm.title,
									index:this.addForm.index,
									entryType:this.enterType,
									value:this.value
								}
							}
							this.formData.append('param', JSON.stringify(params))
							// console.log(this.formData)
			                _this.$http.post(baseUrl+"/admin/mainMenu/addMainMenu", _this.formData, {
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
        		                	_this.getlist();
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
                            }, error => _this.$emit('complete', 500, error.message))
						});
			},
			upload1 (event) {
                let file = event.target.files[0]
                console.log(file)
                const self = this
                const flag = this.flag
                if (file) {
                    console.log(this.formData)
                    self.formData.append('file', file)
                }
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			//删除
			handleDel: function (index, row) {
				console.log(row)
				const _this = this
				const params ={
					accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            id:row.id
				}
				console.log(params)
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(baseUrl+"/admin/mainMenu/deleteMainMenuById",
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
		             	_this.getlist();
		              }
		         	)
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = row
				this.entryType =  row.entryType.toString()
				// if(row.entryType === 10){
				// 	this.entryType =  '标的ID'
				// }else if(row.entryType === 20){
				// 	this.entryType = '文章链接'
				// }else if(row.entryType === 30){
				// 	this.entryType = 'H5页面'
				// }else if(row.entryType === 40){
				// 	this.entryType = '每日签到'
				// }
				this.value = row.value
				console.log(this.editForm)
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
			this.getlist();
		}
	}

</script>

<style scoped>
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